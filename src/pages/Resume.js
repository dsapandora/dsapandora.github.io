import React from 'react';
import resumeData from './resume.json';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Resume.css';

const Resume = () => {
  const { name, jobTitle, summary, experience, education, skills } = resumeData;

  return (
    <Container className="resume">
      <Row className="mb-4">
        <Col>
          <h1>{name}</h1>
          <h2>{jobTitle}</h2>
          <p>{summary}</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h3>Experience</h3>
          {experience.map((exp) => (
            <Card className="mb-3" key={exp.position}>
              <Card.Body>
                <Row>
                  <Col xs={3} className="d-flex align-items-center">
                    <img src={exp.logo} alt={exp.company} className="company-logo" />
                  </Col>
                  <Col xs={9}>
                    <Card.Title>{exp.position}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{exp.company}</Card.Subtitle>
                    <Card.Text>{exp.startDate} - {exp.endDate}</Card.Text>
                    <Card.Text>{exp.description}</Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h3>Education</h3>
          {education.map((edu) => (
            <Card className="mb-3" key={edu.institution}>
              <Card.Body>
                <Row>
                  <Col xs={3} className="d-flex align-items-center">
                    <img src={edu.logo} alt={edu.institution} className="institution-logo" />
                  </Col>
                  <Col xs={9}>
                    <Card.Title>{edu.institution}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{edu.degree}</Card.Subtitle>
                    <Card.Text>{edu.startDate} - {edu.endDate}</Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h3>Skills</h3>
          <Row>
            {skills.map((skill) => (
              <Col xs={6} md={4} lg={3} key={skill.name} className="mb-3">
                <Card className="skill-card text-center">
                  <Card.Img variant="top" src={skill.logo} className="skill-logo" />
                  <Card.Body>
                    <Card.Text>{skill.name}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Resume;
