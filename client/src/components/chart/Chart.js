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
      //this.createChart();
    }
  }

  createChart() {
    const node = this.node.current;
    const width = Number(getComputedStyle(node).width.replace('px', ''));
    const height = Number(getComputedStyle(node).height.replace('px', ''));
    const padding = 4;

    // consolidate tasks into individual days with total times for each task performed that day
    const dataset = this.props.chart.tasks
      .filter(task => task.taskName !== this.props.chart.filter)
      .map(task => {
        const msInDay = 1000 * 60 * 60 * 24;

        return {
          taskName: task.taskName,
          date: task.completedAt.getTime() / msInDay,
        };
      })

    /*
    dataset = 
      [
        {
          date,
          TaskName: totalTime
          TaskName2: totalTime
          ...
        }
      ]
     */

    const uniqueTasks = Array.from(
      new Set(
        dataset
          .map(task => task.taskName)
      )
    );

    const colorScale = d3.scaleLinear()
      .domain([0, (uniqueTasks.length - 1) / 2, uniqueTasks.length - 1])
      .range(['#422c42', '#456accfe', '#25dbccff']);

    const xScale = d3.scaleLinear()
      .domain([
        d3.min(dataset, d => d.completedAt.getTime()),
        d3.max(dataset, d => d.completedAt.getTime())
      ])
      .range([padding, width - padding]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d.taskLength)])
      .range([height - padding, padding]);

    // Delete any existing svgs
    d3.select(node).selectAll('svg').remove();

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

    chart.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('dataTaskName', d => d.taskName)
      .attr('dataTaskLength', d => d.taskLength)
      .attr('dataCompletedAt', d => d.completedAt)
      .attr('x', (d, i) => xScale(d.completedAt.getTime()))
      .attr('y', d => yScale(d.taskLength))
      .attr('width', barWidth)
      .attr('height', d => height - yScale(d.taskLength))
      .attr('fill', d => colorScale(uniqueTasks.indexOf(d.taskName)))
      /*
      .on('mousemove', d => {
        const x = `${d3.event.clientX + 16}px`;
        const y = `${d3.event.clientY + 8}px`;
        const data = [
          d.completedAt.toDateString(),
          d.completedTasks
        ];
      })
      */
  }

  render() {
    return (
      <div id={styles.container}>
        {this.props.chart.displaySettings ? <ChartSettings /> : null}
        <div id={styles.header}>
          <h2>Progresss</h2>
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