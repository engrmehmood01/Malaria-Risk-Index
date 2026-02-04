/**** Malaria Risk Index – Punjab (Pakistan)
 *   Composite index (0–1):
 *   LST 40%, NDVI 30%, Rainfall 30%
 *
 * Author:
 *   Name: Engr. Mehmood Ahmad
 *   LinkedIn: https://www.linkedin.com/in/engrmehmood/
 *   GitHub: https://github.com/engrmehmood01
 ****/

// -------------------- USER SETTINGS --------------------
var startDate = '2025-07-01';
var endDate   = '2025-10-31';

// Optimal ranges
var TEMP_MIN_C = 18;
var TEMP_MAX_C = 32;

var NDVI_MIN = 0.20;
var NDVI_MAX = 0.80;

var RAIN_MIN_MM = 0;
var RAIN_MAX_MM = 300;

// Weights
var W_TEMP = 0.40;
var W_NDVI = 0.30;
var W_RAIN = 0.30;

// -------------------- ROI: PAKISTAN --------------------
var pakistan = ee.FeatureCollection('projects/metric-426111/assets/Pakistan_Boundary');

var boundaryStyle = {
  color: '000000',   // black
  width: 2           // line thickness
};

Map.addLayer(pakistan.style(boundaryStyle), {}, 'Pakistan Boundary Line');

Map.centerObject(pakistan, 5);
Map.addLayer(pakistan, {color: 'white'}, 'Pakistan Boundary');

// -------------------- HELPER FUNCTIONS --------------------
function normalize01(img, minVal, maxVal) {
  return img.subtract(minVal)
            .divide(ee.Number(maxVal).subtract(minVal))
            .clamp(0, 1);
}

function tempSuitability(tempC) {
  return normalize01(tempC, TEMP_MIN_C, TEMP_MAX_C);
}

function ndviSuitability(ndvi) {
  return normalize01(ndvi, NDVI_MIN, NDVI_MAX);
}

function rainSuitability(rainMm) {
  return normalize01(rainMm, RAIN_MIN_MM, RAIN_MAX_MM);
}

// -------------------- DATASETS --------------------

// MODIS LST (°C)
var lst = ee.ImageCollection('MODIS/061/MOD11A2')
  .filterDate(startDate, endDate)
  .select('LST_Day_1km')
  .mean()
  .multiply(0.02)
  .subtract(273.15)
  .clip(pakistan);

// MODIS NDVI
var ndvi = ee.ImageCollection('MODIS/061/MOD13Q1')
  .filterDate(startDate, endDate)
  .select('NDVI')
  .mean()
  .multiply(0.0001)
  .clip(pakistan);

// CHIRPS Rainfall (sum)
var rain = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterDate(startDate, endDate)
  .select('precipitation')
  .sum()
  .clip(pakistan);

// -------------------- SUITABILITY MAPS --------------------
var sTemp = tempSuitability(lst);
var sNdvi = ndviSuitability(ndvi);
var sRain = rainSuitability(rain);

// -------------------- MALARIA RISK INDEX --------------------
var malariaRisk = sTemp.multiply(W_TEMP)
  .add(sNdvi.multiply(W_NDVI))
  .add(sRain.multiply(W_RAIN))
  .rename('MalariaRisk')
  .clamp(0, 1);

// -------------------- VISUALIZATION --------------------
var riskVis = {
  min: 0,
  max: 1,
  palette: ['#2c7bb6', '#abd9e9', '#ffffbf', '#fdae61', '#d7191c']
};

Map.addLayer(malariaRisk, riskVis, 'Malaria Risk Index – Pakistan');

// -------------------- LEGEND --------------------
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '10px 12px',
    backgroundColor: 'white'
  }
});

// Legend title
legend.add(ui.Label({
  value: 'Malaria Risk Index',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 8px 0'
  }
}));

// Function to create legend rows
var makeRow = function(color, name) {
  return ui.Panel({
    widgets: [
      ui.Label({
        style: {
          backgroundColor: color,
          padding: '10px',
          margin: '0 8px 0 0'
        }
      }),
      ui.Label({
        value: name,
        style: {fontSize: '12px'}
      })
    ],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

// Add legend categories
legend.add(makeRow('#2c7bb6', 'Low Risk (0.00 – 0.25)'));
legend.add(makeRow('#abd9e9', 'Moderate Risk (0.25 – 0.50)'));
legend.add(makeRow('#fdae61', 'High Risk (0.50 – 0.75)'));
legend.add(makeRow('#d7191c', 'Very High Risk (0.75 – 1.00)'));

// Add legend to map
Map.add(legend);

// -------------------- EXPORT --------------------
//
// Export.image.toDrive({
//   image: malariaRisk,
//   description: 'Malaria_Risk_Pakistan',
//   folder: 'GEE_Exports',
//   region: pakistan.geometry(),   // <-- safest default (Pakistan boundary)
//   scale: 1000,
//   maxPixels: 1e13
// });
