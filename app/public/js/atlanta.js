// some colour variables
var tcBlack = "#130C0E";

var logos = ["http://warehousenews.co.uk/wp-content/uploads/2009/08/atlanta-logo.jpg",
             "http://vector.me/files/images/2/8/28227/georgia_tech_yellow_jackets.png",
             "http://www.ethanjfriedman.com/assets/General_Assembly_logo.png",
             "https://pbs.twimg.com/profile_images/552955646346145793/DKlUDGsR.png",
             "./img/cohort_1.png", "./img/cohort_2.png", "./img/cohort_3.png"];

// rest of vars
var w = 1200,
    h = 800,
    maxNodeSize = 50,
    x_browser = 20,
    y_browser = 25,
    root;

var atlantaVis;
var force = d3.layout.force();

atlantaVis = d3.select("#atlantaVis").append("svg").attr("width", w).attr("height", h);

d3.json("atlanta.json", function(json) {
  root = json;
  root.fixed = true;
  root.x = 805;
  root.y = 455;


        // Build the path
  var defs = atlantaVis.insert("svg:defs")
      .data(["end"]);


  defs.enter().append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

     update();

   function collapse(d) {
     if(d.children) {
       d._children = d.children;
       d._children.forEach(collapse);
       d.children = null;
     }
   }

   function collapseAll() {
     collapse(root);
     update();
   }
   collapseAll();
});


/**
 *
 */
function update() {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force.nodes(nodes)
        .links(links)
        .gravity(0.05)
        .charge(-1500)
        .linkDistance(100)
        .friction(0.5)
        .linkStrength(function(l, i) {return 1; })
        .size([w, h])
        .on("tick", tick)
        .start();

   var path = atlantaVis.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

    path.enter().insert("svg:path")
      .attr("class", "link")
      // .attr("marker-end", "url(#end)")
      .style("stroke", "#eee");


  // Exit any old paths.
  path.exit().remove();


  // Update the nodes…
  var node = atlantaVis.selectAll("g.node")
      .data(nodes, function(d) { return d.id; });


  // Enter any new nodes.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click", click);
    //   .call(force.drag);

  // Append a circle
  nodeEnter.append("svg:circle")
      .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
      .style("fill", "#eee");


  // Append images
  var images = nodeEnter.append("svg:image")
        .attr("xlink:href",  function(d) { return d.img;})
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50);

  // make the image grow a little on mouse over and add the text details on click
  var setEvents = images
          // Append name text
          .on( 'click', function imgClick(d) {
              if (logos.indexOf(d.img) == -1) {
                var newContent = "<img id='profile' src=" + d.img + "><hr>";
                newContent += "<p class='modalName'>"+ d.name + " " + d.lastname + "</p><br>";
                newContent += "<p class='modalEmail'>" + "<i class='fa fa-envelope' aria-hidden='true'></i> " + d.email + "</p>";
                newContent += "<p class='modalPhone'>" + "<i class='fa fa-phone' aria-hidden='true'></i> " + d.phone + "</p>";
                newContent += "<p class='modalGit'>" + "<i class='fa fa-github' aria-hidden='true'></i> " + d.github + "</p>";
                d3.select("#modal").style("display", "block").select("#content").html(newContent);
              }
            })

          .on( 'mouseenter', function() {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -60;})
              .attr("y", function(d) { return -60;})
              .attr("height", 100)
              .attr("width", 100);
          })
          // set back
          .on( 'mouseleave', function() {
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -25;})
              .attr("y", function(d) { return -25;})
              .attr("height", 50)
              .attr("width", 50);
          });

  // Append name name on roll over next to the node as well
  nodeEnter.append("text")
      .attr("class", "nodetext")
      .attr("x", x_browser)
      .attr("y", y_browser +15)
      .attr("fill", tcBlack)
      .text(function(d) { return d.name; });


  // Exit any old nodes.
  node.exit().remove();


  // Re-select for update.
  path = atlantaVis.selectAll("path.link");
  node = atlantaVis.selectAll("g.node");

function tick() {


    path.attr("d", function(d) {

     var dx = d.target.x - d.source.x,
           dy = d.target.y - d.source.y,
           dr = Math.sqrt(dx * dx + dy * dy);
           return   "M" + d.source.x + ","
            + d.source.y
            + "A" + dr + ","
            + dr + " 0 0,1 "
            + d.target.x + ","
            + d.target.y;
  });
    node.attr("transform", nodeTransform);
  }
}


/**
 * Gives the coordinates of the border for keeping the nodes inside a frame
 * http://bl.ocks.org/mbostock/1129492
 */
function nodeTransform(d) {
  d.x =  Math.max(maxNodeSize, Math.min(w - (d.imgwidth/2 || 16), d.x));
    d.y =  Math.max(maxNodeSize, Math.min(h - (d.imgheight/2 || 16), d.y));
    return "translate(" + d.x + "," + d.y + ")";
   }

/**
 * Toggle children on click.
 */
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update();
}


/**
 * Returns a list of all nodes under the root.
 */
function flatten(root) {
  var nodes = [];
  var i = 0;

  function recurse(node) {
    if (node.children)
      node.children.forEach(recurse);
    if (!node.id)
      node.id = ++i;
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

/*modal close*/

function nodeOut() {
      d3.selectAll(".hoverLabel").remove();
      d3.selectAll("circle").style("opacity", 1).style("stroke", "black").style("stroke-width", "1px");
      d3.selectAll("line").style("opacity", 0.25);
      }
