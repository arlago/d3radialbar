var config = {
  data: [],
  width: 250,
  height: 250,
  center: {
    innerRadius: 30,
    backgroundColor: "#000",
    text: ["line 1", "line 2"],
    fontName: "Helvetica",
    fontSize: "15px",
    fontColor: "#000"
  },
  outerRadius: 90,
  labelDistance: 15 // Label distance from outerRadius.
};

var dataModelBase = {
  label: {
    text: "", // Bar label
    fontFamily: "Helvetica",
    fontSize: "8px",
    fontColor: "#000"
  },
  bar: {
    value: 0, // Bar value
    color: "#000", // Bar color
    width: 5
  }
};

var currentDataModel;
for (var i = 0; i < 28; i++) {
  currentDataModel = _.cloneDeep(dataModelBase);
  // currentDataModel.label.text = i + ' pm';
  // currentDataModel.label.text = 'asdf';
  currentDataModel.label.text = i;
  // currentDataModel.bar.value = Math.abs(10 + (Math.floor(Math.random() * 101) - 50));
  currentDataModel.bar.value = 60;
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
  .attr('text-anchor', 'middle')
  .attr('degree', function(d, i) {
    return rotationDegree * i;
  })
  .attr('id', function(d, i) {
    return 'label' + i;
  })
  .attr("font-family", function(d, i) { return d.label.fontFamily; } )
  .attr("font-size", function(d, i) { return d.label.fontSize; } )
  .attr("fill", function(d, i) { return d.label.fontColor; } )
  .text(function (d, i) { return d.label.text; })
  .attr("x", function(d, i) {
    var currentRotationDegree = rotationDegree * i;
    var xCorrection = 0;
    return labelHorizontal(d, i).x;

    // if(90 === currentRotationDegree || 270 == currentRotationDegree) {
    //   xCorrection = this.offsetWidth / 2;
    // } else if (90 > currentRotationDegree || 270 < currentRotationDegree) {
    //   xCorrection = this.offsetWidth;
    // }

    if((45 < currentRotationDegree && 135 > currentRotationDegree) ||
        (225 < currentRotationDegree && 315 > currentRotationDegree)) {
      xCorrection = this.offsetHeight * Math.abs(Math.cos(currentRotationDegree * Math.PI / 180));
    }

    return labelHorizontal(d, i).x + xCorrection;
    // return labelHorizontal(d, i).x - xCorrection;
  })
  .attr("y", function(d, i) {
    var currentRotationDegree = rotationDegree * i;
    var labelRadius = config.outerRadius + config.labelDistance;
    var yCorrection = 0;
    return labelHorizontal(d, i).y + this.offsetHeight / 4;
    // return labelHorizontal(d, i).y + (this.offsetHeight);

    // if(0 === currentRotationDegree || 180 === currentRotationDegree) {
    //   yCorrection = this.offsetHeight / 4;
    // } else if (180 < currentRotationDegree) {
    //   // yCorrection = this.offsetHeight / 2;
    //   yCorrection = this.offsetHeight * Math.abs(Math.sin(currentRotationDegree * Math.PI / 180));
    // }

    if(0 === currentRotationDegree || 180 === currentRotationDegree) {
      // Faz com que os labels fiquem mais centralizados, deve ser somado ao valor de y.
      return labelHorizontal(d, i).y + (this.offsetHeight / 4);
    }

    if((45 < currentRotationDegree && 135 > currentRotationDegree) ||
        (225 < currentRotationDegree && 315 > currentRotationDegree)) {
      yCorrection = (this.offsetHeight) * Math.abs(Math.sin(currentRotationDegree * Math.PI / 180));
    }


    // if(45 < currentRotationDegree && 135 > currentRotationDegree) {
    //   return labelHorizontal(d, i).y - yCorrection;
    // }

    if (225 < currentRotationDegree && 315 > currentRotationDegree) {
      var y = labelHorizontal(d, i).y;
      if(313.5483870967742 === currentRotationDegree) {
        console.log("Y: " + y);
        console.log("YCorrection: " + yCorrection);
      }
      return y + yCorrection;
    }

    if (180 < currentRotationDegree) {
      return labelHorizontal(d, i).y + (this.offsetHeight * Math.abs(Math.sin(currentRotationDegree * Math.PI / 180)));
    }

    return labelHorizontal(d, i).y;
  });
  // .attr("transform", function(d, i) {
  //   return "translate(" + ( (config.width / 2) - (d.bar.width / 2) ) + "," + (config.height / 2) + ") rotate(" + (rotationDegree * i) + ")";
  // })


function labelHorizontal(d, i) {
  var retorno = {};
  var labelRadius = config.outerRadius + config.labelDistance;
  var currentRotationDegree = rotationDegree * i;
  switch (true) {
    case 0 <= currentRotationDegree && currentRotationDegree <= 90:
        retorno.x = drawConfig.svgCenter.x - (labelRadius * Math.cos(currentRotationDegree * Math.PI / 180));
        retorno.y = drawConfig.svgCenter.y - (labelRadius * Math.sin(currentRotationDegree * Math.PI / 180));
      break;

    case 90 < currentRotationDegree && currentRotationDegree <= 180:
        retorno.x = drawConfig.svgCenter.x + Math.abs((labelRadius * Math.cos(currentRotationDegree * Math.PI / 180)));
        retorno.y = drawConfig.svgCenter.y - Math.abs((labelRadius * Math.sin(currentRotationDegree * Math.PI / 180)));
      break;

    case 180 < currentRotationDegree && currentRotationDegree <= 270:
        retorno.x = drawConfig.svgCenter.x + Math.abs((labelRadius * Math.cos(currentRotationDegree * Math.PI / 180)));
        retorno.y = drawConfig.svgCenter.y + Math.abs((labelRadius * Math.sin(currentRotationDegree * Math.PI / 180)));
      break;

    case 270 < currentRotationDegree:
        retorno.x = drawConfig.svgCenter.x - Math.abs((labelRadius * Math.cos(currentRotationDegree * Math.PI / 180)));
        retorno.y = drawConfig.svgCenter.y + Math.abs((labelRadius * Math.sin(currentRotationDegree * Math.PI / 180)));
      break;
  }

  return retorno;
}

function getDegreeReducedToFirstQuadrant(angle) {
  var reducedAngle;
  switch (true) {
    case 0 <= angle && angle <= 90:
      reducedAngle = angle;
      break;
    case 90 < angle && angle <= 180:
      reducedAngle = 90 - angle;
      break;
    case 180 < angle && angle <= 270:
      reducedAngle = 180 - angle;
      break;
    case 270 < angle:
      reducedAngle = 270 - angle;
      break;
  }
  return reducedAngle;
}

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


// Today circle degrees.
//     90
// 0       180
//    270
// It Must be.
//       0
// 270       90
//      180
