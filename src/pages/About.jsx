import React from 'react';
import image from './../image.png';

const About = () => {
  return (
    <div className='container mt-4'>
      <h1>About</h1>
      <div className='d-flex'>
        <img src={image} alt='authorImage' style={{ maxWidth: '200px' }} />
        <div>
          <h2>Telma Ivanova</h2>
          <p>
            <strong>Faculty Number:</strong> 26315
          </p>
          <p>
            The author of this simple web application is a student in DSMT with
            a passion for reading and exploring new books.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
