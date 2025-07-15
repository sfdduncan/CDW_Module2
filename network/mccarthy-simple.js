// graphSketchLauren.js - ANT Graph with Zoom, Weight Scaling, Stage Distancing, and Custom Style

const graphSketchLauren = function () {
  const width = 800;
  const height = 400;

  const svg = d3.select('#d3-container-4')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', '#7f00ff');

  const container = svg.append("g");

  svg.call(d3.zoom()
    .scaleExtent([0.3, 5])
    .on("zoom", (event) => {
      container.attr("transform", event.transform);
    }));

  svg.append('defs').append('marker')
    .attr('id', 'arrowhead-2')
    .attr('viewBox', '-0 -5 10 10')
    .attr('refX', 50)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 4)
    .attr('markerHeight', 4)
    .append('path')
    .attr('d', 'M 0,-4 L 8,0 L 0,4')
    .attr('fill', '#ffffff');

  Promise.all([
    d3.csv('./ant_nodes_staged_weighted.csv'),
    d3.csv('./ant_edges_staged.csv')
  ]).then(([nodes, links]) => {
    nodes.forEach(d => {
      d.id = d.ID;
      d.name = d.Name;
      d.type = d.Type;
      d.affiliation = d.Affiliation;
      d.keywords = d.Keywords;
      d.thematic = d['Thematic Area'];
      d.weight = +d.Weight;
    });

    links.forEach(l => {
      l.source = l.Source;
      l.target = l.Target;
    });

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(d => {
          switch (d.Stage) {
            case 'core': return 160;
            case 'foundational': return 320;
            case 'operational': return 480;
            case 'interpretive': return 640;
            default: return 100;
          }
        }))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.weight + 10));

    const link = container.append('g')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('marker-end', 'url(#arrowhead-2)');

const node = container.append('g')
  .attr('stroke', '#ffffff')
  .attr('stroke-width', 1)
  .selectAll('rect')
  .data(nodes)
  .enter().append('rect')
  .attr('width', d => d.weight * 2)
  .attr('height', d => d.weight * 2)
  .attr('x', d => -d.weight)
  .attr('y', d => -d.weight)
  .attr('fill', '#7f00ff')
  .call(d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended));


    const label = container.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', 10)
      .attr('fill', '#ffffff')
      .text(d => d.name);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    node.on('mouseover', function (event, d) {
      link.style('stroke-opacity', l =>
        l.source.id === d.id || l.target.id === d.id ? 1 : 0.1
      );
      showTooltip(event, d);
    }).on('mouseout', function () {
      link.style('stroke-opacity', 0.6);
      hideTooltip();
    });

    function showTooltip(event, d) {
      tooltip.transition().duration(200).style('opacity', 1);
      tooltip.html(`
        <strong>${d.name}</strong><br/>
        Type: ${d.type}<br/>
        Affiliation: ${d.affiliation}<br/>
        Theme: ${d.thematic}<br/>
      `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    }

    function hideTooltip() {
      tooltip.transition().duration(300).style('opacity', 0);
    }

    simulation.on('tick', () => {
      link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

   node.attr('x', d => d.x - d.weight)
    .attr('y', d => d.y - d.weight);


      label.attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  });
};

graphSketchLauren();
