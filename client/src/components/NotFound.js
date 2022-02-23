import React from "react";

const NotFound = () => {
  return (
    <div className="error-area">
      <div className="error-content text-center">
        <div className="error-num">
          404
          <div className="error-num__clip">404</div>
        </div>
        <h2>Page Not Found</h2>
        <a href="/" className="cmn-btn">
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
