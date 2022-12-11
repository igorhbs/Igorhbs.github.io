//Create the SVG and set the width and height variables
var svg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

//Create the data and set the color scale
var dataset = [
    [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
    [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
];

var colors = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d[1]; })])
    .range(["rgb(0,0,255)", "rgb(255,0,0)"]);

//Add the rectangles for the heatmap
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d) { return d[0]; })
    .attr("y", function(d) { return d[1]; })
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", function(d) { return colors(d[1]); });
