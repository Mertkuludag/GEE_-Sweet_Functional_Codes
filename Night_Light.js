
var roi = Istanbul

//Gece Işıkları Haritasını Ekleyelim
var nightset = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG").filterDate("2021-01-01","2021-12-31")

//Medianı Bulunur ve Sınıra Göre cliplenir
var nightsetmed = nightset.median().clip(roi) 


//Reproject ile gece haritası 30x30'a döndürülür
var nightsetmed = nightsetmed.setDefaultProjection('EPSG:4326', null, 375)
var project = nightsetmed.projection();
var nightsetmed = nightsetmed
  .reduceResolution({
    reducer: ee.Reducer.mode(),
    //maxPixels: 65536 // Max input pixels for each output pixel
  })
  .reproject({
    crs: project,
    scale: 30 //Scale yukarda tanımlandı
  })



var avg_rad = nightsetmed.select('avg_rad')
var nightexc = avg_rad.gte(30);
Map.addLayer(nightexc, {}, 'Night');


var nightexcMasked = nightexc.selfMask();
Map.addLayer(nightexcMasked, {palette:'red'}, 'nightexcMasked');


//Görüntüyü Exportlama
Export.image.toDrive({
  image: nightexcMasked,
  description: 'Night_Time_Istanbul_Avg20',
  scale: 30,
  region: roi,
  maxPixels : 2349664789
});

