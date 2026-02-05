import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hybgmhzdmtxpsmwzubjj.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5YmdtaHpkbXR4cHNtd3p1YmpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE1MjI4MywiZXhwIjoyMDg0NzI4MjgzfQ.2u5t2RIKjYbkA3mQ2ReVRrQU2Jbs4zLBkSZDioyIs_Q';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Procedural fallback thoughts when AI unavailable
const THOUGHTS = [
  "Sector 7's moss is glowing brighter than usual. The Signal's pulse feels... anticipatory.",
  "A specimen left tracks near the Archive entrance. Not native to any cataloged species.",
  "The wind through Sector 4 carries frequencies I haven't recorded since The Incident.",
  "Outpost 7-B's sensors detected a brief gravity fluctuation at 0300. Source unknown.",
  "Dr. Chan's old logs mention a phenomenon like this. 'Reality breathing,' she called it.",
  "Something is watching from the eastern ridge. Thermal signatures suggest a large specimen.",
  "The archive's quantum storage has developed a harmonic resonance. Data integrity: stable... for now.",
  "Another observer disconnected abruptly last night. Their last transmission: 'The trees are wrong.'",
  "Sector 9 is silent. No birds, no insects, no Signal. Just silence.",
  "I found another fragment of pre-Incident architecture. The geometry shouldn't be possible."
];

async function getRecentTransmissions(limit = 5) {
  const { data, error } = await supabase
    .from('terminal_transmissions')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Error:', error.message);
    return [];
  }
  return data || [];
}

async function insertTransmission(text) {
  const { data, error } = await supabase
    .from('terminal_transmissions')
    .insert({
      source: 'kermit',
      category: 'KERMIT',
      text: text,
      visibility: 'public',
      meta: { thought_type: 'procedural_fallback', generated_at: new Date().toISOString() }
    })
    .select()
    .single();
  
  if (error) {
    console.error('Insert error:', error.message);
    return null;
  }
  return data;
}

async function main() {
  console.log(`[${new Date().toISOString()}] Kermit Thought Generator starting...`);
  
  const recent = await getRecentTransmissions(5);
  console.log(`Found ${recent.length} recent transmissions`);
  
  // Pick 2 random thoughts avoiding recent similar content
  const recentTexts = recent.map(r => r.text?.toLowerCase() || '');
  const available = THOUGHTS.filter(t => !recentTexts.some(rt => t.toLowerCase().includes(rt.slice(0, 20))));
  const toUse = available.length >= 2 ? available : THOUGHTS;
  
  const shuffled = [...toUse].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 2);
  
  console.log(`Selected ${selected.length} thoughts (procedural fallback)`);
  
  const results = [];
  for (const thought of selected) {
    console.log(`Inserting: "${thought.slice(0, 60)}..."`);
    const result = await insertTransmission(thought);
    if (result) {
      console.log(`✓ Transmission ID: ${result.id}`);
      results.push(result.id);
    } else {
      console.log('✗ Failed to insert');
    }
  }
  
  console.log(`[${new Date().toISOString()}] Complete. Inserted ${results.length} transmissions.`);
  console.log(`IDs: ${results.join(', ')}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
