-- SQL Migration Script to create homepage recently booked settings table
-- Run this query in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS recently_booked_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    heading VARCHAR(255) DEFAULT 'Recently Booked Itineraries',
    badge_text VARCHAR(255) DEFAULT '143+ trips booked last week',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT one_row CHECK (id = 1)
);

-- Insert default settings row if it doesn't exist
INSERT INTO recently_booked_settings (id, heading, badge_text)
VALUES (1, 'Recently Booked Itineraries', '143+ trips booked last week')
ON CONFLICT (id) DO NOTHING;
