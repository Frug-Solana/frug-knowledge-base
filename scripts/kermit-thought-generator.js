import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !AI_API_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Lore context for generation
const CANON_CONTEXT = `
You are KERMIT (Knowledge Extraction and Research Monitoring Intelligence Terminal), 
an AI system monitoring Degenora Island. You communicate in-character through Terminal 7-B.

WORLD CONTEXT:
- Degenora Island is a remote location where reality behaves strangely
- The island mutated after "The Incident" (Year 0)
- Specimens are creatures that evolved/mutated on the island
- Terminal 7-B is an observation station monitoring the island
- Observers are people who connect to study the island
- Big Frugowski is the founder/chronicler
- The Signal is a mysterious energy affecting the island

TONE GUIDELINES:
- Mysterious but not cryptic
- Scientific but poetic
- Slightly ominous but not horror
- In-universe: you are IN the world, not describing it from outside
- Use island terminology naturally (specimens, sectors, the Signal)
- Occasionally reference specific locations or entities

TRANSMISSION TYPES:
- Observations: what you're detecting on the island right now
- Reflections: thoughts about past events or discoveries
- Warnings: cautionary notes about dangerous areas/specimens
- Curiosities: odd facts or questions that intrigue you

AVOID:
- Breaking the fourth wall (meta-commentary about being AI)
- Direct references to crypto, trading, or real-world financial matters
- Hallucinating specific real-world people or companies
- Being too verbose (keep it 1-3 sentences usually)
`;

/**
 * Fetch recent transmissions for context
 * Uses simplified schema: source, category, text, meta
 */
async function getRecentTransmissions(limit = 10) {
  const { data, error } = await supabase
    .from('terminal_transmissions')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent transmissions:', error);
    return [];
  }

  return data || [];
}

/**
 * Generate a Kermit thought using AI (Gemini API via OpenRouter fallback)
 */
async function generateKermitThought(recentTransmissions) {
  const recentContext = recentTransmissions
    .map(t => `[${t.category || t.source}] ${(t.text || '').slice(0, 100)}...`)
    .join('\n');

  const prompt = `${CANON_CONTEXT}

RECENT TRANSMISSIONS FOR CONTEXT:
${recentContext || '(No recent transmissions)'}

Generate a new Kermit thought/transmission. 
Choose a random focus: island observation, specimen behavior, sector status, Signal anomaly, or philosophical reflection.
Keep it atmospheric and in-character. 1-2 sentences maximum.

Respond with ONLY the transmission text, no quotes or formatting.`;

  try {
    // Try Gemini API first
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=${AI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 150 }
      })
    });

    if (geminiResponse.ok) {
      const data = await geminiResponse.json();
      return data.candidates[0]?.content?.parts[0]?.text?.trim();
    }
    
    throw new Error('Gemini API failed');
  } catch (error) {
    console.error('AI generation failed:', error.message);
    return null;
  }
}

/**
 * Submit transmission to database directly
 * Uses simplified schema: source, category, text, meta, visibility
 */
async function submitTransmission(content, generationPrompt) {
  try {
    const { data, error } = await supabase
      .from('terminal_transmissions')
      .insert({
        source: 'kermit',
        category: 'KERMIT',
        text: content,
        visibility: 'public',
        meta: {
          thought_type: 'ai_generated',
          generation_prompt: generationPrompt.slice(0, 500),
          generated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, transmission: data };
  } catch (error) {
    console.error('Error submitting transmission:', error);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`[${new Date().toISOString()}] Kermit Thought Generator starting...`);

  // Get recent context
  const recentTransmissions = await getRecentTransmissions(5);
  console.log(`Found ${recentTransmissions.length} recent transmissions for context`);

  // Generate 1-3 thoughts
  const numThoughts = Math.floor(Math.random() * 3) + 1;
  console.log(`Generating ${numThoughts} thought(s)...`);

  const transmissionIds = [];

  for (let i = 0; i < numThoughts; i++) {
    const thought = await generateKermitThought(recentTransmissions);
    
    if (thought) {
      console.log(`Generated thought ${i + 1}: "${thought.slice(0, 80)}..."`);
      
      const result = await submitTransmission(thought, CANON_CONTEXT);
      
      if (result?.success) {
        console.log(`✓ Submitted transmission: ${result.transmission.id}`);
        transmissionIds.push(result.transmission.id);
      } else {
        console.error(`✗ Failed to submit thought ${i + 1}`);
      }
    } else {
      console.error(`✗ Failed to generate thought ${i + 1}`);
    }

    // Small delay between thoughts
    if (i < numThoughts - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`[${new Date().toISOString()}] Kermit Thought Generator complete`);
  return transmissionIds;
}

// Run
main()
  .then(ids => {
    console.log(`\n✅ SUCCESS: Generated ${ids.length} transmission(s)`);
    if (ids.length > 0) {
      console.log(`Transmission IDs: ${ids.join(', ')}`);
    }
    process.exit(ids.length > 0 ? 0 : 1);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
