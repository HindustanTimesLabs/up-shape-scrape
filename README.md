# up-shape-scrape

Scrape geographic data files of UP used by the Election Commission of India [on Shristi(GIS-UP)](http://gis.up.nic.in/srishti/election2017/).

## Setup
```bash
git clone https://github.com/HindustanTimesLabs/up-shape-scrape
cd up-shape-scrape
npm install
```

## Instructions
```bash
node scripts/scrape.js # scrape districts or lok sabha constituencies -> kml/[type]/
node scripts/merge.js # merge individual polygons into a big kml file -> kml/merged/
node scripts/convert.js # convert the kml into geojson -> json/
```

The final files are pretty big. You can significantly shrink the GeoJSON file without losing any of the borders' precision. A good tool for this is **mapshaper**, which has [a nice GUI](http://www.mapshaper.org/).