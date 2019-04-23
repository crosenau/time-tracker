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

    if (!chart.displaySettings) {
      if (prevChart.loading && !chart.loading) {
        this.createChart();
      } else if (
        !prevChart.loading 
        && !chart.loading 
        && prevChart.filter.join(' ') !== chart.filter.join(' ')
      ) {
        this.createChart();
      }
    }
  }

  createChart() {
    const filteredTasks = this.props.chart.tasks
      .filter(task => !this.props.chart.filter.includes(task.taskName));

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

        for (let name of uniqueTasks) {
          day[name] = 0;
        }
      }

      day[task.taskName] += task.taskLength;

      if (i === filteredTasks.length -1) {
        dataset.push(day);
      }
    });

    const stack = d3.stack()
      .keys(uniqueTasks)
      .order(d3.stackOrderNone);

    const series = stack(dataset);

    console.log(dataset);
    console.log(series);

    const node = this.node.current;
    const width = Number(getComputedStyle(node).width.replace('px', '')) - 4;
    const height = Number(getComputedStyle(node).height.replace('px', '')) - 4;
    const margin = { top: height * 0.1, right: width * 0.25, bottom: height * 0.1, left: 0 };

    const xScale = d3.scaleBand()
      .domain(dataset.map(d => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleLinear()
      .domain([0, (uniqueTasks.length - 1) / 2, uniqueTasks.length - 1])
      .range(['#422c42', '#456acc', '#25dbcc'])
      .interpolate(d3.interpolateHcl)

    // Delete any existing svgs or divs
    d3.select(node).selectAll('svg').remove();
    d3.select(node).selectAll('div').remove();

    const tooltip = d3.select(node)
      .append('div')
      .attr('id', 'tooltip')
      .style('background-color', '#BBB')
      .style('opacity', 0)
      .style('padding', '1rem')
      .style('position', 'fixed')
      .style('top', 0)
      .style('left', 0)
      .style('pointer-events', 'none')
      .style('display', 'flex')
      .style('flex-direction', 'column');

    const chart = d3.select(node)
      .append('svg')
      .attr('id', 'svg')
      .attr('width', width)
      .attr('height', height);
    
    const groups = chart.selectAll('g')
      .data(series)
      .enter()
      .append('g')
        .attr('fill', d => colorScale(uniqueTasks.indexOf(d.key)))
        .attr('id', d => d.key)
        .on('mousemove', d => {
          const x = `${d3.event.clientX + 16}px`;
          const y = `${d3.event.clientY + 8}px`;

          tooltip
            .style('left', x)
            .style('top', y)
            .style('opacity', 0.8)
            .selectAll('div #taskName')
            .data([d.key])
            .enter()
            .append('div')
              .attr('id', 'taskName')
              .style('order', -1)
              .text(d => d);
        })
        .on('mouseout', d => {
          d3.select('#tooltip')
            .style('opacity', 0)
            .selectAll('div').remove();
        });
    
    groups.selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.data.date))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(d[0]) - yScale(d[1]))
        
        .on('mouseover', (d) => {
          const totalSecs = d[1] - d[0];
          const hours = Math.floor(totalSecs / 60 / 60);
          const minutes = Math.floor(totalSecs / 60) % 60;

          const data = [
            d.data.date.toDateString(),
            `${hours}h ${minutes}min`,
          ];

          d3.select('#tooltip')
            .selectAll('div.data')
            .data(data)
            .enter()
            .append('div')
              .attr('class', 'data')
              .text(d => d)
        })
      
    // Date range
    chart.append('text')
      .attr('x', margin.left)
      .attr('y', height + 20 - margin.bottom)
      .text(dataset[0].date.toDateString())

    chart.append('text')
      .attr('x', width - margin.right)
      .attr('y', height + 20 - margin.bottom)
      .attr('text-anchor', 'end')
      .text(dataset[dataset.length-1].date.toDateString())

    // Legend
    const taskTotals = {};

    uniqueTasks.forEach(task => taskTotals[task] = 0);

    dataset.forEach(day => {
      Object.entries(day).forEach(entry => {
        if (entry[0] !== 'date') {
          taskTotals[entry[0]] += entry[1]
        }
      });
    });

    console.log(taskTotals);

    const legendGroups = chart.selectAll('g.legend')
      .data(Object.entries(taskTotals))
      .enter()
      .append('g')
        .attr('class', 'legend')
        .on('mousemove', d => {
          const x = `${d3.event.clientX + 16}px`;
          const y = `${d3.event.clientY + 8}px`;

          const info = [
            d[0]
          ];

          tooltip
            .style('left', x)
            .style('top', y)
            .style('opacity', 0.8)
            .selectAll('div')
            .data(info)
            .enter()
            .append('div')
              .text(d => d);
        })
        .on('mouseout', d => {
          d3.select('#tooltip')
            .style('opacity', 0)
            .selectAll('div').remove();
        });

    
    d3.selectAll('.legend')
      .append('rect')
        .attr('x', width - margin.right)
        .attr('y', (d, i) => i * (margin.top * 0.5))
        .attr('width', 24)
        .attr('height', 24)
        .attr('fill', d => colorScale(uniqueTasks.indexOf(d[0])));

    d3.selectAll('.legend')
      .append('text')
      .attr('x', width - margin.right + 28)
      .attr('y', (d, i) => i * (margin.top * 0.5) + 20)
      .text(d => d[0]);

    
    
    console.log(legendGroups);
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

        <div id={styles.d3Container} ref={this.node} />
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