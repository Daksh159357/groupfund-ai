-- GroupFund AI — Database Seed Data

-- Pre-seed Profiles
INSERT INTO public.profiles (id, full_name, email, avatar_url, institution, area_of_interest, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Daksh Sharma', 'daksh@groupfund.ai', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'IIT Bombay', 'Robotics & AI', 'user'),
    ('00000000-0000-0000-0000-000000000002', 'Rahul Verma', 'rahul@groupfund.ai', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'IIT Bombay', 'Hardware & IoT', 'user'),
    ('00000000-0000-0000-0000-000000000003', 'Jay Patel', 'jay@groupfund.ai', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'BITS Pilani', 'Software & Cloud', 'user'),
    ('00000000-0000-0000-0000-000000000004', 'Meet Joshi', 'meet@groupfund.ai', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 'BITS Pilani', 'Bioengineering', 'user'),
    ('00000000-0000-0000-0000-000000000005', 'Harsh Mehta', 'harsh@groupfund.ai', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'IIT Delhi', 'Clean Energy & EV', 'user'),
    ('00000000-0000-0000-0000-000000000006', 'Sneha Reddy', 'sneha@groupfund.ai', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'IIT Madras', 'Robotics & Automation', 'user'),
    ('00000000-0000-0000-0000-000000000000', 'Super Admin', 'admin@groupfund.ai', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'Platform HQ', 'FinTech & Security', 'admin')
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Pre-seed Groups
INSERT INTO public.groups (id, name, description, image_url, invite_code, created_by)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'College Trip Goa 2026', 'Shared expenses for graduation beach trip, vehicle rental, villas and team dinners.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', 'GOA2026', '00000000-0000-0000-0000-000000000001'),
    ('11111111-1111-1111-1111-111111111112', 'Robotics Lab & Hostel', 'Shared groceries, high-speed WiFi, 3D printing filaments, and lab food orders.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600', 'ROBOLAB', '00000000-0000-0000-0000-000000000001'),
    ('11111111-1111-1111-1111-111111111113', 'Tech Fest 2026 Organizers', 'Budget for hackathon refreshments, banners, audio setup, and judge hospitality.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600', 'TECHFEST', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- Group Members for College Trip Goa 2026
INSERT INTO public.group_members (group_id, user_id, role)
VALUES
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'admin'),
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'member'),
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', 'member'),
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000004', 'member'),
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000005', 'member')
ON CONFLICT DO NOTHING;

-- Sample Innovation Projects
INSERT INTO public.projects (
    id, title, short_description, problem_statement, proposed_solution, category, 
    target_amount_paise, raised_amount_paise, completion_date, institution, status, images, creator_id
)
VALUES
    (
        '22222222-2222-2222-2222-222222222221',
        'AgriBot: Autonomous Precision Agricultural Robot',
        'Solar-powered autonomous rover detecting crop weeds with computer vision and spot-spraying organic biopesticides.',
        'Modern farming relies on indiscriminate chemical spraying that wastes 70% of chemicals, contaminates groundwater, and costs smallholder farmers thousands.',
        'AgriBot navigates crop rows using RTK GPS and stereo cameras, identifies individual weeds using lightweight edge AI models, and sprays micro-droplets exclusively on target vegetation.',
        'Robotics',
        35000000, -- ₹3,50,000.00
        24500000, -- ₹2,45,000.00 (70% raised)
        '2026-12-15',
        'IIT Bombay Robotics Club',
        'published',
        ARRAY['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'],
        '00000000-0000-0000-0000-000000000001'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'BioWear: Continuous Non-Invasive Glucose Patch',
        'Wearable optical sensor patch that monitors glucose levels in real-time through reverse iontophoresis without finger pricking.',
        'Diabetic patients must endure painful skin punctures 3-5 times a day or purchase expensive single-use continuous glucose monitor needles.',
        'BioWear uses multi-wavelength near-infrared spectroscopy and low-voltage interstitial fluid extraction to provide continuous painless readings transmitted over BLE.',
        'Healthcare Technology',
        50000000, -- ₹5,00,000.00
        32000000, -- ₹3,20,000.00 (64% raised)
        '2027-01-20',
        'BITS Pilani Innovation Lab',
        'published',
        ARRAY['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'],
        '00000000-0000-0000-0000-000000000004'
    ),
    (
        '22222222-2222-2222-2222-222222222223',
        'AeroClean: Autonomous Drone for Rooftop Solar Farms',
        'Tethered dust-sweeping UAV system that increases solar panel efficiency by 25% using waterless electrodynamic cleaning.',
        'Dust accumulation reduces solar panel yield by up to 30%, while manual cleaning on industrial roofs poses fall hazards and wastes potable water.',
        'AeroClean hovers along panel rows discharging electrostatic fields and micro-brushes to dislodge arid dust without water usage or structural stress.',
        'Renewable Energy',
        28000000, -- ₹2,80,000.00
        14000000, -- ₹1,40,000.00 (50% raised)
        '2026-11-30',
        'IIT Delhi Energy Group',
        'published',
        ARRAY['https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800'],
        '00000000-0000-0000-0000-000000000005'
    )
ON CONFLICT (id) DO NOTHING;

-- Sample Milestones for AgriBot
INSERT INTO public.milestones (id, project_id, order_index, title, description, target_date, budget_allocated_paise, status)
VALUES
    ('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 1, 'Mechanical Design & Simulation', 'Complete CAD modeling of four-wheel rocker-bogie chassis and stress analysis in ANSYS.', '2026-08-15', 5000000, 'completed'),
    ('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222221', 2, 'Chassis Prototype & Motor Drives', 'Fabrication of lightweight aluminum extrusion frame and integration of planetary gear motors.', '2026-09-30', 8000000, 'completed'),
    ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222221', 3, 'Sensor Integration & Edge AI Camera', 'Mounting stereo depth cameras, Jetson Orin Nano, and testing weed segmentation neural network.', '2026-10-31', 10000000, 'in_progress'),
    ('33333333-3333-3333-3333-333333333334', '22222222-2222-2222-2222-222222222221', 4, 'Autonomous Navigation & RTK-GPS', 'Testing path planning algorithms on crop furrows using Nav2 ROS2 stack.', '2026-11-20', 7000000, 'upcoming'),
    ('33333333-3333-3333-3333-333333333335', '22222222-2222-2222-2222-222222222221', 5, 'Field Testing & Farmer Demonstration', 'Live 10-acre trial run with organic farm partners and metric validation report.', '2026-12-15', 5000000, 'upcoming')
ON CONFLICT (id) DO NOTHING;
