var config = {
  data: [
    {
      label: {
        text: "week 1", // Bar label
        fontFamily: "Helvetica",
        fontSize: "15px",
        fontColor: "#000"
      },
      bar: {
        value: 13, // Bar value
        color: "#000", // Bar color
        width: 5
      }
    },
    {
      label: {
        text: "week 2", // Bar label
        fontFamily: "Helvetica",
        fontSize: "15px",
        fontColor: "#000"
      },
      bar: {
        value: 13, // Bar value
        color: "#000", // Bar color
        width: 5
      }
    },
    {
      label: {
        text: "week 3", // Bar label
        fontFamily: "Helvetica",
        fontSize: "15px",
        fontColor: "#000"
      },
      bar: {
        value: 13, // Bar value
        color: "#000", // Bar color
        width: 5
      }
    },
    {
      label: {
        text: "week 4", // Bar label
        fontFamily: "Helvetica",
        fontSize: "15px",
        fontColor: "#000"
      },
      bar: {
        value: 13, // Bar value
        color: "#000", // Bar color
        width: 5
      }
    }],
  width: 400,
  height: 400,
  center: {
    innerRadius: 30,
    backgroundColor: "#000",
    text: ["line 1", "line 2"],
    fontName: "Helvetica",
    fontSize: "15px",
    fontColor: "#000"
  },
  outerRadius: 90,
  labelDistance: 10 // Label distance from outerRadius.
};

var rotationDegree = getRotationDegree(config.data);

var svg = d3.select("body")
            .append("svg")
            .attr("id", "radial0")
            .attr("width", config.width)
            .attr("height", config.height);

svg.selectAll('rect').data(config.data)
  .enter()
  .append("rect")
  .attr("id", function(d, i) { return "bar" + i; })
  .attr("fill", function(d, i) { return d.bar.color; })
  .attr("width", function(d, i) { return d.bar.value; })
  .attr("height", function(d, i) { return d.bar.width; })
  .attr("x", function(d, i) { return (d.bar.value + config.center.innerRadius) * -1; })
  .attr("y", function(d, i) { return d.bar.width * -1; })
  .attr("transform", function(d, i) {
    return "translate(" + ( (config.width / 2) - (d.bar.width / 2) ) + "," + (config.height / 2) + ") rotate(" + (rotationDegree * i) + ")";
  });

svg.selectAll('text').data(config.data)
  .enter()
  .append("text")
  .attr("x", function(d, i) { return (config.outerRadius + config.labelDistance) * -1; })
  .attr("y", 0)
  .attr("transform", function(d, i) {
    return "translate(" + ( (config.width / 2) - (d.bar.width / 2) ) + "," + (config.height / 2) + ") rotate(" + (rotationDegree * i) + ")";
  })
  .text(function (d, i) { return d.label.text; })
  .attr("font-family", function(d, i) { return d.label.fontFamily; } )
  .attr("font-size", function(d, i) { return d.label.fontSize; } )
  .attr("fill", function(d, i) { return d.label.fontColor; } );

// InnerCircle
svg.append("circle")
  .attr("cx", config.width / 2)
  .attr("cy", config.height /2 )
  .attr("r", config.center.innerRadius);

// OuterCircle
svg.append("circle")
  .attr("cx", config.width / 2).attr("cy", config.height / 2)
  .attr("r", config.outerRadius)
  .style("fill", "none")
  .style("stroke", "black")
  .style("stroke-width",".5px");

function getRotationDegree(data) {
  return 360 / data.length;
}

// Math.sin(angleDegree * Math.PI / 180)
// Math.cos(angleDegree * (180/Math.PI))
