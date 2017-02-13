// array that will hold the requested JSON data
var dataset = [];

var svgWidth = getSVGWidth();
var svgHeight = 400;
var svgPadding = 40;
var svgPaddingLeft = 80;
var tooltipHeight = 50;
var tooltipWidth = 100;

// use axios library for ajax request
axios.get('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(function (response){
    dataset = response.data;
    console.log(response.data);
    drawChart();
  })
  .catch(function (error) {
    console.log(error);
  });

function getSVGWidth() {
  width = window.innerWidth * .9;
  if (width > 700) {
    width = 700;
    } else if (width < 350) {
      width = 350;
    }
  return width;
}

// create tooltip and append to body, add event listeners for window resizing
window.onload = function() {
  // create tooltip
  var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip');

  // labels within tooltip that will display gdp and date data
  tooltip.append('div')
    .attr('class', 'gdp-label');

  tooltip.append('div')
    .attr('class', 'date-label');
  
  // resize width of SVG when window resizes
  window.addEventListener('resize', function(event) {
    svgWidth = getSVGWidth();
    d3.select('svg').remove();
    drawChart();
  });
};   

function drawChart() {

  // y scale will be ranking/position 1 at top
  // x scale will be minutes behind fastest time 0:00 at far right

  // create graph and append to div
  var svg = d3.select('.graph-container').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('class', 'graph');

  // add graph title
  svg.append('text')
    .attr('x', svgWidth / 2 )
    .attr('y', svgPadding)
    .attr('class', 'graph-title')
    .style('text-anchor', 'middle')
    .text('Doping Allegations vs. Finishing Time');

  // add x-axis label
  svg.append('text')
    .attr('x', svgWidth / 2 )
    .attr('y', svgHeight - 5)
    .style('text-anchor', 'middle')
    .text('Minutes Behind Fastest Time');

  // add y-axis label
  svg.append('text')
    .attr('x', 0 - (svgHeight / 2))
    .attr('y', (svgPadding - 10))
    .style('text-anchor', 'middle')
    .text('Ranking')
    .attr('transform', 'rotate(-90)');

  // find min and max finishing times
  // is this necessary?
  // var maxGDP = d3.max(dataset, function(d) { return d[1] });
  // var minGDP = d3.min(dataset, function(d) { return d[1] });


  // create x scale
  xScale = d3.scaleLinear()
    .domain([dataset[dataset.length-1].Seconds, dataset[0].Seconds])
    .range([svgPaddingLeft, svgWidth - svgPadding]);

  console.log(xScale.domain());

  // create y scale
  yScale = d3.scaleLinear()
    .domain([dataset[dataset.length-1].Place, dataset[0].Place])
    .range([svgHeight - svgPadding, svgPadding]);

  // create data points/append circles to svg
  d3.select("svg").selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return xScale(d.Seconds);
    })
    .attr('cy', function(d) {
      return yScale(d.Place);
    })
    .attr('r', 3)
    .attr('fill', function(d) {
      return d.Doping === "" ? 'green' : 'red';
    })

}