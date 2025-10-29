INSERT INTO TourismAttractionTranslations (
    tourism_attraction_id, 
    language_id, 
    translated_name, 
    translated_ta_category, 
    translated_ntdp_category, 
    translated_mgt
)
VALUES
-- English translations
(1, 1, 'Arco Point', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(2, 1, 'Bohol Beach Club Reef', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
-- Korean translations
(1, 3, '아르코 포인트', '다이빙 장소', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(2, 3, '보홀 비치 클럽 리프', '다이빙 장소', '다이빙 및 해양 스포츠 관광', '정부 운영'),
-- Chinese translations
(1, 2, '阿尔科点', '潜水地点', '潜水和海洋运动旅游', '政府运营'),
(2, 2, '薄荷海滩俱乐部珊瑚礁', '潜水地点', '潜水和海洋运动旅游', '政府运营'),
-- Japanese translations
(1, 4, 'アルコポイント', 'ダイビングスポット', 'ダイビングと海洋スポーツ観光', '政府運営'),
(2, 4, 'ボホールビーチクラブリーフ', 'ダイビングスポット', 'ダイビングと海洋スポーツ観光', '政府運営'),
-- Russian translations
(1, 7, 'Арко Пойнт', 'Место для дайвинга', 'Дайвинг и морской спорт', 'Управляется государством'),
(2, 7, 'Риф Бич Клуба Бохол', 'Место для дайвинга', 'Дайвинг и морской спорт', 'Управляется государством'),
-- French translations
(1, 5, 'Arco Point', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Géré par le gouvernement'),
(2, 5, 'Récif du Bohol Beach Club', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Géré par le gouvernement'),
-- Spanish translations
(1, 8, 'Punto Arco', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno'),
(2, 8, 'Arrecife del Club de Playa de Bohol', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno'),
-- Hindi translations
(1, 6, 'आर्को पॉइंट', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालित'),
(2, 6, 'बोहोल बीच क्लब रीफ', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालित');



INSERT INTO TourismAttractionTranslations (
    tourism_attraction_id,
    language_id,
    translated_name,
    translated_ta_category,
    translated_ntdp_category,
    translated_mgt
)
VALUES
-- Bohol Beach Club Reef translations

-- Kalipayan Beach translations
(3, 1, 'Kalipayan Beach', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'), -- English
(3, 2, '卡利帕扬海滩', '潜水点', '潜水和海洋体育旅游', '政府运营'), -- Chinese
(3, 3, '칼리파얀 비치', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'), -- Korean
(3, 4, 'カリパヤンビーチ', 'ダイビングサイト', 'ダイビングと海洋スポーツ観光', '政府運営'), -- Japanese
(3, 5, 'Plage de Kalipayan', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Exploité par le gouvernement'), -- French
(3, 6, 'कलिपायन बीच', 'डाइव साइट', 'डाइविंग और मरीन स्पोर्ट्स पर्यटन', 'सरकार द्वारा संचालित'), -- Hindi
(3, 7, 'Пляж Калипаян', 'Место для дайвинга', 'Дайвинг и морской спортивный туризм', 'Управляется правительством'), -- Russian
(3, 8, 'Playa Kalipayan', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno'); -- Spanish



-- Insert translations for "Habagat Wreck"
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES 
(4, 1, 'Habagat Wreck', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(4, 2, '哈巴加特沉船', '潜水点', '潜水和海洋运动旅游', '政府运营'),
(4, 3, '하바갓 난파선', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(4, 4, 'ハバガット沈船', 'ダイブサイト', 'ダイビングとマリンスポーツ観光', '政府運営'),
(4, 5, 'Épave Habagat', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Exploité par le gouvernement'),
(4, 6, 'हबागट मलबा', 'डाइव साइट', 'डाइविंग और मरीन स्पोर्ट्स टूरिज्म', 'सरकारी परिचालित'),
(4, 7, 'Обломки Хабагат', 'Место для дайвинга', 'Дайвинг и морской спорт туризм', 'Управляется государством'),
(4, 8, 'Naufragio Habagat', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');

-- Insert translations for "Aona House Reef/Eel Garden"
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES 
(5, 1, 'Aona House Reef/Eel Garden', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(5, 2, '奥纳之家礁/鳗鱼花园', '潜水点', '潜水和海洋运动旅游', '政府运营'),
(5, 3, '아오나 하우스 리프/장어 가든', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(5, 4, 'アオナハウスリーフ/ウナギガーデン', 'ダイブサイト', 'ダイビングとマリンスポーツ観光', '政府運営'),
(5, 5, 'Récif Maison Aona/Jardin des anguilles', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Exploité par le gouvernement'),
(5, 6, 'आओना हाउस रीफ/इल गार्डन', 'डाइव साइट', 'डाइविंग और मरीन स्पोर्ट्स टूरिज्म', 'सरकारी परिचालित'),
(5, 7, 'Риф Аона/Сад угрей', 'Место для дайвинга', 'Дайвинг и морской спорт туризм', 'Управляется государством'),
(5, 8, 'Arrecife de la Casa Aona/Jardín de anguilas', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');


-- Crystal Coast Translations
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt) VALUES
(6, 1, 'Crystal Coast', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(6, 2, '水晶海岸', '潜水点', '潜水和海洋运动旅游', '政府运营'),
(6, 3, '크리스탈 코스트', '다이빙 장소', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(6, 4, 'クリスタルコースト', 'ダイビングスポット', 'ダイビングと海洋スポーツ観光', '政府運営'),
(6, 5, 'Côte de Cristal', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Géré par le gouvernement'),
(6, 6, 'क्रिस्टल कोस्ट', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालन'),
(6, 7, 'Кристал-Кост', 'Место для дайвинга', 'Дайвинг и морской спортивный туризм', 'Управляется правительством'),
(6, 8, 'Costa de Cristal', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');

-- Puntod Reef Translations
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt) VALUES
(7, 1, 'Puntod Reef', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(7, 2, '彭托德礁', '潜水点', '潜水和海洋运动旅游', '政府运营'),
(7, 3, '푼토드 리프', '다이빙 장소', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(7, 4, 'プントッドリーフ', 'ダイビングスポット', 'ダイビングと海洋スポーツ観光', '政府運営'),
(7, 5, 'Récif de Puntod', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Géré par le gouvernement'),
(7, 6, 'पंटोड रीफ', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालन'),
(7, 7, 'Риф Пунтод', 'Место для дайвинга', 'Дайвинг и морской спортивный туризм', 'Управляется правительством'),
(7, 8, 'Arrecife Puntod', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');


-- Inserts for Doljo Point A (tourism_attraction_id = 1)
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(8, 1, 'Doljo Point A', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(8, 2, 'Doljo Point A', '潜水点', '潜水和海洋运动旅游', '政府运营'),
(8, 3, 'Doljo Point A', '다이빙 장소', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(8, 4, 'Doljo Point A', 'ダイビングサイト', 'ダイビングとマリンスポーツ観光', '政府運営'),
(8, 5, 'Doljo Point A', 'Site de plongée', 'Tourisme de plongée et sports marins', 'Exploité par le gouvernement'),
(8, 6, 'Doljo Point A', 'डाइविंग स्थल', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालित'),
(8, 7, 'Doljo Point A', 'Дайв-сайт', 'Дайвинг и морской спортивный туризм', 'Управляется государством'),
(8, 8, 'Doljo Point A', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');

-- Inserts for Doljo Point B (tourism_attraction_id = 2)
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(9, 1, 'Doljo Point B', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(9, 2, 'Doljo Point B', '潜水点', '潜水和海洋运动旅游', '政府运营'),
(9, 3, 'Doljo Point B', '다이빙 장소', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(9, 4, 'Doljo Point B', 'ダイビングサイト', 'ダイビングとマリンスポーツ観光', '政府運営'),
(9, 5, 'Doljo Point B', 'Site de plongée', 'Tourisme de plongée et sports marins', 'Exploité par le gouvernement'),
(9, 6, 'Doljo Point B', 'डाइविंग स्थल', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालित'),
(9, 7, 'Doljo Point B', 'Дайв-сайт', 'Дайвинг и морской спортивный туризм', 'Управляется государством'),
(9, 8, 'Doljo Point B', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');


-- Insert translations for Momo Beach (tourism_attraction_id = 1)
INSERT INTO TourismAttractionTranslations 
(tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(10, 1, 'Momo Beach', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(10, 2, '莫莫海滩', '潜水点', '潜水和海洋运动旅游', '政府运营'),
(10, 3, '모모 비치', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(10, 4, 'モモビーチ', 'ダイブサイト', 'ダイビングとマリンスポーツツーリズム', '政府運営'),
(10, 5, 'Plage de Momo', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Géré par le gouvernement'),
(10, 6, 'मोमो बीच', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकार द्वारा संचालित'),
(10, 7, 'Пляж Момо', 'Место для дайвинга', 'Дайвинг и морской спортивный туризм', 'Управляется государством'),
(10, 8, 'Playa Momo', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');

-- Insert translations for Neptune Garden (tourism_attraction_id = 2)
INSERT INTO TourismAttractionTranslations 
(tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
-- English
(11, 1, 'Neptune Garden', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(11, 2, '海王花园', '潜水点', '潜水和海洋运动旅游', '政府运营'),
(11, 3, '넵튠 가든', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(11, 4, 'ネプチューンガーデン', 'ダイブサイト', 'ダイビングとマリンスポーツツーリズム', '政府運営'),
(11, 5, 'Jardin de Neptune', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Géré par le gouvernement'),
(11, 6, 'नेपच्यून गार्डन', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकार द्वारा संचालित'),
(11, 7, 'Сад Нептуна', 'Место для дайвинга', 'Дайвинг и морской спортивный туризм', 'Управляется государством'),
(11, 8, 'Jardín de Neptuno', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');


-- Translations for Black Forest
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(12, 1, 'Black Forest', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(12, 2, '黑森林', '潜水点', '潜水和海洋运动旅游', '政府经营'),
(12, 3, '블랙 포레스트', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(12, 4, 'ブラックフォレスト', 'ダイビングサイト', 'ダイビングとマリンスポーツ観光', '政府運営'),
(12, 5, 'Forêt Noire', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Exploité par le gouvernement'),
(12, 6, 'ब्लैक फॉरेस्ट', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालन'),
(12, 7, 'Чёрный лес', 'Место для дайвинга', 'Дайвинг и морской спортивный туризм', 'Управляется государством'),
(12, 8, 'Bosque Negro', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');

-- Translations for Rudy’s Rock
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(13, 1, 'Rudy’s Rock', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(13, 2, '鲁迪岩石', '潜水点', '潜水和海洋运动旅游', '政府经营'),
(13, 3, '루디의 바위', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(13, 4, 'ルディの岩', 'ダイビングサイト', 'ダイビングとマリンスポーツ観光', '政府運営'),
(13, 5, 'Roche de Rudy', 'Site de plongée', 'Tourisme de plongée et sports nautiques', 'Exploité par le gouvernement'),
(13, 6, 'रुडी का चट्टान', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालन'),
(13, 7, 'Скала Руди', 'Место для дайвинга', 'Дайвинг и морской спортивный туризм', 'Управляется государством'),
(13, 8, 'Roca de Rudy', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');

INSERT INTO TourismAttractionTranslations 
(tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt) 
VALUES
-- Translations for Royal Garden
(14, 1, 'Royal Garden', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'), -- English
(14, 2, '皇家花园', '潜水点', '潜水和海洋体育旅游', '政府运营'), -- Chinese
(14, 3, '로열 가든', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'), -- Korean
(14, 4, 'ロイヤルガーデン', 'ダイビングサイト', 'ダイビングとマリンスポーツ観光', '政府運営'), -- Japanese
(14, 5, 'Jardin Royal', 'Site de plongée', 'Tourisme de plongée et de sports marins', 'Exploité par le gouvernement'), -- French
(14, 6, 'रॉयल गार्डन', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालन'), -- Hindi
(14, 7, 'Королевский сад', 'Место для дайвинга', 'Дайвинг и морской спортивный туризм', 'Управляется государством'), -- Russian
(14, 8, 'Jardín Real', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno'), -- Spanish

-- Translations for Diver’s Haven
(15, 1, 'Diver’s Haven', 'Dive site', 'Diving and Marine Sports Tourism', 'Government Operated'), -- English
(15, 2, '潜水者的天堂', '潜水点', '潜水和海洋体育旅游', '政府运营'), -- Chinese
(15, 3, '다이버의 천국', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'), -- Korean
(15, 4, 'ダイバーズヘブン', 'ダイビングサイト', 'ダイビングとマリンスポーツ観光', '政府運営'), -- Japanese
(15, 5, 'Havre des plongeurs', 'Site de plongée', 'Tourisme de plongée et de sports marins', 'Exploité par le gouvernement'), -- French
(15, 6, 'डाइवर्स हेवन', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालन'), -- Hindi
(15, 7, 'Убежище для дайверов', 'Место для дайвинга', 'Дайвинг и морской спортивный туризм', 'Управляется государством'), -- Russian
(15, 8, 'Paraíso del buceador', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno'); -- Spanish

-- Insert translations for Balicasag Sanctuary
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(16, 1, 'Balicasag Sanctuary', 'Dive Site', 'Diving and Marine Sports Tourism', 'Government Operated'),
(16, 2, '巴利卡萨岛保护区', '潜水点', '潜水和海洋体育旅游', '政府经营'),
(16, 3, '발리카사그 보호구역', '다이빙 사이트', '다이빙 및 해양 스포츠 관광', '정부 운영'),
(16, 4, 'バリカサグ保護区', 'ダイビングサイト', 'ダイビングとマリンスポーツ観光', '政府運営'),
(16, 5, 'Sanctuaire de Balicasag', 'Site de plongée', 'Tourisme de plongée et sports marins', 'Exploitation publique'),
(16, 6, 'बालिकासाग अभयारण्य', 'डाइव साइट', 'डाइविंग और समुद्री खेल पर्यटन', 'सरकारी संचालन'),
(16, 7, 'Баликасаг Сентуарий', 'Место для дайвинга', 'Дайвинг и морской спорт туризм', 'Государственное управление'),
(16, 8, 'Santuario de Balicasag', 'Sitio de buceo', 'Turismo de buceo y deportes marinos', 'Operado por el gobierno');

-- Insert translations for St. Augustine Church
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(17, 1, 'St. Augustine Church', 'Church', 'Cultural Tourism', 'Non-Government Organization'),
(17, 2, '圣奥古斯丁教堂', '教堂', '文化旅游', '非政府组织'),
(17, 3, '성 아우구스티누스 교회', '교회', '문화 관광', '비정부 기구'),
(17, 4, '聖アウグスティヌス教会', '教会', '文化観光', '非政府機関'),
(17, 5, 'Église Saint-Augustin', 'Église', 'Tourisme culturel', 'Organisation non gouvernementale'),
(17, 6, 'संत ऑगस्टिन चर्च', 'चर्च', 'सांस्कृतिक पर्यटन', 'गैर-सरकारी संगठन'),
(17, 7, 'Церковь Святого Августина', 'Церковь', 'Культурный туризм', 'Некоммерческая организация'),
(17, 8, 'Iglesia de San Agustín', 'Iglesia', 'Turismo cultural', 'Organización no gubernamental');

-- Insert translations for Panglao Watch Tower
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(18, 1, 'Panglao Watch Tower', 'Structures and Buildings', 'Cultural Tourism', 'Non-Government Organization'),
(18, 2, '邦劳瞭望塔', '建筑物和结构', '文化旅游', '非政府组织'),
(18, 3, '팡라우 감시탑', '구조물과 건물', '문화 관광', '비정부 기구'),
(18, 4, 'パンラオ監視塔', '構造物と建物', '文化観光', '非政府機関'),
(18, 5, 'Tour de guet de Panglao', 'Structures et bâtiments', 'Tourisme culturel', 'Organisation non gouvernementale'),
(18, 6, 'पांगलाओ वॉच टावर', 'संरचनाएँ और भवन', 'सांस्कृतिक पर्यटन', 'गैर-सरकारी संगठन'),
(18, 7, 'Смотровая башня Панглао', 'Структуры и здания', 'Культурный туризм', 'Некоммерческая организация'),
(18, 8, 'Torre de vigilancia de Panglao', 'Estructuras y edificios', 'Turismo cultural', 'Organización no gubernamental');



INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(19, 1, 'Old Municipal Building', 'Structures and Buildings', 'Cultural Tourism', 'Government Operated'),
(19, 2, '旧市政大楼', '建筑物与结构', '文化旅游', '政府运营'),
(19, 3, '구시청', '구조물 및 건물', '문화 관광', '정부 운영'),
(19, 4, '旧市庁舎', '建物と構造物', '文化観光', '政府運営'),
(19, 5, 'Ancien bâtiment municipal', 'Structures et bâtiments', 'Tourisme culturel', 'Géré par le gouvernement'),
(19, 6, 'पुराना नगरपालिका भवन', 'संरचनाएँ और भवन', 'सांस्कृतिक पर्यटन', 'सरकारी संचालित'),
(19, 7, 'Старое муниципальное здание', 'Структуры и здания', 'Культурный туризм', 'Государственное управление'),
(19, 8, 'Antiguo edificio municipal', 'Estructuras y edificios', 'Turismo cultural', 'Operado por el gobierno'),

(20, 1, 'Dos Escuelas de Niños Y Niñas', 'Structures and Buildings', 'Cultural Tourism', 'Government Operated'),
(20, 2, '男孩女孩学校', '建筑物与结构', '文化旅游', '政府运营'),
(20, 3, '남자 여자 학교', '구조물 및 건물', '문화 관광', '정부 운영'),
(20, 4, '男の子と女の子の学校', '建物と構造物', '文化観光', '政府運営'),
(20, 5, 'Deux écoles pour garçons et filles', 'Structures et bâtiments', 'Tourisme culturel', 'Géré par le gouvernement'),
(20, 6, 'लड़के और लड़कियों के स्कूल', 'संरचनाएँ और भवन', 'सांस्कृतिक पर्यटन', 'सरकारी संचालित'),
(20, 7, 'Две школы для мальчиков и девочек', 'Структуры и здания', 'Культурный туризм', 'Государственное управление'),
(20, 8, 'Escuelas para niños y niñas', 'Estructuras y edificios', 'Turismo cultural', 'Operado por el gobierno'),

(21, 1, 'Archway and Mortuary Chapel of the 19th Century Cemetery', 'Structures and Buildings', 'Cultural Tourism', 'Government Operated'),
(21, 2, '19世纪墓地的拱门和葬礼小教堂', '建筑物与结构', '文化旅游', '政府运营'),
(21, 3, '19세기 묘지의 아치와 장례 예배당', '구조물 및 건물', '문화 관광', '정부 운영'),
(21, 4, '19世紀の墓地のアーチと葬儀礼拝堂', '建物と構造物', '文化観光', '政府運営'),
(21, 5, 'Arc et礼拝堂の19世紀の墓地', 'Structures et bâtiments', 'Tourisme culturel', 'Géré par le gouvernement'),
(21, 6, '19वीं सदी के कब्रिस्तान के मेहराब और शवदाह चैपल', 'संरचनाएँ और भवन', 'सांस्कृतिक पर्यटन', 'सरकारी संचालित'),
(21, 7, 'Арка и крематорная часовня 19 века на кладбище', 'Структуры и здания', 'Культурный туризм', 'Государственное управление'),
(21, 8, 'Arco y capilla mortuoria del cementerio del siglo XIX', 'Estructuras y edificios', 'Turismo cultural', 'Operado por el gobierno');


-- Insert the translations for Ruins of Old Panglao Church (Fatima Crusaders’ Chapel)
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(22, 1, 'Ruins of Old Panglao Church (Fatima Crusaders’ Chapel)', 'Church', 'Cultural Tourism', 'Government Operated'),
(22, 2, '老彭拉奥教堂遗址（法蒂玛十字军礼拜堂）', '教堂', '文化旅游', '政府经营'),
(22, 3, '올드 팡글라오 교회 폐허 (파티마 순례자 예배당)', '교회', '문화 관광', '정부 운영'),
(22, 4, '旧パングラオ教会跡（ファティマ巡礼者礼拝堂）', '教会', '文化観光', '政府運営'),
(22, 5, 'Руины старой церкви Пангао (часовня Фатимы)', 'Церковь', 'Культурный туризм', 'Государственное управление'),
(22, 6, 'पुरानी पांगलाओ चर्च (फातिमा क्रूसेडर्स चैपल) के खंडहर', 'चर्च', 'सांस्कृतिक पर्यटन', 'सरकारी संचालन'),
(22, 7, 'Руины старой церкви Пангао (часовня Фатимы)', 'Церковь', 'Культурный туризм', 'Государственное управление'),
(22, 8, 'Ruinas de la Antigua Iglesia de Panglao (Capilla de los Cruzados de Fátima)', 'Iglesia', 'Turismo Cultural', 'Operado por el Gobierno');

-- Insert the translations for Panglao Town Plaza
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(24, 1, 'Panglao Town Plaza', 'Sport Complex', 'Sun and Beach Tourism', 'Government Operated'),
(24, 2, '彭拉奥镇广场', '体育场', '阳光与海滩旅游', '政府经营'),
(24, 3, '팡글라오 타운 광장', '스포츠 단지', '해변과 태양 관광', '정부 운영'),
(24, 4, 'パングラオタウン広場', 'スポーツ複合施設', '日光とビーチ観光', '政府運営'),
(24, 5, 'Площадь города Пангао', 'Спортивный комплекс', 'Туризм на солнце и пляже', 'Государственное управление'),
(24, 6, 'पांगलाओ टाउन प्लाजा', 'खेल परिसर', 'सन और बीच पर्यटन', 'सरकारी संचालन'),
(24, 7, 'Площадь города Пангао', 'Спортивный комплекс', 'Туризм на солнце и пляже', 'Государственное управление'),
(24, 8, 'Plaza de la Ciudad de Panglao', 'Complejo Deportivo', 'Turismo Sol y Playa', 'Operado por el Gobierno');

-- Insert the translations for Hudyaka sa Panglao
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(24, 1, 'Hudyaka sa Panglao', 'Festivals', 'Nature Tourism', 'Government Operated'),
(24, 2, '彭拉奥的胡迪亚卡', '节日', '自然旅游', '政府经营'),
(24, 3, '훅디야카 사 팡글라오', '축제', '자연 관광', '정부 운영'),
(24, 4, 'パングラオのフディヤカ祭り', '祭り', '自然観光', '政府運営'),
(24, 5, 'Худяка на Пангао', 'Фестивали', 'Природный туризм', 'Государственное управление'),
(24, 6, 'हुड्याका सा पांगलाओ', 'त्योहार', 'प्राकृतिक पर्यटन', 'सरकारी संचालन'),
(24, 7, 'Худяка на Пангао', 'Фестивали', 'Природный туризм', 'Государственное управление'),
(24, 8, 'Hudyaka en Panglao', 'Festivales', 'Turismo Natural', 'Operado por el Gobierno');


-- Insert the translations for Sr. Sto. Niño Fiesta
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(25, 1, 'Sr. Sto. Niño Fiesta', 'Festivals', 'Nature Tourism', 'Government Operated'),
(25, 2, '圣斯托。尼诺节', '节日', '自然旅游', '政府经营'),
(25, 3, '성 스토. 니뇨 축제', '축제', '자연 관광', '정부 운영'),
(25, 4, '聖スト・ニーニョ祭り', '祭り', '自然観光', '政府運営'),
(25, 5, 'Фиеста Святого Сто. Ниньо', 'Фестивали', 'Природный туризм', 'Государственное управление'),
(25, 6, 'स्र. स्टो. निनो महोत्सव', 'त्योहार', 'प्राकृतिक पर्यटन', 'सरकारी संचालन'),
(25, 7, 'Фиеста Святого Сто. Ниньо', 'Фестивали', 'Природный туризм', 'Государственное управление'),
(25, 8, 'Fiesta de Sr. Sto. Niño', 'Festivales', 'Turismo Natural', 'Operado por el Gobierno');

-- Insert the translations for Nova Shell Museum
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(26, 1, 'Nova Shell Museum', 'Museum', 'Nature Tourism', 'Private Operator'),
(26, 2, '诺瓦贝壳博物馆', '博物馆', '自然旅游', '私人经营'),
(26, 3, '노바 조개 박물관', '박물관', '자연 관광', '개인 운영'),
(26, 4, 'ノヴァシェル博物館', '博物館', '自然観光', '民間運営'),
(26, 5, 'Музей новых ракушек', 'Музей', 'Природный туризм', 'Частный оператор'),
(26, 6, 'नोवा शेल म्यूज़ियम', 'संग्रहालय', 'प्राकृतिक पर्यटन', 'निजी ऑपरेटर'),
(26, 7, 'Музей новых ракушек', 'Музей', 'Природный туризм', 'Частный оператор'),
(26, 8, 'Museo Nova Shell', 'Museo', 'Turismo Natural', 'Operador Privado');

-- Insert the translations for Virgin Island
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(27, 1, 'Virgin Island', 'Beach', 'Sun and Beach Tourism', 'Government Operated'),
(27, 2, '维尔京岛', '海滩', '阳光与海滩旅游', '政府经营'),
(27, 3, '버진 아일랜드', '해변', '태양과 해변 관광', '정부 운영'),
(27, 4, 'バージンアイランド', 'ビーチ', '太陽とビーチ観光', '政府運営'),
(27, 5, 'Виргинский остров', 'Пляж', 'Туризм на солнце и пляже', 'Государственное управление'),
(27, 6, 'वर्जिन आइलैंड', 'समुद्र तट', 'सन और बीच पर्यटन', 'सरकारी संचालन'),
(27, 7, 'Виргинский остров', 'Пляж', 'Туризм на солнце и пляже', 'Государственное управление'),
(27, 8, 'Isla Virgen', 'Playa', 'Turismo Sol y Playa', 'Operado por el Gobierno');


-- Insert into TourismAttractionTranslations
-- Alona Beach Translations
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(28, 1, 'Alona Beach', 'Beach', 'Sun and Beach Tourism', 'Government Operated'),
(28, 2, '阿罗纳海滩', '海滩', '阳光沙滩旅游', '政府运营'),
(28, 3, '알로나 비치', '해변', '썬앤비치 관광', '정부 운영'),
(28, 4, 'アロナビーチ', 'ビーチ', 'サンアンドビーチ観光', '政府運営'),
(28, 5, 'Alona Beach', 'Plage', 'Tourisme Soleil et Plage', 'Exploitation publique'),
(28, 6, 'अलोना बीच', 'समुद्र तट', 'सूर्य और समुद्र तट पर्यटन', 'सरकारी संचालित'),
(28, 7, 'Алона Бич', 'Пляж', 'Солнечный и пляжный туризм', 'Государственное управление'),
(28, 8, 'Playa Alona', 'Playa', 'Turismo de sol y playa', 'Operado por el gobierno');

-- Insert into TourismAttractionTranslations
-- Balicasag Island Translations
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(29, 1, 'Balicasag Island', 'Beach', 'Sun and Beach Tourism', 'Government Operated'),
(29, 2, '巴利卡萨岛', '海滩', '阳光沙滩旅游', '政府运营'),
(29, 3, '발리카삭 섬', '해변', '썬앤비치 관광', '정부 운영'),
(29, 4, 'バリカサグ島', 'ビーチ', 'サンアンドビーチ観光', '政府運営'),
(29, 5, 'Île Balicasag', 'Plage', 'Tourisme Soleil et Plage', 'Exploitation publique'),
(29, 6, 'बैलिकासाग द्वीप', 'समुद्र तट', 'सूर्य और समुद्र तट पर्यटन', 'सरकारी संचालित'),
(29, 7, 'Остров Баликасаг', 'Пляж', 'Солнечный и пляжный туризм', 'Государственное управление'),
(29, 8, 'Isla Balicasag', 'Playa', 'Turismo de sol y playa', 'Operado por el gobierno');

-- Insert into TourismAttractionTranslations
-- Napaling Sardine Run Translations
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt)
VALUES
(30, 1, 'Napaling Sardine Run', 'Beach', 'Sun and Beach Tourism', 'Government Operated'),
(30, 2, '纳帕林沙丁鱼奔跑', '海滩', '阳光沙滩旅游', '政府运营'),
(30, 3, '나팔링 정어리 달리기', '해변', '썬앤비치 관광', '정부 운영'),
(30, 4, 'ナパリング サーディン ラン', 'ビーチ', 'サンアンドビーチ観光', '政府運営'),
(30, 5, 'Course de sardines de Napaling', 'Plage', 'Tourisme Soleil et Plage', 'Exploitation publique'),
(30, 6, 'नपालिंग सार्डिन रन', 'समुद्र तट', 'सूर्य और समुद्र तट पर्यटन', 'सरकारी संचालित'),
(30, 7, 'Напалинг Сардины Ран', 'Пляж', 'Солнечный и пляжный туризм', 'Государственное управление'),
(30, 8, 'Carrera de sardinas Napaling', 'Playa', 'Turismo de sol y playa', 'Operado por el gobierno');


-- Insert translations for Panglao Sorbetes Production Center
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt) VALUES
(31, 1, 'Panglao Sorbetes Production Center', 'Industrial Facilities', 'industrial Tourism', 'PO'),
(31, 2, '邦劳雪糕生产中心', '工业设施', '工业旅游', '私人经营'),
(31, 3, '팡라우 소르베떼스 생산 센터', '산업 시설', '산업 관광', '개인 운영'),
(31, 4, 'パンラオソルベテス生産センター', '産業施設', '産業観光', '民間運営'),
(31, 5, 'Centre de production de Panglao Sorbetes', 'Installations industrielles', 'tourisme industriel', 'Opérateur privé'),
(31, 6, 'पांगलाओ सोरबेट्स उत्पादन केंद्र', 'औद्योगिक सुविधाएं', 'औद्योगिक पर्यटन', 'निजी ऑपरेटर'),
(31, 7, 'Панглао Сорбетес Производственный Центр', 'Промышленные объекты', 'промышленный туризм', 'Частный оператор'),
(31, 8, 'Centro de Producción Panglao Sorbetes', 'Instalaciones Industriales', 'Turismo Industrial', 'Operador Privado');

-- Insert translations for South Farm
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt) VALUES
(32, 1, 'South Farm', 'Farm', 'Nature Tourism', 'Private Operator'),
(32, 2, '南方农场', '农场', '自然旅游', '私人经营'),
(32, 3, '남부 농장', '농장', '자연 관광', '개인 운영'),
(32, 4, 'サウスファーム', '農場', '自然観光', '民間運営'),
(32, 5, 'Ferme du Sud', 'Ferme', 'Tourisme Naturel', 'Opérateur privé'),
(32, 6, 'साउथ फार्म', 'कृषि फार्म', 'प्राकृतिक पर्यटन', 'निजी ऑपरेटर'),
(32, 7, 'Южная Ферма', 'Ферма', 'Природный туризм', 'Частный оператор'),
(32, 8, 'Granja del Sur', 'Granja', 'Turismo Natural', 'Operador Privado');

-- Insert translations for Panglao Golf Range
INSERT INTO TourismAttractionTranslations (tourism_attraction_id, language_id, translated_name, translated_ta_category, translated_ntdp_category, translated_mgt) VALUES
(33, 1, 'Panglao Golf Range', 'Golf', 'leisure and entertainment tourism', 'Private Operator'),
(33, 2, '邦劳高尔夫练习场', '高尔夫', '休闲和娱乐旅游', '私人经营'),
(33, 3, '팡라우 골프 연습장', '골프', '레저 및 오락 관광', '개인 운영'),
(33, 4, 'パンラオゴルフレンジ', 'ゴルフ', 'レジャーとエンターテイメント観光', '民間運営'),
(33, 5, 'Plage de Golf Panglao', 'Golf', 'tourisme de loisirs et divertissements', 'Opérateur privé'),
(33, 6, 'पांगलाओ गोल्फ रेंज', 'गोल्फ', 'मनोरंजन और अवकाश पर्यटन', 'निजी ऑपरेटर'),
(33, 7, 'Панглао Гольф-Рендж', 'Гольф', 'туризм досуга и развлечений', 'Частный оператор'),
(33, 8, 'Campo de Golf Panglao', 'Golf', 'Turismo de ocio y entretenimiento', 'Operador Privado');
