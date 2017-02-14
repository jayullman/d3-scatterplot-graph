// array that will hold the requested JSON data
var dataset = [];

var svgWidth = getSVGWidth();
var svgHeight = 500;
var svgPadding = 40;
var svgPaddingTop = 20;
var svgPaddingLeft = 80;
var svgPaddingRight = 110;
var svgPaddingBottom = 40;
var tooltipHeight = 50;
var tooltipWidth = 100;

var circleRadius = 3;

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
  width = window.innerWidth * .85;
  // create max and min-widths
  if (width > 750) {
    width = 750;
    } else if (width < 310) {
      width = 310;
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
    // remove old chart and legend box on resizing
    d3.select('svg').remove();
    d3.select('.legend-box').remove();
    drawChart();
  });
};   

function mouseOverHandler(d) {
  d3.select('.tooltip')
    .attr('style', 'left: ' + (d3.event.pageX - (tooltipWidth / 2))
      + 'px; top:  ' + (d3.event.pageY - tooltipHeight - 25) + 'px;' 
      + 'height: ' + tooltipHeight + 'px; width: ' + tooltipWidth + 'px;')
    .classed('show-tooltip', true);

  // d3.select('.gdp-label')
  //   .text('$' + d[1].toLocaleString('en-US', { currency: 'USD', minimumFractionDigits: 2 }) + ' Billion');

  // var date = new Date(d[0])
  // d3.select('.date-label')
  //   .text(date.getFullYear() + ', ' + MONTHS[date.getMonth()]);
}


function drawChart() {

  // y scale will be ranking/position 1 at top
  // x scale will be minutes behind fastest time 0:00 at far right

  // create graph and append to div
  var svg = d3.select('.graph-container').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('class', 'graph');

  

  // find min and max finishing times
  // is this necessary?
  // var maxGDP = d3.max(dataset, function(d) { return d[1] });
  // var minGDP = d3.min(dataset, function(d) { return d[1] });


  // create x scale
  // add slight padding to max value
  xScale = d3.scaleLinear()
    .domain([dataset[dataset.length-1].Seconds + 5, dataset[0].Seconds])
    .range([svgPaddingLeft, svgWidth - svgPaddingRight]);

  console.log(xScale.domain());

  // create y scale
  // add slight padding to max value
  yScale = d3.scaleLinear()
    .domain([dataset[dataset.length-1].Place + 1, dataset[0].Place])
    .range([svgHeight - svgPaddingBottom, svgPadding]);

  // create data points/append circles to svg
  svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return xScale(d.Seconds);
    })
    .attr('cy', function(d) {
      return yScale(d.Place);
    })
    .attr('r', circleRadius)
    .attr('fill', function(d) {
      return d.Doping === "" ? 'green' : 'red';
    })

    // add mouseover event to each bar
    .on('mouseenter', mouseOverHandler)
    .on('mousemove', mouseOverHandler)
    .on('mouseover', mouseOverHandler)
    .on('mouseleave', function() {
      d3.select('.tooltip')
        .classed('show-tooltip', false);
    });
    
    // create labels for each datapoint

  svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function(d) {
      return d.Name;
    })
    .attr('x', function(d) {
      return xScale(d.Seconds) + 5;
    })
    .attr('y', function(d) {
      return yScale(d.Place) + 3;
    })
    .attr('style', 'font-size: 11px');

  // add graph title
  svg.append('text')
    .attr('x', svgWidth / 2 )
    .attr('y', 20)
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

  // create x and y axis
  var xAxis = d3.axisBottom(xScale);
  xAxis.tickSizeOuter(0);
  //xAxis.tickFormat(d3.timeFormat('%Y'))
    
  svg.append('g')
    .attr('transform', 'translate(2,' + (svgHeight - svgPadding) + ')')
    .style('font-size', function() {
      if (svgWidth < 400) {
        return '6px';
      } else if ( svgWidth < 500) {
        return '8px';
      } else {
        return '12px';
      }
    })
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale);
  yAxis.tickSizeOuter(0);

  svg.append('g')
    .attr('transform', 'translate(' + svgPaddingLeft + ',0)')
    .call(yAxis);

  // create legend box
  var legend = d3.select('.graph-container')
    .append('div')
    .attr('class', 'legend-box');

  legend.append('svg')
    .attr('width', '100')
    .attr('height', '80')

  legend.select('svg')
    .append('circle')
      .attr('cx', 10)
      .attr('cy', 30)
      .attr('r', circleRadius)
      .attr('fill', 'green')

  legend.select('svg')
    .append('circle')
      .attr('cx', 10)
      .attr('cy', 50)
      .attr('r', circleRadius)
      .attr('fill', 'red')    

  legend.select('svg')
    .append('text')
      .attr('x', 25)
      .attr('y', 14)
     // .classed('legend-text', true)
      .style('font-size', '14px')
      .text('Legend');
    
  legend.select('svg')
    .append('text')
      .attr('x', 14)
      .attr('y', 33)
      .classed('legend-text', true)
      .text('No allegation');
  
  legend.select('svg')
    .append('text')
      .attr('x', 14)
      .attr('y', 53)
      .classed('legend-text', true)      
      .text('Allegation');
}