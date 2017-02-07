#up-shape-scrape#

Scrape geographic data files of UP used by the Election Commission of India [on Shristi(GIS-UP)](http://gis.up.nic.in/srishti/election2017/).

##Instructions##
1. **Install**
  - Run `npm install`
2. **Scrape**
  - Open `scrape.js`.
  - Check the function `makeURL()`. If the path includes `pc`, you're scraping parliamentary constituencies. If it includes `district`, you're scraping districts.
  - The site only seems to allow you to scrape five files at once, so you have to update the `min` and `max` variables at the top. First, `min = 1, max = 5`, then `min = 6, max = 10`, and so on. There are 80 parliamentary constituencies and 75 districts, so it doesn't take take too long to scrape them all. The KML files download to a directory called `kml`.
3. **Merge**
  - Each KML files contains information about one district / constituency. To merge them, run `merge.js`. It'll output to path `kml/uttarpradesh.kml`.
4. **Convert**
  - Convert the merged KML file to GeoJSON by running `node merge.js`. It'll output to path `json/uttarpradesh.json`.

##Note##
The final files are pretty big. You can significantly shrink the GeoJSON file without losing any of the borders' precision. A good tool for this is **mapshaper**, which has [a nice GUI](http://www.mapshaper.org/).
