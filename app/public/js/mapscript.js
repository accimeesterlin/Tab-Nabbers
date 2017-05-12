var map = d3.select(".map");

var path = d3.geoPath();

d3.json("https://unpkg.com/us-atlas@1/us/10m.json", function(error, us) {
if (error) throw error;

map.append("path")
    .attr("stroke-width", 0.5)
    .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

map.append("path")
    .attr("d", path(topojson.feature(us, us.objects.nation)));
});

var width = 960,
    height = 600;

var root = {
    "name": "Atlanta",
    "children": [{
        "name": "GT Bootcamp",
        "_children": null,
        "children": [{
            "name": "Cohort 1"
        }, {
            "name": "Cohort 2"
        }]
    }, {
        "name": "IronYard",
        "_children": null,
        "children": [{
            "name": "server984"
        }, {
            "name": "server983"
        }]
    }, {
        "name": "General Assembly",
        "_children": null,
        "children": [{
            "name": "server999",
            "_children": null,
            "children": [{
                "name": "server992",
            }]
        }]
    }]
};

//initialising hierarchical data
root = d3.hierarchy(root);

var i = 0;

var transform = d3.zoomIdentity;;

var nodeSvg, linkSvg, simulation, nodeEnter, linkEnter ;

var svg = d3.select(".tree").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.zoom().scaleExtent([1 / 2, 8]).on("zoom", zoomed))
    .append("g");
    // .attr("transform", "translate(230,100)");

function zoomed() {
    svg.attr("transform", d3.event.transform);
}

simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; }))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width / 2, height / 2))
.on("tick", ticked);

update();

function update() {
var nodes = flatten(root);
var links = root.links();

linkSvg = svg.selectAll(".link")
    .data(links, function(d) { return d.target.id; })

linkSvg.exit().remove();

var linkEnter = linkSvg.enter()
    .append("line")
    .attr("class", "link");
    
linkSvg = linkEnter.merge(linkSvg)

nodeSvg = svg.selectAll(".node")
    .data(nodes, function(d) { return d.id; })

nodeSvg.exit().remove();

var nodeEnter = nodeSvg.enter()
    .append("g")
    .attr("class", "node")
    .on("click", click)
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

    nodeEnter.append("circle")
    .attr("r", 4  )
    .append("title")
        .text(function(d) { return d.data.name; })

    nodeEnter.append("text")
    .attr("dy", 3)
    .attr("x", function(d) { return d.children ? -8 : 8; })
    .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
    .text(function(d) { return d.data.name; });
    
nodeSvg = nodeEnter.merge(nodeSvg);

    simulation
    .nodes(nodes)

    simulation.force("link")
    .links(links);

}

function ticked() {
linkSvg
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

nodeSvg
    .attr("transform", function(d) { return "translate(" + d.x + ", " + d.y + ")"; });
}

function click (d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    update();
    simulation.restart();
    } else {
        d.children = d._children;
        d._children = null;
    update();
    simulation.restart();
    }
}

function dragstarted(d) {
if (!d3.event.active) simulation.alphaTarget(0.3).restart()
simulation.fix(d);
}

function dragged(d) {
simulation.fix(d, d3.event.x, d3.event.y);
}

function dragended(d) {
if (!d3.event.active) simulation.alphaTarget(0);
simulation.unfix(d);
}

function flatten (root) {
// hierarchical data to flat data for force layout
var nodes = [];
function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
    else ++i;
    nodes.push(node);
}
recurse(root);
return nodes;
}