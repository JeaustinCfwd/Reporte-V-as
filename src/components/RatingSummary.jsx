import React from 'react';
import '../styles/RatingBox.css';

const RatingSummary = ({ ratings, total }) => (
  <div className="row">
    {Object.entries(ratings).map(([stars, count]) => {
      const percent = (count / total) * 100;
      return (
        <React.Fragment key={stars}>
          <div className="side"><div>{stars} star</div></div>
          <div className="middle">
            <div className="barContainer">
              <div className={`bar${stars}`} style={{ width: `${percent}%` }} />
            </div>
          </div>
          <div className="side right"><div>{count}</div></div>
        </React.Fragment>
      );
    })}
  </div>
);

export default RatingSummary;
