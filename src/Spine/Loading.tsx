import React from 'react';
import styles from './Loading.module.scss';
export interface ILoading {
  height?: number;
  timer?: number; // in seconds
  indeterminate?: boolean;
  color?: string;
}
const Loading: React.FC<ILoading> = ({
  height = 10,
  timer = 10,
  indeterminate = false,
  color = '#F0A737'
}) => {
  return (
    <div
      className={
        styles['round-time-bar'] +
        ' ' +
        (indeterminate ? styles['indeterminate'] : '')
      }
      data-style={indeterminate ? 'indeterminate' : 'smooth'}
      style={
        {
          '--loading-duration': timer,
          height: `${height}px`,
          backgroundColor: color
        } as React.CSSProperties
      }
    >
      <div></div>
    </div>
  );
};

export default Loading;
