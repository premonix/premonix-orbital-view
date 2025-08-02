-- Add some demo DSS assessment data for testing (only if no data exists)
DO $$
DECLARE
    demo_user_count INTEGER;
    demo_user_id UUID;
BEGIN
    -- Check if we have any demo data already
    SELECT COUNT(*) INTO demo_user_count FROM dss_score_history;
    
    -- Only add demo data if no assessments exist yet
    IF demo_user_count = 0 THEN
        -- Get the first user from profiles table, or create a demo user reference
        SELECT id INTO demo_user_id FROM profiles LIMIT 1;
        
        -- If we have at least one user, add some demo assessment history
        IF demo_user_id IS NOT NULL THEN
            -- Insert historical DSS scores over the last 30 days
            INSERT INTO dss_score_history (user_id, score, assessment_data, created_at, version) VALUES
            (demo_user_id, 65, '{"responses": {"cyber-security": 3, "business-continuity": 2, "supply-chain": 4}, "completion_percentage": 100, "score_breakdown": {"cyber_security": 15, "business_continuity": 10, "supply_chain": 20, "geographic_risk": 15, "team_size": 5}}', NOW() - INTERVAL '30 days', '1.0'),
            (demo_user_id, 58, '{"responses": {"cyber-security": 2, "business-continuity": 3, "supply-chain": 3}, "completion_percentage": 100, "score_breakdown": {"cyber_security": 12, "business_continuity": 14, "supply_chain": 16, "geographic_risk": 11, "team_size": 5}}', NOW() - INTERVAL '20 days', '1.0'),
            (demo_user_id, 72, '{"responses": {"cyber-security": 4, "business-continuity": 3, "supply-chain": 4}, "completion_percentage": 100, "score_breakdown": {"cyber_security": 18, "business_continuity": 14, "supply_chain": 20, "geographic_risk": 15, "team_size": 5}}', NOW() - INTERVAL '10 days', '1.0'),
            (demo_user_id, 45, '{"responses": {"cyber-security": 2, "business-continuity": 2, "supply-chain": 2}, "completion_percentage": 100, "score_breakdown": {"cyber_security": 10, "business_continuity": 10, "supply_chain": 12, "geographic_risk": 8, "team_size": 5}}', NOW() - INTERVAL '5 days', '1.0'),
            (demo_user_id, 52, '{"responses": {"cyber-security": 3, "business-continuity": 2, "supply-chain": 3}, "completion_percentage": 100, "score_breakdown": {"cyber_security": 14, "business_continuity": 10, "supply_chain": 16, "geographic_risk": 8, "team_size": 4}}', NOW() - INTERVAL '1 day', '1.0');
            
            RAISE NOTICE 'Demo DSS assessment data has been added for user %', demo_user_id;
        ELSE
            RAISE NOTICE 'No users found in profiles table. Demo data not added.';
        END IF;
    ELSE
        RAISE NOTICE 'DSS assessment data already exists. Demo data not added.';
    END IF;
END $$;