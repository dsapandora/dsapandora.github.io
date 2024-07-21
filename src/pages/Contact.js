import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://dsapandora-backend.lazyracoon.tech/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setAlertMessage('Your message has been sent successfully!');
        setShowAlert(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setAlertMessage('Failed to send your message. Please try again later.');
      setShowAlert(true);
    }
  };

  return (
    <Container className="contact" style={{ padding: '2rem' }}>
      <Card>
        <Card.Body>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Contact</h1>
          {showAlert && <Alert variant={alertMessage.includes('success') ? 'success' : 'danger'}>{alertMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formName" style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Label style={{ minWidth: '100px', marginRight: '10px', fontSize: '16px' }}>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '16px' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formEmail" style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Label style={{ minWidth: '100px', marginRight: '10px', fontSize: '16px' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '16px' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formSubject" style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Label style={{ minWidth: '100px', marginRight: '10px', fontSize: '16px' }}>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '16px' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group controlId="formMessage" style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Label style={{ minWidth: '100px', marginRight: '10px', fontSize: '16px' }}>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '16px' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" style={{ fontSize: '16px' }}>
              Send
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Contact;
