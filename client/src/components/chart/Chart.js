import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getTasks,
  updateChartSettings,
  toggleChartSettings
} from '../../actions/chartActions';

import ChartSettings from '../settings/ChartSettings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Chart.module.css';

class Chart extends Component {
  componentDidMount() {
    const { startDate, endDate } = this.props.chart;

    this.props.getTasks({
      startDate,
      endDate
    });
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