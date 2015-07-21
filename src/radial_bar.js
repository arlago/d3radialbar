var config = {
  data: [],
  width: 400,
  height: 400,
  center: {
    innerRadius: 30,
    backgroundColor: "#000",
    text: [
      {
        "text": "32",
        "color": "#999",
        "fontSize": 16,
        "font": "helvetica",
        "topPadding": 12
      },
      {
        "text": "kWh",
        "color": "#999",
        "fontSize": 16,
        "font": "helvetica",
        "topPadding": 12
      }
    ],
    textSpace: 5,
    fontName: "Helvetica",
    fontSize: "15px",
    fontColor: "#000"
  },
  colors: {
    innerCircle: "#fff",
    outerCircle: "#e5e5e5"
  },
  outerRadius: 90,
  labelDistance: 10 // Label distance from outerRadius.
};

var dataModelBase = {
  label: {
    text: "", // Bar label
    fontFamily: "Helvetica",
    fontSize: "15px",
    fontColor: "#000"
  },
  bar: {
    value: 0, // Bar value
    color: "#ff3b30", // Bar color
    width: 15
  }
};

var currentDataModel;
for (var i = 0; i < 8; i++) {
  currentDataModel = _.cloneDeep(dataModelBase);
  currentDataModel.label.text = "Week " + i;
  currentDataModel.bar.value = Math.abs(10 + (Math.floor(Math.random() * 101) - 50));
  config.data.push(currentDataModel);
}

var rotationDegree = getRotationDegree(config.data);

var drawConfig = {
  svgCenter: {
    x: config.width /2,
    y: config.height /2
  },

}

var svg = d3.select("body")
            .append("svg")
            .attr("id", "radial0")
            .attr("width", config.width)
            .attr("height", config.height);

// OuterCircle
svg.append("circle")
  .attr("cx", config.width / 2).attr("cy", config.height / 2)
  .attr("r", config.outerRadius)
  //.style("fill", "none")
  .attr('fill', function(d, i) {
      return config.colors.outerCircle;
  });
  // .style("stroke", "black")
  // .style("stroke-width",".5px");

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

    var currentRotationDegree = rotationDegree * i;
    var xCorrection = (d.bar.width / 2) *  Math.sin(currentRotationDegree * Math.PI / 180);
    var yCorrection = (d.bar.width / 2) *  Math.cos(currentRotationDegree * Math.PI / 180);

    var xTranslate = (config.width / 2) - xCorrection;
    var yTranslate = (config.height / 2) + yCorrection;

    return "translate(" + xTranslate + "," + yTranslate + ") rotate(" + currentRotationDegree + ")";

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
  .attr("r", config.center.innerRadius)
  .attr('fill', function(d, i) {
      return config.colors.innerCircle;
  });

svg.append("text")
  .attr("id", "central-text")
  .attr("text-anchor", "middle")
  .selectAll('tspan')
  .data(config.center.text)
  .enter()
  .append('tspan')
  .text(function(d, i) {
    return d.text;
  })
  .attr("dx", 0)
  .attr("fill", function(d) { return d.color; })
  .attr("font-size", function(d) { return d.fontSize + "px"; })
  .attr("font-family", function(d) { return d.font; })
  .attr('x', function(d, i) {
    // var graphCenterX = config.width / 2;
    // var halfTextWidth = this.offsetWidth / 2;
    // return graphCenterX - halfTextWidth;
    return config.width / 2;
  })
  .attr("dy", function(d, i) {
    return 0 === i ? this.offsetHeight : ((this.offsetHeight * 2) + config.center.textSpace);
  });

  svg.select("text#central-text")
  .attr('y', function(d, i) {
    var graphCenterY = config.height / 2;
    var halfTextHeight = (this.offsetHeight / 2) + config.center.textSpace;
    return graphCenterY - halfTextHeight;
  });

function getRotationDegree(data) {
  return 360 / data.length;
}

// Math.sin(angleDegree * Math.PI / 180)
// Math.cos(angleDegree * (180/Math.PI))


// Today circle degrees.
//     90
// 0       180
//    270
// It Must be.
//       0
// 270       90
//      180
