import React, { Component } from 'react';
import resumeData from './resume.json';
import './Resume.css';

class Resume extends Component {
  render() {
    const { name, jobTitle, summary, experience, education, skills } = resumeData;

    const experienceRows = experience.map((exp) => (
      <tr key={exp.position}>
        <td>{exp.position}</td>
        <td>{exp.company}</td>
        <td>{exp.startDate} - {exp.endDate}</td>
        <td>{exp.description}</td>
      </tr>
    ));

    const educationRows = education.map((edu) => (
      <tr key={edu.institution}>
        <td>{edu.institution}</td>
        <td>{edu.degree}</td>
        <td>{edu.startDate} - {edu.endDate}</td>
      </tr>
    ));

    return (
      <div className="resume">
        <h1>{name}</h1>
        <h2>{jobTitle}</h2>
        <p>{summary}</p>

        <h3>Experience</h3>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Dates</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {experienceRows}
          </tbody>
        </table>

        <h3>Education</h3>
        <table>
          <thead>
            <tr>
              <th>Institution</th>
              <th>Degree</th>
              <th>Dates</th>
            </tr>
          </thead>
          <tbody>
            {educationRows}
          </tbody>
        </table>

        <h3>Skills</h3>
        <ul>
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Resume;

