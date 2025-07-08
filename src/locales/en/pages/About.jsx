import React from 'react';
import image from './../author.png';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <div className='container mt-4'>
      <Helmet>
        <title>About ‧ Book Lovers</title>
      </Helmet>
      <h1>About</h1>
      <div className='d-flex'>
        <img src={image} alt='authorImage' style={{ maxWidth: '200px' }} />
        <div>
          <h2>Telma Ivanova</h2>
          <p>
            The author of this web application is a student in DSMT with
            a passion for reading and exploring new books that wants to provide unlimited access to an extraordinary books.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
