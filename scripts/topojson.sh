topojson -o data/states.txt --id-property +STATEFP -- scripts/stateshp/cb_2014_us_state_20m.shp

topojson -o data/cbsa.txt --id-property +CBSAFP -- scripts/cbsashp/tl_2015_us_cbsa.shp

topojson -o data/metros.txt -- data/cbsa.txt data/states.txt