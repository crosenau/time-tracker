import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  updateChartSettings,
  toggleChartSettings
} from '../../actions/chartActions';

import DatePicker from 'react-datepicker';

import './ChartSettings.css';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ChartSettings extends Component {
  constructor(props) {
    super(props);

    const chart = this.props.chart;

    this.state = {
      tasks: [...chart.tasks],
      filter: [...chart.filter],
      startDate: chart.startDate,
      endDate: chart.endDate
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.revertSettings = this.revertSettings.bind(this);
  }

  handleDateChange(date, id) {
    this.setState({
      [id]: date
    });
  }

  handleCheck(event) {
    const { id, checked } = event.target;
    const filter = [...this.state.filter];
    const index = filter.indexOf(id);

    if (!checked && index === -1) {
      filter.push(id);
    } else if (checked && index >= 0) {
      filter.splice(index, 1);
    }

    this.setState({ filter });
  }

  save() {
    const settings = {
      filter: [...this.state.filter],
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };

    this.props.updateChartSettings(settings);
    this.props.toggleChartSettings();
  }

  cancel() {
    this.revertSettings();
    this.props.toggleChartSettings();
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
    const uniqueTasks = Array.from(
      new Set(
        this.state.tasks
          .map(task => task.taskName)
      )
    );

    console.log('uniqueTasks: ', uniqueTasks);

    return (
      <div id='overlay'>
        <div id='settings'>
          <div id='header'>
            <button
              className='icon-btn'
              onClick={this.cancel}
            >
              <FontAwesomeIcon icon={['far', 'times-circle']} />
            </button>
          </div>

          <div className='section'>
            <h3>Date Range</h3>
            <h2>From</h2>
            <DatePicker
              id='startDate'
              selected={this.state.startDate}
              onChange={date => {
                this.handleDateChange(date, 'startDate');
              }}
            />
            <h2>To</h2>
            <DatePicker
              id='endDate'
              selected={this.state.startDate}
              onChange={date => {
                this.handleDateChange(date, 'endDate');
              }}
            />
          </div>
          
          <div id='section'>
              <h3>Filter</h3>
              {uniqueTasks.map((task, i) => {
                console.log(task, i);
                return (
                  <div id='checkbox-container' key={`checkbox-container-${i}`}>
                    <input
                      type='checkbox'
                      id={task}
                      key={`checkbox-${i}`}
                      onChange={this.handleCheck}
                      checked={!this.state.filter.includes(task)}
                    />
                    <label 
                      htmlFor={task}
                      key={`label-${i}`}
                    >
                      {task}
                    </label>
                  </div>
                );
              })}
          </div>

          <div className='section'>
              <button onClick={this.save}>Save</button>
              <button onClick={this.cancel}>Cancel</button>
              <button>Defaults</button>
          </div>

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
    updateChartSettings,
    toggleChartSettings
  }
)(ChartSettings);