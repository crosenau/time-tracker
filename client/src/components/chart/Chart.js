import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getTasks,
  updatechartSettings,
  togglechartSettings
} from '../../actions/chartActions';

import ChartSettings from './ChartSettings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Chart.css';

const Chart = props => {
  return (
    <div id='chart'>
      {props.chart.displaySettings ? <ChartSettings /> : null}
      <div id='header'>
        <h2>Progresss</h2>
        <button className='icon-btn' id='settings-btn' onClick={props.togglechartSettings}>
          <FontAwesomeIcon icon='ellipsis-v' />
        </button>
      </div>

      <h4>{props.chart.startDate.toLocaleDateString()} - {props.chart.endDate.toLocaleDateString()}</h4>
    </div>
  );
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
    updatechartSettings,
    togglechartSettings
  }
)(Chart);