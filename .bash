
function carthoToSvg () {
  shp2json "$1" -o cartho/output/"$2".json
  geoproject 'd3
    .geoMercator()
    .scale(1)
    .translate([0, 0])
    .scale(1960)
    .translate([301.20837411844354, 2046.5388369824584])' < cartho/output/"$2".json > cartho/output/"$2"-mercator.json
  geo2svg -w 800 -h 500 < cartho/output/"$2"-mercator.json > cartho/output/"$2"-mercator.svg
}

function simplify () {
  geo2topo -n cartho/output/departements-20180101-mercator.json > /cartho/output/departements-20180101-mercator-topo.json
}
