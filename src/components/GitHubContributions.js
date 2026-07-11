import React from 'react';
import GitHubCalendar from 'react-github-calendar';

const theme = {
  light: ['#ece9e1', '#ffe0b3', '#ffd23e', '#ff8a3d', '#ff4d2e'],
};

function GitHubContributions({ username }) {
  return (
    <div className="github-contributions">
      <h3>Code contributions in the last year</h3>
      <GitHubCalendar
        username={username}
        colorScheme="light"
        theme={theme}
        fontSize={13}
        blockSize={12}
      />
    </div>
  );
}

export default GitHubContributions;
