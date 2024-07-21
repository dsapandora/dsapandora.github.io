import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import PacmanLoader from 'react-spinners/PacmanLoader';
import 'bootstrap/dist/css/bootstrap.min.css';

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
          const { node: { name, description, url } } = repo;
          return (
            <Card key={url} style={{ width: '18rem', margin: '0.5rem' }}>
              <Card.Img variant="top" src="/lazyracoon_logo.png" />
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
    <div className="home" style={{ padding: '2rem' }}>
      {loading ? (
        <PacmanLoader
          color={"#57745a"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: showRepos ? 'row' : 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ width: '18rem', marginBottom: '1rem' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginLeft: '2rem' }}>
              {repoData.slice(0, 6).map((repo, index) => (
                <div key={index} style={{ margin: '0.5rem' }}>
                  {repo}
                </div>
              ))}
              {error && <p>{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
