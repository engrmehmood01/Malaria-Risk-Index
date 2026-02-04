# Malaria Risk Index – Pakistan | Google Earth Engine

A simple **composite Malaria Risk Index (0–1)** built in **Google Earth Engine (GEE)** using three environmental drivers:

- **Land Surface Temperature (LST)** – 40%
- **NDVI (Vegetation Index)** – 30%
- **Rainfall** – 30%

The output is a normalized risk surface where values closer to **1** indicate higher relative suitability/risk.

---

## Index Definition

Each factor is normalized to **0–1** (clamped) using user-defined min/max thresholds, then combined as:

\[
Risk = (W_{TEMP}\cdot S_{TEMP}) + (W_{NDVI}\cdot S_{NDVI}) + (W_{RAIN}\cdot S_{RAIN})
\]

Default weights:

- `W_TEMP = 0.40`
- `W_NDVI = 0.30`
- `W_RAIN = 0.30`

---

## Data Sources (GEE)

- **MODIS LST**: `MODIS/061/MOD11A2` (`LST_Day_1km`)
- **MODIS NDVI**: `MODIS/061/MOD13Q1` (`NDVI`)
- **CHIRPS Rainfall**: `UCSB-CHG/CHIRPS/DAILY` (`precipitation`)

> Date range default: **2025-07-01 → 2025-10-31**

---

## What This Script Does

✅ Loads Pakistan boundary (your asset)  
✅ Pulls LST, NDVI, and Rainfall for the selected dates  
✅ Normalizes each variable to a 0–1 suitability score  
✅ Produces a weighted composite risk index (0–1)  
✅ Visualizes the risk map and adds a legend  
✅ (Optional) Export to Google Drive (commented)

---

## How to Run

1. Open **Google Earth Engine Code Editor**.
2. Create a new script and paste the contents of `malaria_risk_index_pakistan.js`.
3. Ensure you have access to the boundary asset:
   - `projects/metric-426111/assets/Pakistan_Boundary`
4. Click **Run**.

---

## Customization

Update these in the **USER SETTINGS** section:

- Date range:
  - `startDate`, `endDate`
- Suitability thresholds:
  - Temperature (`TEMP_MIN_C`, `TEMP_MAX_C`)
  - NDVI (`NDVI_MIN`, `NDVI_MAX`)
  - Rainfall (`RAIN_MIN_MM`, `RAIN_MAX_MM`)
- Weights:
  - `W_TEMP`, `W_NDVI`, `W_RAIN`

---

## Notes / Limitations

- This is a **relative environmental suitability index**, not confirmed epidemiological incidence.
- The boundary currently uses a Pakistan feature collection asset; the export block references.

---

## Author

**Name:** Engr. Mehmood Ahmad  
**LinkedIn:** https://www.linkedin.com/in/engrmehmood/
**GitHub:** https://github.com/engrmehmood01



MIT (or your preferred license)
