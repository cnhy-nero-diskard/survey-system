SELECT 
    e.est_name AS default_name,
    COALESCE(el.localized_name, e.est_name) AS display_name,
    l.code AS language_code
FROM establishments e
LEFT JOIN establishment_localizations el ON e.id = el.establishment_id
LEFT JOIN languages l ON el.language_id = l.id
WHERE e.id = 1 AND (l.code = 'fr' OR l.code IS NULL); -- Example: Fallback to default name if French translation is missing