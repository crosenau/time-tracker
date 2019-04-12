import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  updatechartSettings,
  togglechartSettings
} from '../../actions/chartActions';

import './ChartSettings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ChartSettings extends Component {
  constructor(props) {
    super(props);

    const chart = this.props.chart;

    this.state = {
      filter: [...chart.filter],
      startDate: chart.startDate,
      endDate: chart.endDate
    };
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleCheck(event) {
    // do stuff
  }

  save() {
    const settings = {
      filter: [...this.state.filter],
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };

    this.props.updatechartSettings(settings);
    this.props.togglechartSettings();
  }

  cancel() {
    this.revertSettings();
    this.props.togglechartSettings();
  }

  revertSettings() {
    const chart = this.props.chart;

    this.setState({
      filter: chart.filter,
      startDate: chart.startDate,
      endDate: chart.endDate
    });
  }

  render() {
    return (
      <div id='overlay'>
        <div id='chartSettings'>
        </div>
      </div>
    );
  }
}

ChartSettings.propTypes = {
  chart: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  chart: state.chart
});

export default connect(
  mapStateToProps,
  {
    updatechartSettings,
    togglechartSettings
  }
)(ChartSettings);