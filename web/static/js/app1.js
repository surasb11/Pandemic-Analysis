var svgWidth = 500;
var svgHeight = 450;

var margin = {
  top: 20,
  right: 70,
  bottom: 60,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

// TURKEY
function draw1(selector){
  var svg = d3.select(selector).append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//initial parameters; x and y axis
var chosenXAxis = 'COUNTRY';
var chosenYAxis = 'FEMALE_DEATHS';


//a function for updating the x-scale variable upon click of label
function xScale(genderData, chosenXAxis) {
    //scales
    var xLinearScale = d3.scaleLinear()
      .domain([0, 6])
      .range([0, width]);

    return xLinearScale;
}


//a function for updating y-scale variable upon click of label
function yScale(genderData, chosenYAxis) {
  //scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(genderData, d => d[chosenYAxis]) * 0.8,
      d3.max(genderData, d => d[chosenYAxis]) * 1.2])
    .range([height, 0]);

  return yLinearScale;
}
//a function for updating the xAxis upon click
function renderXAxis(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

//function used for updating yAxis variable upon click
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

//a function for updating the circles with a transition to new circles 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(2000)
      .attr('cx', data => newXScale(data[chosenXAxis]))
      .attr('cy', data => newYScale(data[chosenYAxis]))

    return circlesGroup;
}


//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    if (chosenXAxis === 'COUNTRY') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}

//funtion for updating circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {


    if (chosenXAxis === 'COUNTRY') {
      var xLabel = 'Country:';
    }

    else {
      var xLabel = 'Country:';
    }
//Y label
  //healthcare
  if (chosenYAxis ==='FEMALE_DEATHS') {
    var yLabel = "Female Deaths:"
  }
 
  else{
    var yLabel = 'Male Deaths:';
  }

  //create tooltip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function(d) {
        return (`${'Country: '} ${d.COUNTRY_NAME}<br>${'Total Deaths: '} ${d.TOTAL_DEATHS}<br>${yLabel} ${d[chosenYAxis]}`);
  });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    return circlesGroup;
}
//retrieve data
d3.csv('../csv-files/output_data/gender.csv').then(function(genderData) {

    console.log(genderData);
    
    //Parse data
    genderData.forEach(function(data){
      data.COUNTRY = +data.COUNTRY;
      data.FEMALE_DEATHS= +data.FEMALE_DEATHS;
      data.MALE_DEATHS = +data.MALE_DEATHS;
    });

    //create linear scales
    var xLinearScale = xScale(genderData, chosenXAxis);
    var yLinearScale = yScale(genderData, chosenYAxis);

    //create x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append X
    var xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    //append Y
    var yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      //.attr
      .call(leftAxis);
    
    //append Circles
    var circlesGroup = chartGroup.selectAll('circle')
      .data(genderData)
      .enter()
      .append('circle')
      .classed('stateCircle', true)
      .attr('cx', d => xLinearScale(d[chosenXAxis]))
      .attr('cy', d => yLinearScale(d[chosenYAxis]))
      .attr('r', 14)
      .attr("fill", "purple")
      .attr('opacity', '.5');

  

    //create a group for the x axis labels
    var xLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

    var COUNTRYLabel = xLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 20)
      .attr('value', 'COUNTRY')
      .text('Country');
      

    //create a group for Y labels
    var yLabelsGroup = chartGroup.append('g')
      .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

    var FEMALE_DEATHSLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('active', true)
      .attr('x', 0)
      .attr('y', 0 - 45)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'FEMALE_DEATHS')
      .text('Female Deaths');
    
    var MALE_DEATHSLabel = yLabelsGroup.append('text')
      .classed('aText', true)
      .classed('inactive', true)
      .attr('x', 0)
      .attr('y', 0 - 65)
      .attr('dy', '1em')
      .attr('transform', 'rotate(-90)')
      .attr('value', 'MALE_DEATHS')
      .text('Male Deaths');
    
    
    //update the toolTip
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //x axis event listener
    xLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if (value != chosenXAxis) {

          //replace chosen x with a value
          chosenXAxis = value; 

          //update x for new data
          xLinearScale = xScale(genderData, chosenXAxis);

          //update x 
          xAxis = renderXAxis(xLinearScale, xAxis);

          //upate circles with a new x value
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);


          //update tooltip
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          //change of classes changes text
          if (chosenXAxis === 'COUNTRY') {
            COUNTRYLabel.classed('active', true).classed('inactive', false);
          }
         
          else {
            COUNTRYLabel.classed('active', false).classed('inactive', true);
          }
        }
      });
    //y axis lables event listener
    yLabelsGroup.selectAll('text')
      .on('click', function() {
        var value = d3.select(this).attr('value');

        if(value !=chosenYAxis) {
            //replace chosenY with value  
            chosenYAxis = value;

            //update Y scale
            yLinearScale = yScale(genderData, chosenYAxis);

            //update Y axis 
            yAxis = renderYAxis(yLinearScale, yAxis);

            //Udate CIRCLES with new y
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update tooltips
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //Change of the classes changes text
            if (chosenYAxis === 'MALE_DEATHS') {
              MALE_DEATHSLabel.classed('active', true).classed('inactive', false);
              FEMALE_DEATHSLabel.classed('active', false).classed('inactive', true);
            }
            else {
              MALE_DEATHSLabel.classed('active', false).classed('inactive', true);
              FEMALE_DEATHSLabel.classed('active', false).classed('inactive', true);
            }
          }
        });
   
}).catch(function(error) {
  console.log(error);
});

}

draw1("#chart1");