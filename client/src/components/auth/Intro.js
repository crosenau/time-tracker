import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './auth.module.css';
import screenshot1 from '../../assets/images/landing.png';

const Landing = (props) => {
  return (
    <div className={styles.intro}>
      <div className={styles.list}>
        <span className={styles.item}>
          <span>
            <FontAwesomeIcon icon={'bullseye'} />
          </span>
          Set your goals
        </span>
        <span className={styles.item}>
          <span>
            <FontAwesomeIcon icon={'layer-group'} />
          </span>
          Categorize your tasks
        </span>
        <span className={styles.item}>
          <span>
            <FontAwesomeIcon icon={'chart-line'} />
          </span>
          Log and track your time
        </span>
      </div>
        <img
          id={styles.image}
          src={screenshot1}
          alt='Bar Chart'
        />
    </div>
  );
}

export default Landing;