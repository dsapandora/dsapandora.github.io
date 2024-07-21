import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PacmanLoader from 'react-spinners/PacmanLoader';

function Home() {
  const [loading, setLoading] = useState(false);
  const [avatarURL, setAvatarURL] = useState('');
  const [githubUsername, setGitHubUsername] = useState('');
  const [repoData, setRepoData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  async function repoDataURL() {
    setLoading(true);
    try {
      const response = await fetch('https://dsapandora-backend.lazyracoon.tech/pinned-repos/');
      const result = await response.json();
      if (result.error) {
        setError(result.error);
        setRepoData(null);
      } else {
        const { data } = result;
        const { user: { pinnedItems } } = data;
        const list = pinnedItems.edges.map((repo) => {
          const { node: { name, description, url } } = repo;
          return (
            <div key={url} className="text-center">
              <a target="_blank" rel="noopener noreferrer" href={url}>
                {name}
              </a>
              <p>Description: {description}</p>
            </div>
          );
        });
        setRepoData(list);
        setError('');
      }
    } catch (error) {
      console.error('Error fetching pinned repositories:', error);
      setError('Error fetching pinned repositories');
      setRepoData(null);
    } finally {
      setLoading(false);
    }
  }

  function hideRepoData() {
    setRepoData(null);
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
          color={"#e66162"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className="home">
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={avatarURL} />
            <Card.Body>
              <Card.Title>{githubUsername}</Card.Title>
              <Card.Text>
                I am a Senior Software Engineer, and Artificial Intelligence researcher.
              </Card.Text>

              {repoData ? (
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
          {repoData}
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default Home;
