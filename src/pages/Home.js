import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PacmanLoader from 'react-spinners/PacmanLoader';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

function Home() {
  const [loading, setLoading] = useState(false);
  const [avatarURL, setAvatarURL] = useState('');
  const [githubUsername, setGitHubUsername] = useState('');
  const [repoData, setRepoData] = useState([]);
  const [error, setError] = useState('');
  const [showRepos, setShowRepos] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  async function repoDataURL() {
    setLoading(true);
    try {
      const response = await fetch('https://dsapandora-backend.lazyracoon.tech/pinned-repos');
      const result = await response.json();
      if (result.error) {
        setError(result.error);
        setRepoData([]);
      } else {
        const { data } = result;
        const { user: { pinnedItems } } = data;
        const list = pinnedItems.edges.map((repo) => {
          const { node: { name, description, url, openGraphImageUrl } } = repo;
          return (
            <Card key={url} style={{ width: '18rem', margin: '0.5rem' }}>
              <Card.Img variant="top" src={openGraphImageUrl} className='repo-logo' />
              <Card.Body>
                <Card.Title>
                  <a target="_blank" rel="noopener noreferrer" href={url}>
                    {name}
                  </a>
                </Card.Title>
                <Card.Text>Description: {description}</Card.Text>
              </Card.Body>
            </Card>
          );
        });
        setRepoData(list);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching pinned repositories:', error);
      setError('Error fetching pinned repositories');
      setRepoData([]);
    } finally {
      setLoading(false);
      setShowRepos(true);
    }
  }

  function hideRepoData() {
    setRepoData([]);
    setShowRepos(false);
  }

  useEffect(() => {
    fetch('https://api.github.com/users/dsapandora')
      .then((res) => res.json())
      .then(
        (result) => {
          setAvatarURL(result.avatar_url);
          setGitHubUsername(result.name);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  return (
    <div className="home">
      {loading ? (
        <PacmanLoader
          color={"#57745a"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className={`content-container ${showRepos ? 'show-repos' : ''}`}>
          <Card className="profile-card">
            <Card.Img variant="top" src={avatarURL} />
            <Card.Body>
              <Card.Title>{githubUsername}</Card.Title>
              <Card.Text>
                I am a Senior Software Engineer, and Artificial Intelligence researcher.
              </Card.Text>

              {showRepos ? (
                <Button variant="danger" onClick={hideRepoData}>
                  Hide Projects
                </Button>
              ) : (
                <Button variant="primary" onClick={repoDataURL}>
                  Projects
                </Button>
              )}
            </Card.Body>
          </Card>
          {showRepos && (
            <div className="repo-grid">
              {repoData.slice(0, 6).map((repo, index) => (
                <div key={index} className="repo-item">
                  {repo}
                </div>
              ))}
              {error && <p className="error-text">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
