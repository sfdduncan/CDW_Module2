const container = d3.select("#timeline");
const width = window.innerWidth;
const height = window.innerHeight;

const svg = container
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet");

const tooltip = d3.select("#tooltip");

d3.csv("events.csv").then(data => {
  data.forEach(d => {
    d.date = new Date(d.date);
  });

  const marginX = 80;
  const innerWidth = width - marginX * 2;
  const centerY = height / 2;

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([marginX, width - marginX]);

  // Main horizontal timeline line
  svg.append("line")
    .attr("class", "timeline-line")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
    .attr("y1", centerY)
    .attr("y2", centerY);

  // Year markers along the line
  const years = d3.timeYear.every(1);
  svg.selectAll(".year-label")
    .data(x.ticks(years))
    .enter()
    .append("text")
    .attr("x", d => x(d))
    .attr("y", centerY + 30)
    .attr("fill", "white")
    .attr("font-size", 12)
    .attr("text-anchor", "middle")
    .text(d => d.getFullYear());

  // Alternating event lines (above and below)
  svg.selectAll(".event-line")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "event-line")
    .attr("x1", d => x(d.date))
    .attr("x2", d => x(d.date))
    .attr("y1", (d, i) => centerY)
    .attr("y2", (d, i) => i % 2 === 0 ? centerY - 60 : centerY + 60);

  // Pulsing event circles
  svg.selectAll(".event-circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "event-circle")
    .attr("cx", d => x(d.date))
    .attr("cy", (d, i) => i % 2 === 0 ? centerY - 60 : centerY + 60)
    .attr("r", 10)
    .on("mouseover", function (event, d) {
      d3.select(this).classed("hovered", true);

      // Get dimensions of tooltip and window
      const tooltipWidth = tooltip.node().offsetWidth;
      const pageWidth = window.innerWidth;

      // Initial position
      let left = event.pageX + 10;
      let top = event.pageY - 40;

      // Prevent right overflow
      if (left + tooltipWidth > pageWidth - 10) {
        left = pageWidth - tooltipWidth - 10;
      }

      tooltip
        .style("left", `${left}px`)
        .style("top", `${top}px`)
        .style("opacity", 1)
        .html(`<strong>${d.title}</strong><br>${d.description}`);
    })
    .on("mouseout", function () {
      d3.select(this).classed("hovered", false);
      tooltip.style("opacity", 0);
    });
});
