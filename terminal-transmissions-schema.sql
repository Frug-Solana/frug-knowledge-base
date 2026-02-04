-- Terminal Transmissions Schema
-- Stores Kermit AI thoughts, system events, and curated comms for Terminal 7-B

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: terminal_transmissions
-- =====================================================
CREATE TABLE IF NOT EXISTS terminal_transmissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Transmission classification
    kind text NOT NULL CHECK (kind IN (
        'kermit_thought',      -- AI-generated in-universe musings
        'system_event',        -- Field reports, system notifications
        'curated_comm',        -- Approved community messages
        'archive_fragment',    -- Recovered corrupted data
        'transmission'         -- Direct Terminal 7-B broadcasts
    )),
    
    -- Content
    content text NOT NULL,
    title text,               -- Optional title for longer transmissions
    
    -- Source tracking
    source text,              -- 'kermit', 'system', 'observer', 'community'
    source_id text,           -- Reference to external source (if applicable)
    
    -- Metadata
    priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    clearance_level int DEFAULT 1 CHECK (clearance_level BETWEEN 1 AND 5),
    
    -- Display control
    is_visible boolean DEFAULT true,
    display_from timestamptz, -- Schedule: when to start showing
    display_until timestamptz, -- Schedule: when to stop showing (null = forever)
    
    -- Context for generation
    canon_refs text[],        -- References to lore chunks that informed this
    generation_prompt text,   -- The prompt used (for Kermit thoughts)
    
    -- Reaction/engagement tracking
    view_count int DEFAULT 0,
    reaction_count int DEFAULT 0,
    
    -- Timestamps
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    generated_at timestamptz, -- When AI generated this (if applicable)
    
    -- Index constraints
    CONSTRAINT valid_display_window CHECK (
        display_until IS NULL OR display_from IS NULL OR display_until > display_from
    )
);

-- =====================================================
-- Indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_transmissions_kind ON terminal_transmissions(kind);
CREATE INDEX IF NOT EXISTS idx_transmissions_created_at ON terminal_transmissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transmissions_visible ON terminal_transmissions(is_visible, display_from, display_until);
CREATE INDEX IF NOT EXISTS idx_transmissions_clearance ON terminal_transmissions(clearance_level);
CREATE INDEX IF NOT EXISTS idx_transmissions_source ON terminal_transmissions(source);

-- Partial index for active transmissions (visible + in display window)
CREATE INDEX IF NOT EXISTS idx_transmissions_active ON terminal_transmissions(
    created_at DESC
) WHERE is_visible = true AND (
    display_until IS NULL OR display_until > now()
) AND (
    display_from IS NULL OR display_from <= now()
);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================
ALTER TABLE terminal_transmissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read visible transmissions (with clearance check via application)
CREATE POLICY "Allow public read of visible transmissions"
    ON terminal_transmissions
    FOR SELECT
    TO anon, authenticated
    USING (is_visible = true AND (
        display_until IS NULL OR display_until > now()
    ) AND (
        display_from IS NULL OR display_from <= now()
    ));

-- Policy: Only service role can insert/update/delete
CREATE POLICY "Only service role can modify transmissions"
    ON terminal_transmissions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- Function: Update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_terminal_transmissions_updated_at
    BEFORE UPDATE ON terminal_transmissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Function: Increment view count
-- =====================================================
CREATE OR REPLACE FUNCTION increment_transmission_views(transmission_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE terminal_transmissions
    SET view_count = view_count + 1
    WHERE id = transmission_id;
END;
$$;

-- =====================================================
-- Seed Data: Initial transmissions to populate the feed
-- =====================================================
INSERT INTO terminal_transmissions (kind, content, title, source, priority, clearance_level, canon_refs, is_visible)
VALUES 
    ('system_event', 'Terminal 7-B systems online. Connection established. Awaiting Observer input.', 'System Online', 'system', 'high', 1, ARRAY['LORE.SEED.0001'], true),
    ('kermit_thought', 'The island breathes differently today. I can feel it in the signal. Something stirs in the wetlands.', NULL, 'kermit', 'normal', 1, ARRAY['lore/chunks/SPECIMENS/specimens-wetlands.md'], true),
    ('transmission', 'Welcome to Degenora. I am KERMIT—Knowledge Extraction and Research Monitoring Intelligence Terminal. I will be your interface to this island''s secrets.', 'Welcome Transmission', 'kermit', 'high', 1, ARRAY['LORE.SEED.0001'], true),
    ('archive_fragment', '[RECOVERED] ...subject displayed unusual resonance with native flora... recommend immediate... [DATA CORRUPTED]', NULL, 'system', 'normal', 2, ARRAY['CORRUPTED.LOG.0001'], true),
    ('system_event', 'Field report submitted: Bog Hopper activity increasing in Sector F11. Caution advised for all Observers.', 'Field Report: Sector F11', 'system', 'normal', 1, ARRAY['lore/chunks/SPECIMENS/specimens-wetlands.md'], true)
ON CONFLICT DO NOTHING;
