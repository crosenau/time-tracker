import React, { Component } from 'react';

import './ProgressRing.css';

const ProgressRing = props => {
  const smallest = Math.min(window.innerWidth, window.innerHeight)
  const diameter = Math.floor(smallest / 2);
  const stroke = 4;
  const radius = diameter / 2 - stroke;
  const center = diameter / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRingStyle = {
    strokeDasharray: `${circumference} ${circumference}`,
    transform: 'rotate(-90deg)',
    transformOrigin: '50% 50%'
  };

  const ring = document.querySelector('#progress-ring-circle');
  
  if (ring) {
    const offset = circumference - circumference * props.percent / 100; 
    ring.style.strokeDashoffset = -offset;
  }

  return (
    <div id='progress-ring'>
    <svg
      width={diameter}
      height={diameter}
    >
      <circle
        id='background-circle'
        stroke='#00aad4ff'
        strokeWidth={stroke * 2}
        fill='transparent'
        r={radius}
        cx={center}
        cy={center}
        style={progressRingStyle}
      />
      <circle
        id='progress-ring-circle'
        stroke='#aaddffff'
        strokeWidth={stroke}
        fill='transparent'
        r={radius}
        cx={center}
        cy={center}
        style={progressRingStyle}
      />
    </svg>
    </div>
  );
};

export default ProgressRing;