
// global variable
let data

// loading data
d3.json("./sm_cat_diff_0620.json")
  .then(function(d) {
    data = d
    drawStripChart("治療淺股動脈狹窄之塗藥裝置")
  })


// function zone 
function drawStripChart(category) {
  // access data
  const selectedData = data.filter(d => d["自付差額品項類別"] === category)
  const xAccessor = d => d.diff
  const yAccessor = d => d["自付差額品項類別"]

  // create dimensions
  const width = window.innerWidth
  const height = 0.5 * width

  let dimensions = {
      width: width,
      height: height,
      margin: {
        top: 10,
        right: 0.05 * width,
        bottom: 10,
        left: 0.05 * width,
      },
    }

  dimensions.boundWidth = dimensions.width 
      - dimensions.margin.left
      - dimensions.margin.right

  dimensions.boundHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  const wrapper = d3.select('#wrapper')
    .append("svg")
      .attr("id", "inner-content")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${
            dimensions.margin.left
          }px, ${
            dimensions.margin.top
          }px)`)

  // create scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data.map(xAccessor))).nice()
    .range([dimensions.margin.left ,dimensions.boundWidth]);

  const yScale = 0.5 * dimensions.boundHeight
  
  // create force simulation
  const simulation = d3.forceSimulation(selectedData)
    .force("x", d3.forceX(d => xScale(xAccessor(d))).strength(0.5))
    .force("y", d3.forceY(yScale).strength(0.5))
    .force("collide", d3.forceCollide().radius(isMobile ? 3 : 4.5))
    .tick(150)
    .stop();
  
  // create tooltip
  const selectInfo = d3.selectAll(".selected-info span")
    .style("opacity", 0);

  // add middle line
  bounds.append("g")
    .attr("id", "middle-line")
    .append("line")
    .attr("x1", 0)
    .attr("x2", dimensions.boundWidth)
    .attr("y1", yScale)
    .attr("y2", yScale)
    .attr("stroke", "rgba(181, 181, 181, 0.7)")

  // draw strip chart
  const circles = bounds
    .append('g')
    .selectAll("circle")
    .data(selectedData)
    .enter()
      .append("circle")
      .attr("id", d => d["品項代碼"])
      .attr("r", isMobile ? 2 : 3)
    // style each nodes
      .attr("fill", "rgba(0, 162, 215, 0.7)")
      .style("stroke", "#00A2D7")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      

  // draw peripherals

  // add x-axis
  bounds.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + dimensions.boundHeight * 0.8 + ")")
    .call(d3.axisBottom()
      .scale(xScale)
      .tickFormat(d3.format("d")))
  // style x-axis tick line
  d3.selectAll("#x-axis line")
    .attr("y2", -dimensions.boundHeight * 0.6)
    .attr("stroke", "#9B9B9B")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-dasharray", "2,2")
  // remove tick
  d3.selectAll("#x-axis path")
    .remove()
  // adjust font
  d3.selectAll("#x-axis .tick text")
    .attr("font-size", 15)
    .attr("font-family", "Noto Sans TC")
  
  

  // tooltip function
  function handleMouseOver(d){
    const selectedCircle = d3.select(this)
    selectedCircle
      .attr("fill", "rgba(247, 113, 125, 0.7)")
      .style("stroke", "#FF97A8")
      .style("stroke-width", 4)

    // show information
    selectInfo
      .style("opacity", 1);
    const infoID = selectInfo.nodes()[0]
    const infoDiff = selectInfo.nodes()[1]
    infoID.innerHTML = "品項代碼： " + d["品項代碼"]
    infoDiff.innerHTML = "價差倍數： " + d3.format(".3")(d["diff"])
  }

  function handleMouseOut(d){
    const selectedCircle = d3.select(this)
    selectedCircle
      .attr("fill", "rgba(0, 162, 215, 0.7)")
      .style("stroke", "#00A2D7")
      .style("stroke-width", 1)
  }
}


