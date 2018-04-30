import * as d3 from 'd3'

export default function renderBrush (callback) {
  const outerWidth = 800
  const outerHeight = 30
  const svg = d3.select('body').append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight)
  const x = d3.scaleTime().range([0, outerWidth])
  const $xAxis = svg.append('g').attr('class', 'xAxis')
  const xAxis = d3.axisBottom(x)
  const context = svg.append('g')
  context.call(
    d3.brushX().on('brush', () =>
      callback(d3.event.selection.map(x.invert))
    )
  )
  return function render (data) {
    x.domain(d3.extent(data, d => d.properties.date))
    $xAxis
      .attr('class', 'axis axis--x')
      .call(xAxis)
  }
}
