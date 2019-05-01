import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  updateChartSettings,
  toggleChartSettings,
  updateErrors
} from '../../actions/chartActions';

import DatePicker from 'react-datepicker';

import validateChartSettings from '../../validation/chartSettings';

import style from './settings.module.css';
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
      endDate: chart.endDate,
      isValid: true
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.resetFields = this.resetFields.bind(this);
  }

  componentWillUnmount() {
    this.props.updateErrors({});
  }

  handleDateChange(date, id) {
    const { errors, isValid } = validateChartSettings({
      ...this.state,
      [id]: date
    });

    this.props.updateErrors(errors);

    this.setState({
      [id]: date,
      isValid
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
    this.resetFields();
    this.props.toggleChartSettings();
  }

  resetFields() {
    const chart = this.props.chart;

    this.setState({
      filter: chart.filter,
      startDate: chart.startDate,
      endDate: chart.endDate
    });
  }

  render() {
    const { errors } = this.props;
    
    const taskLabels = Array.from(
      new Set(
        this.state.tasks
          .map(task => task.taskName)
      )
    );

    return (
      <div id={style.overlay}>
        <div id={style.settings}>
          <div id={style.header}>
          <h2>Settings</h2>
            <button
              className='icon-btn'
              onClick={this.cancel}
            >
              <FontAwesomeIcon icon={'times'} />
            </button>
          </div>

          <div className={style.section}>
            <h3>Date Range</h3>
            <div className={style.inputContainer}>
              <label htmlFor='startDate'>From</label>
              <DatePicker
                id='startDate'
                selected={this.state.startDate}
                onChange={date => {
                  this.handleDateChange(date, 'startDate');
                }}
                required
              />
            </div>
            <div className={style.inputContainer}>
              <label htmlFor='endDate'>To</label>
              <DatePicker
                id='endDate'
                selected={this.state.endDate}
                onChange={date => {
                  this.handleDateChange(date, 'endDate');
                }}
                required
              />
            </div>
          </div>
          <span className='error'>{null || errors.dateRange}</span>
          
          <div id='section'>
            <h3>Filter</h3>
            <div className={style.checkboxes}>
            {taskLabels.map((task, i) => {
              return (
                <div className='checkboxContainer' key={`checkboxContainer-${i}`}>
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
          </div>

          <div className={style.section}>
            {this.state.isValid ?
              <button onClick={this.save}>Save</button> :
              <button onClick={this.save} disabled>Save</button>
            }
            <button onClick={this.cancel}>Cancel</button>
          </div>

        </div>
      </div>
    );
  }
}

ChartSettings.propTypes = {
  updateChartSettings: PropTypes.func.isRequired,
  toggleChartSettings: PropTypes.func.isRequired,
  updateErrors: PropTypes.func.isRequired,
  chart: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  chart: state.chart,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    updateChartSettings,
    toggleChartSettings,
    updateErrors
  }
)(ChartSettings);