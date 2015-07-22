var config = {
  data: [],
  width: 320,
  height: 320,
  center: {
    innerRadius: 40,
    backgroundColor: "#000",
    text: [
      {
        "text": "32",
        "color": "#999",
        "fontSize": 24,
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
    textSpace: 1,
    fontName: "Helvetica",
    fontSize: "15px",
    fontColor: "#000"
  },
  colors: {
    innerCircle: "#fff",
    outerCircle: "#e5e5e5"
  },
  outerRadius: 110,
  labelDistance: 15, // Label distance from outerRadius.
  labelType: "horizontal" // horizontal | circular
};

var dataModelBase = {
  label: {
    text: "", // Bar label
    fontFamily: "Helvetica",
    fontSize: "9px",
    fontColor: "#000"
  },
  bar: {
    value: 0, // Bar value
    color: "#ff3b30", // Bar color
    width: 5
  }
};

var currentDataModel;
for (var i = 0; i < 30; i++) {
  currentDataModel = _.cloneDeep(dataModelBase);
  // currentDataModel.label.text = i + ' pm';
  // currentDataModel.label.text = 'asdf';
  currentDataModel.label.text = i + 1;
  // currentDataModel.bar.value = Math.abs(10 + (Math.floor(Math.random() * 101) - 50));
  currentDataModel.bar.value = 70;
  config.data.push(currentDataModel);
}

function RadialBar(elementId, config) {

  this.elementId = elementId;
  this.svgCenter = {
    x: config.width /2,
    y: config.height /2
  };
  this.config = config;
  this.degrees = new MathDegree(config.data.length);

}

RadialBar.prototype.draw = function() {
  this.createSvg();
  this.createOuterCircle();
  this.createBars();
  switch (this.config.labelType) {
    case "circular":
      this.createCircularLabels();
    break;
    case "horizontal":
      this.createHorizontalLabels();
    break;
  }
  this.createInnerCircle();
  this.createCentralText();
};

RadialBar.prototype.createSvg = function() {
  this.svg = d3.select("#" + this.elementId)
              .append("svg")
              .attr("id", "radial0")
              .attr("width", this.config.width)
              .attr("height", this.config.height);
};

RadialBar.prototype.createOuterCircle = function() {
  var self = this;
  this.svg.append("circle")
    .attr("cx", this.svgCenter.x)
    .attr("cy", this.svgCenter.y)
    .attr("r", this.config.outerRadius)
    .attr('fill', function(d, i) {
        return self.config.colors.outerCircle;
    });
};

RadialBar.prototype.createBars = function() {
  var self = this;
  this.svg.selectAll('rect')
    .data(this.config.data)
    .enter()
    .append("rect")
    .attr("id", function(d, i) { return "bar" + i; })
    .attr("fill", function(d, i) { return d.bar.color; })
    .attr("width", function(d, i) { return d.bar.value; })
    .attr("height", function(d, i) { return d.bar.width; })
    // Minus 10 to hide the round end of the bar and for the calculus be easier.
    .attr("x", function(d, i) { return (d.bar.value + self.config.center.innerRadius - 10) * -1; })
    .attr("y", function(d, i) { return d.bar.width * -1; })
    // 10 is an arbitrary number.
    .attr("rx", function(d, i) { return 10 >= d.bar.width ? d.bar.width * 0.4 : d.bar.width * 0.3; })
    .attr("ry", function(d, i) { return 10 >= d.bar.width ? d.bar.width * 0.4 : d.bar.width * 0.2; })
    .attr("transform", function(d, i) {

      // var currentRotationDegree = (rotationDegree * i) + 90;
      var currentRotationDegree = self.degrees.getCurrentRotationDegree(i);
      var xCorrection = (d.bar.width / 2) *  self.degrees.sin(currentRotationDegree);
      // var xCorrection = (d.bar.width / 2) *  Math.sin(currentRotationDegree * Math.PI / 180);
      var yCorrection = (d.bar.width / 2) *  self.degrees.cos(currentRotationDegree);
      // var yCorrection = (d.bar.width / 2) *  Math.cos(currentRotationDegree * Math.PI / 180);

      var xTranslate = self.svgCenter.x - xCorrection;
      var yTranslate = self.svgCenter.y + yCorrection;

      return "translate(" + xTranslate + "," + yTranslate + ") rotate(" + currentRotationDegree + ")";

    });
};

RadialBar.prototype.createCircularLabels = function() {
  var self = this;
  var labels = this.svg.append("g")
    .classed("labels", true);

  labels.append("def")
    .append("path")
    .attr("id", "label-path")
    .attr("d", function(d, i) {
      var labelRadius = self.config.outerRadius + self.config.labelDistance;
      var distanceFromTop = self.svgCenter.y - labelRadius;
      var distanceFromLeft = self.svgCenter.x;
      return "m" + distanceFromLeft + " " + distanceFromTop + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0";
    });

  labels.selectAll("text")
    .data(this.config.data)
    .enter()
    .append("text")
    .attr('degree', function(d, i) {
      return self.degrees.getCurrentRotationDegree(i);
    })
    .attr('id', function(d, i) {
      return 'label' + i;
    })
    .attr("font-family", function(d, i) { return d.label.fontFamily; } )
    .attr("font-size", function(d, i) { return d.label.fontSize; } )
    .attr("fill", function(d, i) { return d.label.fontColor; } )
    .style("text-anchor", "middle")
    .append("textPath")
    .attr("xlink:href", "#label-path")
    .attr("startOffset", function(d, i) {
      return i * 100 / self.config.data.length + '%';
    })
    .text(function(d, i) { return d.label.text; });

};

RadialBar.prototype.createHorizontalLabels = function() {
  var self = this;
  var labelRadius = this.config.outerRadius + this.config.labelDistance;
  this.svg.selectAll('text')
    .data(this.config.data)
    .enter()
    .append("text")
    .attr('text-anchor', 'middle')
    .attr('degree', function(d, i) {
      return self.degrees.getCurrentRotationDegree(i);
    })
    .attr('id', function(d, i) {
      return 'label' + i;
    })
    .attr("font-family", function(d, i) { return d.label.fontFamily; } )
    .attr("font-size", function(d, i) { return d.label.fontSize; } )
    .attr("fill", function(d, i) { return d.label.fontColor; } )
    .text(function (d, i) { return d.label.text; })
    .attr("x", function(d, i) {
      return calculateLabelX(i);
    })
    .attr("y", function(d, i) {
      return calculateLabelY(i) + this.offsetHeight / 4;
    });

  function calculateLabelX(i) {
    var retorno = 0;
    var currentRotationDegree = self.degrees.getCurrentRotationDegree(i);
    switch (true) {
      case (0 <= currentRotationDegree && currentRotationDegree <= 90) || 360 < currentRotationDegree:
          retorno = self.svgCenter.x - (labelRadius * self.degrees.cos(currentRotationDegree));
        break;

      case 90 < currentRotationDegree && currentRotationDegree <= 180:
          retorno = self.svgCenter.x + (labelRadius * self.degrees.cosAbs(currentRotationDegree));
        break;

      case 180 < currentRotationDegree && currentRotationDegree <= 270:
          retorno = self.svgCenter.x + (labelRadius * self.degrees.cosAbs(currentRotationDegree ));
        break;

      case 270 < currentRotationDegree:
          retorno = self.svgCenter.x - (labelRadius * self.degrees.cosAbs(currentRotationDegree));
        break;
    }
    return retorno;
  }

  function calculateLabelY(i) {
    var retorno = 0;
    var currentRotationDegree = self.degrees.getCurrentRotationDegree(i);
    switch (true) {
      case (0 <= currentRotationDegree && currentRotationDegree <= 90) || 360 < currentRotationDegree:
          retorno = self.svgCenter.y - (labelRadius * self.degrees.sin(currentRotationDegree));
        break;

      case 90 < currentRotationDegree && currentRotationDegree <= 180:
          retorno = self.svgCenter.y - (labelRadius * self.degrees.sinAbs(currentRotationDegree));
        break;

      case 180 < currentRotationDegree && currentRotationDegree <= 270:
          retorno = self.svgCenter.y + (labelRadius * self.degrees.sinAbs(currentRotationDegree));
        break;

      case 270 < currentRotationDegree:
          retorno = self.svgCenter.y + (labelRadius * self.degrees.sinAbs(currentRotationDegree));
        break;
    }
    return retorno;
  }

};

RadialBar.prototype.createInnerCircle = function() {
  var self = this;
  this.svg.append("circle")
    .attr("cx", self.svgCenter.x)
    .attr("cy", self.svgCenter.y)
    .attr("r", self.config.center.innerRadius)
    .attr('fill', function(d, i) {
        return self.config.colors.innerCircle;
    });
};

RadialBar.prototype.createCentralText = function() {
  var self = this;
  this.svg.append("text")
    .attr("id", "central-text")
    .attr("text-anchor", "middle")
    .selectAll('tspan')
    .data(this.config.center.text)
    .enter()
    .append('tspan')
    .text(function(d, i) {
      return d.text;
    })
    .attr("dx", 0)
    .attr("fill", function(d) { return d.color; })
    .attr("font-size", function(d) { return d.fontSize + "px"; })
    .attr("font-family", function(d) { return d.fontFamily; })
    .attr("font-weight", function(d) { return d.fontWeight; })
    .attr('x', function(d, i) {
      return self.svgCenter.x;
    })
    .attr("dy", function(d, i) {
      return this.offsetHeight;
    });

    this.svg.select("text#central-text")
    .attr('y', function(d, i) {
      var halfTextHeight = (this.offsetHeight / 2) + config.center.textSpace;
      return self.svgCenter.y - halfTextHeight;
    });
};

function MathDegree(dataLength) {
  this.rotationDegree = this.getRotationDegree(dataLength);
}

MathDegree.prototype.getRotationDegree = function(dataLength) {
  return 360 / dataLength;
};

MathDegree.prototype.getCurrentRotationDegree = function(currentIndex) {
  return (this.rotationDegree * currentIndex) + 90;
};

MathDegree.prototype.cos = function(angle) {
  return Math.cos(angle * Math.PI / 180);
};

MathDegree.prototype.sin = function(angle) {
  return Math.sin(angle * Math.PI / 180);
};

MathDegree.prototype.cosAbs = function(angle) {
  return Math.abs(this.cos(angle));
};

MathDegree.prototype.sinAbs = function(angle) {
  return Math.abs(this.sin(angle));
};

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
