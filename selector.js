const selector = document.getElementById("cat-select")

selector.addEventListener("change", changeCategory)

function changeCategory(e) {
  d3.select("#inner-content")
    .remove()

  const selectedCategory = e.target.value

  drawStripChart(selectedCategory)
}