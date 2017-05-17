var width = 960,
    height = 500;

var path = d3.geo.path();

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var url = "https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json"
d3.json(url, function(error, topology) {
  if (error) throw error;
  
  console.log("topojson", topology)
  var geojson = topojson.feature(topology, topology.objects.states);
  console.log("geojson", geojson)

  svg.selectAll("path")
      .data(geojson.features)
    .enter().append("path")
      .attr("d", path);
});