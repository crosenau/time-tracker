import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleSettingsDisplay } from '../../actions/timerActions';

import Timer from './Timer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Focus.css';

class Focus extends Component {
  render() {
    return (
      <div id='focus'>
        <button className='icon-btn' id='settings-btn' onClick={this.props.toggleSettingsDisplay}>
          <FontAwesomeIcon icon='cog' />    
        </button>
        <Timer />
      </div>
    );
  }
}

Focus.propTypes = {
  auth: PropTypes.object.isRequired,
  timer: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  timer: state.timer
});

export default connect(
  mapStateToProps,
  { 
    toggleSettingsDisplay
  }
)(Focus);