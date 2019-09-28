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
    var svgWidth = 900;
    var svgHeight = 600;

    var margin = {
        top: 40,
        bottom: 90,
        right: 40,
        left: 100
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

    // Initial Params.
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";

    // Function used for updating x-scale variable upon click on axis label.
    function xScale(paperData, chosenXAxis) {
        // Create Scales.
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(paperData, d => d[chosenXAxis]) * .8,
                d3.max(paperData, d => d[chosenXAxis]) * 1.2
            ])
            .range([0, width]);

        return xLinearScale;

    }

    // Function used for updating y-scale variable upon click on axis label.
    function yScale(paperData, chosenYAxis) {
        // Create Scales.
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(paperData, d => d[chosenYAxis]) * .8,
                d3.max(paperData, d => d[chosenYAxis]) * 1.2
            ])
            .range([height, 0]);

        return yLinearScale;
    }

    // Function used for updating xAxis var upon click on axis label.
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    // Function used for updating yAxis var upon click on axis label.
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);

        yAxis.transition()
            .duration(1000)
            .call(leftAxis);

        return yAxis;
    }

    // Function used for updating circles group with a transition to new circles.
    function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]))
            .attr("cy", d => newYScale(d[chosenYAxis]));

        return circlesGroup;
    }

    // Function used for updating text in circles group with a transition to new text.
    function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
        circletextGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]));
        
        return circletextGroup;
    }

    // Function used for updating circles group with new tooltip.
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

        // Conditional for X Axis.
        if (chosenXAxis === "poverty") {
            var xlabel = "Poverty: ";
        }
        else if (chosenXAxis === "income") {
            var xlabel = "Median Income: "
        }
        else {
            var xlabel = "Age: "
        }

        // Conditional for Y Axis.
        if (chosenYAxis === "healthcare") {
            var ylabel = "Lacks Healthcare: ";
        }
        else if (chosenYAxis === "smokes") {
            var ylabel = "Smokers: "
        }
        else {
            var ylabel = "Obesity: "
        }

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .style("background", "black")
            .style("color", "white")
            .offset([120, -60])
            .html(function(d) {
                if (chosenXAxis === "age") {
                    // All yAxis tooltip labels presented and formated as %.
                    // Display Age without format for xAxis.
                    return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                  } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
                    // Display Income in dollars for xAxis.
                    return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
                  } else {
                    // Display Poverty as percentage for xAxis.
                    return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
                  }      
            });
        
        circlesGroup.call(toolTip);

        // Create "mouseover" event listener to display tool tip.
        circlesGroup
            // .on("mouseover", function() {
            // d3.select(this)
            //     .transition()
            //     .duration(3000)
            //     .attr("r", 20)
            //     .attr("fill", "blue");
            // })
            .on("click", function(data) {
                toolTip.show(data, this);
            })
            // .on("mouseout", function() {
            //     d3.select(this)
            //     // .transition()
            //     // .duration(1000)
            //     // .attr("r", 15)
            //     // .attr("fill", "green")
            //     toolTip.hide()
            // });
            .on("mouseout", function(data) {
                toolTip.hide(data)
            });

        return circlesGroup;
    }

    // Import data.
    d3.csv("assets/data/data.csv")
        .then(function(paperData) {

        // Parse/Cast as numbers
        paperData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
            data.age = +data.age;
            data.income = +data.income;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
            console.log(data);
        });

        // Create x scale function.
        // xLinearScale function above csv import.
        var xLinearScale = xScale(paperData, chosenXAxis);

        // Create y scale function.
        // yLinearScale function above csv import.
        var yLinearScale = yScale(paperData, chosenYAxis);

        // Create axis functions.
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // Create circles.
        var circlesGroup = chartGroup.selectAll("circle")
            .data(paperData)
            .enter()
            .append("circle")
            // .transition()
            // .duration(1000)
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", "15")
            .attr("fill", "green")
            .attr("opacity", ".5");

        // Add State abbr. text to circles.
        var circletextGroup = chartGroup.selectAll()
            .data(paperData)
            .enter()
            .append("text")
            .text(d => (d.abbr))
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .style('fill', 'black');

        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var povertyLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty") // value to grab for event listener.
            .classed("active", true)
            .text("In Poverty (%)");

        var ageLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age") // value to grab for event listener.
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income") // value to grab for event listener.
            .classed("inactive", true)
            .text("Household Income (Median)");

        var healthcareLabel = labelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", (margin.left) * 2.5)
            .attr("y", 0 - (height - 60))
            .attr("value", "healthcare") // value to grab for event listener.
            .classed("active", true)
            .text("Lacks Healthcare (%)");

        var smokeLabel = labelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", (margin.left) * 2.5)
            .attr("y", 0 - (height - 40))
            .attr("value", "smokes") // value to grab for event listener.
            .classed("inactive", true)
            .text("Smokes (%)");

        var obesityLabel = labelsGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", (margin.left) * 2.5)
            .attr("y", 0 - (height - 20))
            .attr("value", "obesity") // value to grab for event listener.
            .classed("inactive", true)
            .text("Obesity (%)");

        // Update tool tip function above csv import.
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // X Axis labels event listener.
        labelsGroup.selectAll("text")
            .on("click", function() {
                // Get value of selection.
                var value = d3.select(this).attr("value");

                if (true) {
                    if (value === "poverty" || value === "age" || value === "income") {

                        // Replaces chosenXAxis with value.
                        chosenXAxis = value;

                        // console.log(chosenXAxis)

                        // Update x scale for new data.
                        xLinearScale = xScale(paperData, chosenXAxis);

                        // Updates x axis with transition.
                        xAxis = renderXAxes(xLinearScale, xAxis);

                        // Changes classes to change bold text.
                        if (chosenXAxis === "poverty") {
                            povertyLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true);
                            
                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else if (chosenXAxis === "age"){
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            ageLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            incomeLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else {
                            povertyLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            ageLabel
                                .classed("active", false)
                                .classed("inactive", true)

                            incomeLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        }
                    
                    } else {

                        chosenYAxis = value;

                        // Update y scale for new data.
                        yLinearScale = yScale(paperData, chosenYAxis);

                        // Updates y axis with transition.
                        yAxis = renderYAxes(yLinearScale, yAxis);

                        // Changes classes to change bold text.
                        if (chosenYAxis === "healthcare") {
                            healthcareLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            smokeLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            obesityLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else if (chosenYAxis === "smokes"){
                            healthcareLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            smokeLabel
                                .classed("active", true)
                                .classed("inactive", false);

                            obesityLabel
                                .classed("active", false)
                                .classed("inactive", true);
                        }
                        else {
                            healthcareLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            smokeLabel
                                .classed("active", false)
                                .classed("inactive", true);

                            obesityLabel
                                .classed("active", true)
                                .classed("inactive", false);
                        }
                    
                    }

                    // Update circles with new x values.
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                    // Update tool tips with new info.
                    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                    // Update circles text with new values.
                    circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                }
                
            });

    });

// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // When the browser window is resized, makeResponsive() is called.
// d3.select(window).on("resize", makeResponsive);