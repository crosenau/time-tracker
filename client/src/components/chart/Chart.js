import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getTasks,
  updateChartSettings,
  toggleChartSettings
} from '../../actions/chartActions';

import * as d3 from 'd3';

import ChartSettings from '../settings/ChartSettings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Chart.module.css';



class Chart extends Component {
  constructor(props) {
    super(props);

    this.node = React.createRef();
    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    const { startDate, endDate } = this.props.chart;

    this.props.getTasks({
      startDate,
      endDate
    });
  }
  
  componentDidUpdate(prevProps) {
    const { chart } = this.props;
    const prevChart = prevProps.chart;

    if (
      prevChart.startDate !== chart.startDate
      || prevChart.endDate !== chart.endDate
    ) {
      const { startDate, endDate } = chart;

      this.props.getTasks({
        startDate,
        endDate
      });
    }

    if (!this.props.chart.displaySettings) {
      this.createChart();
    }
  }

  createChart() {
    const node = this.node.current;
    const width = Number(getComputedStyle(node).width.replace('px', ''));
    const height = Number(getComputedStyle(node).height.replace('px', ''));
    const padding = 4;

    const filteredTasks = this.props.chart.tasks
      .filter(task => task.taskName !== this.props.chart.filter);

    const uniqueTasks = Array.from(
      new Set(
        filteredTasks
          .map(task => task.taskName)
      )
    );

    // consolidate tasks into individual days with total times for each task performed that day
    const dataset = [];
    
    let day = { date: new Date(this.props.chart.startDate.toDateString()) };
    uniqueTasks.forEach(name => day[name] = 0);

    filteredTasks.forEach((task, i) => {
      while (day.date.toDateString() !== task.completedAt.toDateString()) {
        const nextDay = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate() + 1);

        dataset.push(day);
        day = { date: nextDay };
        uniqueTasks.forEach(name => day[name] = 0);
      }

      day[task.taskName] += task.taskLength;

      if (i === filteredTasks.length -1) {
        dataset.push(day);
      }
    });

    console.log(dataset);

    const stack = d3.stack()
      .keys(uniqueTasks)
      .order(d3.stackOrderNone);

    const series = stack(dataset);

    console.log(series);

    const xScale = d3.scaleBand()
      .domain(dataset.map(d => d.date))
      .range([padding, width - padding])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .range([height - padding, padding]);

    const colorScale = d3.scaleLinear()
      .domain([0, (uniqueTasks.length - 1) / 2, uniqueTasks.length - 1])
      .range(['#422c42', '#456acc', '#25dbcc'])
      .interpolate(d3.interpolateHcl)

    // Delete any existing svgs or divs
    d3.select(node).selectAll('svg').remove();
    d3.select(node).selectAll('div').remove();

    const tooltip = d3.select(node)
      .append('div')
      .attr('id', 'tooltip');

    const chart = d3.select(node)
      .append('svg')
      .attr('id', 'chartSvg')
      .attr('width', width - padding)
      .attr('height', height - padding);
    
    //bars
    const barWidth = width / dataset.length - 2;

    const groups = chart.selectAll('g')
      .data(series)
      .enter()
      .append('g')
        .attr('fill', d => colorScale(uniqueTasks.indexOf(d.key)))
        .attr('id', 'test')
      
    const rects = groups.selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => xScale(d.data.date))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(d[0]) - yScale(d[1]))
        .on('mousemove', d => {
          const x = `${d3.event.clientX + 16}px`;
          const y = `${d3.event.clientY + 8}px`;
          const data = [
            d.data.date.toDateString(),
            d.data.key
          ];
        })
  }

  render() {
    return (
      <div id={styles.container}>
        {this.props.chart.displaySettings ? <ChartSettings /> : null}
        <div id={styles.header}>
          <h2>Progress</h2>
          <button className='icon-btn' id={styles.settingsButton} onClick={this.props.toggleChartSettings}>
            <FontAwesomeIcon icon='ellipsis-v' />
          </button>
        </div>

        <div id={styles.svgContainer} ref={this.node} />
        <div id={styles.dateRange}>
          <span>{this.props.chart.startDate.toDateString()}</span>
          <span>{this.props.chart.endDate.toDateString()}</span>
        </div>
      </div>
    );
  }
}

Chart.propTypes = {
  chart: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  chart: state.chart
});

export default connect(
  mapStateToProps,
  { 
    getTasks,
    updateChartSettings,
    toggleChartSettings
  }
)(Chart);