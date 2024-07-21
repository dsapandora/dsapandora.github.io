import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import 'bootstrap/dist/css/bootstrap.min.css';

function GitHubContributions({ username }) {
  return (
    <div className="github-contributions">
      <h3>Code Contributions in the last year</h3>
      <GitHubCalendar username={username} />
    </div>
  );
}

export default GitHubContributions;
