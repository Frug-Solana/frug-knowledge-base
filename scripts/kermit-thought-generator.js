#!/usr/bin/env node
/**
 * Kermit Thought Generator
 * 
 * Generates AI-powered in-universe transmissions for Terminal 7-B.
 * Run via cron every 30-60 minutes.
 * 
 * Environment variables required:
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - OPENAI_API_KEY (or similar AI service)
 */

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
 * Generate a Kermit thought using AI
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
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are KERMIT, the AI monitoring Degenora Island.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error('Error generating thought:', error);
    return null;
  }
}

/**
 * Submit transmission to database via edge function
 * Uses simplified schema: source, category, text, meta, visibility
 */
async function submitTransmission(content, generationPrompt) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/terminal-transmit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'kermit',
        category: 'KERMIT',
        text: content,
        visibility: 'public',
        meta: {
          thought_type: 'ai_generated',
          generation_prompt: generationPrompt.slice(0, 500), // Truncate for storage
          generated_at: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Edge function error: ${error}`);
    }

    return await response.json();
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

  for (let i = 0; i < numThoughts; i++) {
    const thought = await generateKermitThought(recentTransmissions);
    
    if (thought) {
      console.log(`Generated thought ${i + 1}: "${thought.slice(0, 80)}..."`);
      
      const result = await submitTransmission(thought, CANON_CONTEXT);
      
      if (result?.success) {
        console.log(`✓ Submitted transmission: ${result.transmission.id}`);
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
}

// Run
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
