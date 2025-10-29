-- Alona Bamboo-house Inn (Accommodation)
INSERT INTO establishment_types (establishment_id, type_id)
VALUES
    (1, (SELECT id FROM types WHERE type_name = 'Accommodation'));

-- Gemini Hotel And Restaurant (Accommodation, Tents For Rent)
INSERT INTO establishment_types (establishment_id, type_id)
VALUES
    (2, (SELECT id FROM types WHERE type_name = 'Accommodation')),
    (2, (SELECT id FROM types WHERE type_name = 'Tents For Rent'));

-- B L U E Water Dive Resort Inc. (Accommodation, Dive Shop)
INSERT INTO establishment_types (establishment_id, type_id)
VALUES
    (3, (SELECT id FROM types WHERE type_name = 'Accommodation')),
    (3, (SELECT id FROM types WHERE type_name = 'Dive Shop'));

-- Dynamic Bohol Dive And Resort Inc. (Accommodation, Dive Shop)
INSERT INTO establishment_types (establishment_id, type_id)
VALUES
    (4, (SELECT id FROM types WHERE type_name = 'Accommodation')),
    (4, (SELECT id FROM types WHERE type_name = 'Dive Shop'));

-- Sunny Islander Corporation/sunny Islander Diving Resort (Accommodation, Dive Shop, Restaurant)
INSERT INTO establishment_types (establishment_id, type_id)
VALUES
    (5, (SELECT id FROM types WHERE type_name = 'Accommodation')),
    (5, (SELECT id FROM types WHERE type_name = 'Dive Shop')),
    (5, (SELECT id FROM types WHERE type_name = 'Restaurant'));