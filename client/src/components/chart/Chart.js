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

    // element ref for D3
    this.node = React.createRef();
  }

  componentDidMount() {
    const { startDate, endDate, tasks } = this.props.chart;

    if (tasks.length === 0) {
      this.props.getTasks({
        startDate,
        endDate
      });
    }
    else {
      this.createChart();
    }
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

    const taskLabels = Array.from(
      new Set(
        filteredTasks
          .map(task => task.taskName)
      )
    );

    // consolidate task objects into individual day objects with total times for each task performed that day
    const dataset = [];
    
    let day = { date: new Date(this.props.chart.startDate.toDateString()) };
    taskLabels.forEach(label => day[label] = 0);

    filteredTasks.forEach((task, i) => {
      while (day.date.toDateString() !== task.completedAt.toDateString()) {
        const nextDay = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate() + 1);

        dataset.push(day);
        day = { date: nextDay };

        for (let label of taskLabels) {
          day[label] = 0;
        }
      }

      day[task.taskName] += task.taskLength;

      if (i === filteredTasks.length -1) {
        dataset.push(day);
      }
    });

    // Create data series for stacked bars
    const stack = d3.stack()
      .keys(taskLabels)
      .order(d3.stackOrderNone);

    const series = stack(dataset);

    // Set svg dimensions and margins
    const node = this.node.current;
    const width = Number(getComputedStyle(node).width.replace('px', '')) - 4;
    const height = Number(getComputedStyle(node).height.replace('px', '')) - 4;
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const maxLabelLength = Math.max(...taskLabels
      .map(label => label.length)
    );

    const margin = {
      top: rem,
      right: rem * (0.5 * maxLabelLength + 6),
      bottom: 2 * rem,
      left: 2 * rem
    };

    // Create scales
    const xScale = d3.scaleBand()
      .domain(dataset.map(d => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleLinear()
      .domain([0, taskLabels.length - 1])
      .range(['#48f', '#fb4'])
      .interpolate(d3.interpolateHcl)

    // Delete any existing svgs or divs
    d3.select(node).selectAll('svg').remove();
    d3.select(node).selectAll('div').remove();

    const tooltip = d3.select(node)
      .append('div')
      .attr('id', 'tooltip')
      .style('color', 'white')
      .style('background-color', 'black')
      .style('box-shadow', '2px 2px 4px #223')
      .style('opacity', 0)
      .style('padding', '1rem')
      .style('position', 'fixed')
      .style('top', 0)
      .style('left', 0)
      .style('pointer-events', 'none')
      .style('display', 'flex')
      .style('flex-direction', 'column');

    // Create svg and append barchart elements
    const chart = d3.select(node)
      .append('svg')
      .attr('id', 'svg')
      .attr('width', width)
      .attr('height', height);

    const barGroups = chart.selectAll('g')
      .data(series)
      .enter()
      .append('g')
        .attr('fill', d => colorScale(taskLabels.indexOf(d.key)))
        .attr('id', d => d.key)
        .on('mousemove', d => {
          const x = `${d3.event.clientX + 16}px`;
          const y = `${d3.event.clientY + 8}px`;

          tooltip
            .style('left', x)
            .style('top', y)
            .style('opacity', 1)
            .selectAll('div #taskName')
            .data([d.key])
            .enter()
            .append('div')
              .attr('id', 'taskName')
              .style('order', -1)
              .style('font-weight', 'bold')
              .text(d => d);
        })
        .on('mouseout', d => {
          d3.select('#tooltip')
            .style('opacity', 0)
            .selectAll('div').remove();
        });
    
    barGroups.selectAll('rect')
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
            `${hours}h ${minutes}min`,
            d.data.date.toDateString()
          ];

          d3.select('#tooltip')
            .selectAll('div.data')
            .data(data)
            .enter()
            .append('div')
              .attr('class', 'data')
              .text(d => d)
        })
      
    // Render Date range
    chart.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', width - margin.right)
      .attr('y2', height - margin.bottom)
      .attr('stroke-width', '0.5px');

    chart.append('text')
      .attr('x', margin.left)
      .attr('y', height - margin.bottom + rem)
      .text(dataset[0].date.toDateString())

    chart.append('text')
      .attr('x', width - margin.right)
      .attr('y', height - margin.bottom + rem)
      .attr('text-anchor', 'end')
      .text(dataset[dataset.length-1].date.toDateString())

    // Create Y-axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(d3.max(series, d => d3.max(d, d => d[1])) / 60 / 60)
      .tickFormat(val => `${Math.floor(val / 60 / 60)}h`)
      .tickSize(0);
      
    chart.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr('stroke-width', '0.5px')
      .call(yAxis);

    // Create Legend
    const taskTotals = {};

    taskLabels.forEach(task => taskTotals[task] = 0);

    dataset.forEach(day => {
      Object.entries(day).forEach(entry => {
        if (entry[0] !== 'date') {
          taskTotals[entry[0]] += entry[1]
        }
      });
    });

    const legendGroups = chart.selectAll('g.legend')
      .data(Object.entries(taskTotals).reverse())
      .enter()
      .append('g')
        .attr('class', 'legend')
        .on('mousemove', d => {
          const x = `${d3.event.clientX + 16}px`;
          const y = `${d3.event.clientY + 8}px`;

          const label = d[0];
          const secs = d[1]
          const avgSecs = d[1] / dataset.length;

          const info = [
            label,
            `Daily avg: ${Math.floor(avgSecs / 60 / 60)}h ${Math.floor(secs / 60) % 60}min`,
            `Total: ${Math.floor(secs / 60 / 60)}h ${Math.floor(secs / 60) % 60}min`,
          ];

          tooltip
            .style('left', x)
            .style('top', y)
            .style('opacity', 1)
            .selectAll('div')
            .data(info)
            .enter()
            .append('div')
              .style('font-weight', (d, i) => i === 0 ? 'bold' : 'normal')
              .text(d => d);
        })
        .on('mouseout', d => {
          d3.select('#tooltip')
            .style('opacity', 0)
            .selectAll('div').remove();
        });

    legendGroups.append('rect')
      .attr('x', 2 * rem + width - margin.right)
      .attr('y', (d, i) => margin.top + i * (2.25 * rem))
      .attr('width', 2 * rem)
      .attr('height', 2 * rem)
      .attr('fill', d => colorScale(taskLabels.indexOf(d[0])));

    legendGroups.append('text')
      .attr('x', 4.5 * rem + width - margin.right)
      .attr('y', (d, i) => margin.top +  i * 2.25 * rem + (1.5 * rem))
      .text(d => d[0]);
  }

  render() {
    return (
      <div id={styles.container}>
        {this.props.chart.displaySettings ? <ChartSettings /> : null}
        <div id={styles.header}>
          <h2>Stats</h2>
          <button className='icon-btn' id={styles.settingsButton} onClick={this.props.toggleChartSettings}>
            <FontAwesomeIcon icon='ellipsis-v' />
          </button>
        </div>
        {
          this.props.chart.loading ? 
            <div id={styles.loading}>Loading...</div> :
            <div id={styles.d3Container} ref={this.node} />
        }
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