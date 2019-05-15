import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './auth.module.css';
import screenshot1 from '../../assets/images/landing.png';

const Landing = (props) => {
  return (
    <div className={styles.intro}>
        <img
          id={styles.image}
          src={screenshot1}
          alt='Bar Chart'
        />

      <div className={styles.list}>
        <div className={styles.item}>
          <span className={styles.bullet}>
            <FontAwesomeIcon icon={'bullseye'} />
          </span>
          <span className={styles.text}>
            Set your goals
          </span>
        </div>
        <div className={styles.item}>
          <span className={styles.bullet}>
            <FontAwesomeIcon icon={'layer-group'} />
          </span>
          <span className={styles.text}>
            Categorize your tasks
          </span>
        </div>
        <div className={styles.item}>
          <span className={styles.bullet}>
            <FontAwesomeIcon icon={'chart-line'} />
          </span>
          <span className={styles.text}>
            Log and track your time
          </span>
        </div>
      </div>
    </div>
  );
}

export default Landing;