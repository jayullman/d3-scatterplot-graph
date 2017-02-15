# d3-scatterplot-graph

This projects requests JSON data and utilizes the D3.js data visualization library to bind the data to data points. Hovering over a data point will display a tooltip containing additional information including any doping allegations if available.

The Axios library was used to make an AJAX request to retrieve the JSON data. Once the data has been received, the graph is drawn based on the retrieved dataset. Two dimensions of data were used to place each point. The y-axis represents the place in the race, and the x-axis represents the time in minutes behind the fastest time. Numeral.js was used to format the time in seconds into minutes for use along the x-axis.

The SVG graph was made responsively by dynamically calculating the width of the screen and redrawing the graph upon the window resizing event.
    
