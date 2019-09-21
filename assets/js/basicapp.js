// // The code for the chart is wrapped inside a function that
// // automatically resizes the chart.
// function makeResponsive() {
//     // if the SVG area isn't empty when the browser loads,
//     // remove it and replace it with a resized version of the chart.
//     var svgArea = d3.select("body").select("svg");

//     // Clear SVG if not empty.
//     if (!svgArea.empty()) {
//         svgArea.remove();
//     }

//     // SVG Wrapper dimensions are determined by the current width and height of the browser window.
//     var svgWidth = window.innerWidth;
//     var svgHeight = window.innerHeight;
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Initial Params.
// var chosenXAxis = "poverty";

// // Function used for updating x-scale variable upon click on axis label.
// function xScale(paperData, chosenXAxis) {
//     // Create Scales.
//     var xLinearScale = d3.scaleLinear()
//         .domain([d3.min(paperData, d => d[chosenXAxis]) * 0.8,
//             d3.max(paperData, d => d[chosenXAxis]) * 1.2
//         ])
//         .range([0, width]);

//     return xLinearScale;

// }

// // Function used for updating xAxis var upon click on axis label.
// function renderAxes(newXScale, xAxis) {
//     var bottomAxis = d3.axisBottom(newXScale);

//     xAxis.transition()
//         .duration(1000)
//         .call(bottomAxis);

//     return xAxis;
// }

// // Function used for updating circles group with a transition to new circles.
// function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cx", d => newXScale(d[chosenXAxis]));

//     return circlesGroup;
// }

// // Function used for updating circles group with new tooltip.
// function updateToolTip(chosenXAxis, circlesGroup) {

//     if (chosenXAxis === "")
// }

// Import data.
d3.csv("assets/data/data.csv")
    .then(function(paperData) {

    // Parse/Cast as numbers
    paperData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        // console.log(data);
    });

    // Create scale functions.
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(paperData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(paperData, d => d.healthcare)])
        .range([height, 0]);

    // Create axis functions.
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Create circles.
    var circlesGroup = chartGroup.selectAll("circle")
        .data(paperData)
        .enter()
        .append("circle")
        // .transition()
        // .duration(1000)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "green")
        .attr("opacity", ".5");

    // Add State abbr. text to circles.
    var circletextGroup = chartGroup.selectAll()
        .data(paperData)
        .enter()
        .append("text")
        // .transition()
        // .duration(1000)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style('fill', 'black')
        .text(d => (d.abbr));

    // Initialize tool tip.
    // TODO: tool tip style.
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .style("background", "black")
        .style("color", "white")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<hr>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`)
        });

    // Create tooltip in the chart.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tool tip.
    circlesGroup.on("mouseover", function() {
        d3.select(this)
            .transition()
            .duration(1000)
            .attr("r", 20)
            .attr("fill", "blue");
    })
        .on("click", function(d) {
            toolTip.show(d, this);
        })

        .on("mouseout", function() {
            d3.select(this)
            .transition()
            .duration(1000)
            .attr("r", 15)
            .attr("fill", "green")
            toolTip.hide()
        });

    // Create axes labels.
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

    });


// };

// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // When the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);