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
  
  componentDidUpdate() {
    if (!this.props.chart.displaySettings) {
      this.createChart();
      console.log(this.props.chart.tasks);
    }
  }

  createChart() {
    const node = this.node.current;
    const width = Number(getComputedStyle(node).width.replace('px', ''));
    const height = Number(getComputedStyle(node).height.replace('px', ''));

    const dataset = this.props.chart.tasks;

    const xScale = d3.scaleLinear()
      .domain([0, dataset.length])
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d.taskLength)])
      .range([height, 0]);

    // Delete any existing svgs
    d3.select(node).selectAll('svg').remove();

    const chart = d3.select(node)
      .append('svg')
      .attr('id', 'chartSvg')
      .attr('width', width)
      .attr('height', height);
    
    //bars
    const barWidth = width / dataset.length;

    chart.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('dataTaskName', d => d.taskName)
      .attr('dataTaskLength', d => d.taskLength)
      .attr('dataCompletedAt', d => d.completedAt)
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d.taskLength))
      .attr('width', barWidth)
      .attr('height', d => height - yScale(d.taskLength))
      .attr('fill', '#000000');
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

        <h4>{this.props.chart.startDate.toLocaleDateString()} - {this.props.chart.endDate.toLocaleDateString()}</h4>
        <div id={styles.svgContainer} ref={this.node} />
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