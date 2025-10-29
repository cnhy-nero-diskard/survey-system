CREATE TABLE TourismAttractions (
    id SERIAL PRIMARY KEY,
    TA_Name VARCHAR(255) NOT NULL,
    Type_Code VARCHAR(50) NOT NULL,
    Region VARCHAR(50) NOT NULL,
    Prov_HUC VARCHAR(50) NOT NULL,
    City_Mun VARCHAR(50) NOT NULL,
    Report_Year INT NOT NULL,
    Brgy VARCHAR(50) NOT NULL,
    Latitude DECIMAL(9, 6) NOT NULL,
    Longitude DECIMAL(9, 6) NOT NULL,
    TA_Category VARCHAR(100) NOT NULL,
    NTDP_Category VARCHAR(100) NOT NULL,
    Devt_Lvl VARCHAR(50) NOT NULL,
    Mgt VARCHAR(100) NOT NULL,
    Online_Connectivity VARCHAR(50)
);

-- Indexes for frequently queried columns
CREATE INDEX idx_ta_name ON TourismAttractions (TA_Name);
CREATE INDEX idx_region ON TourismAttractions (Region);
CREATE INDEX idx_city_mun ON TourismAttractions (City_Mun);
CREATE INDEX idx_report_year ON TourismAttractions (Report_Year);
CREATE INDEX idx_ta_category ON TourismAttractions (TA_Category);
CREATE INDEX idx_ntdp_category ON TourismAttractions (NTDP_Category);
CREATE INDEX idx_devt_lvl ON TourismAttractions (Devt_Lvl);
CREATE INDEX idx_mgt ON TourismAttractions (Mgt);
CREATE INDEX idx_online_connectivity ON TourismAttractions (Online_Connectivity);