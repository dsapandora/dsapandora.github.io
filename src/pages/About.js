import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import GitHubContributions from '../components/GitHubContributions';

function About() {
  return (
    <div className="about container" style={{ padding: '2rem', display: 'flex', flexWrap: 'wrap' }}>
      <div className="col-md-4 mb-4">
        <Card>
          <Card.Body style={{ fontSize: '16px' }}>
            <Card.Title className="h3" style={{ fontSize: '20px' }}>Contact Information</Card.Title>
            <Card.Text>
              <strong>Ariel Vernaza</strong><br />
              2465, 447 Broadway, 2nd Floor, New York, NY, New York, US, 10013<br />
              NY, New York<br />
              <a href="https://linkedin.com/in/dsapandora">LinkedIn</a> | <a href="https://github.com/dsapandora">GitHub</a><br />
              Phone: +1-818-570-5422<br />
              Email: <a href="mailto:ariel@lazyracoon.tech">ariel@lazyracoon.tech</a><br />
              Website: <a href="https://dsapandora.lazyracoon.tech">dsapandora.lazyracoon.tech</a>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      
      <div className="col-md-8">
        <div className="row">
          <div className="col-md-6 mb-3">
            <Card>
              <Card.Img variant="top" src="/logo_esada.svg" style={{ height: '100px', objectFit: 'contain' }} />
              <Card.Body style={{ fontSize: '16px' }}>
                <Card.Title className="h5">Master’s in Game Design</Card.Title>
                <Card.Text>Escuela Superior de Arte y Diseño de Andalucía, 2023</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6 mb-3">
            <Card>
              <Card.Img variant="top" src="/logo_uc3m.png" style={{ height: '100px', objectFit: 'contain' }} />
              <Card.Body style={{ fontSize: '16px' }}>
                <Card.Title className="h5">Master’s in Computer Science and Technology with Specialization in Artificial Intelligence</Card.Title>
                <Card.Text>University Charles III of Madrid, 2013</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6 mb-3">
            <Card>
              <Card.Img variant="top" src="/logo_udelas.png" style={{ height: '100px', objectFit: 'contain' }} />
              <Card.Body style={{ fontSize: '16px' }}>
                <Card.Title className="h5">Higher Education Specialization</Card.Title>
                <Card.Text>Specialized University of the Americas, 2018</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6 mb-3">
            <Card>
              <Card.Img variant="top" src="/logo_up.png" style={{ height: '100px', objectFit: 'contain' }} />
              <Card.Body style={{ fontSize: '16px' }}>
                <Card.Title className="h5">Bachelor’s in Computer Science</Card.Title>
                <Card.Text>University of Panama, 2012</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <div className="mt-1 mb-4">
        <GitHubContributions username="dsapandora" />
      </div>
    </div>
  );
}

export default About;
