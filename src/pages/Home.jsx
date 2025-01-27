import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className='home-page'>
    <section className='intro py-5 text-center bg-light'>
      <div className='container'>
        <h1 className='display-4'>Welcome to the Book Lovers app!</h1>
        <p className='lead mt-3'>
          The Internet age has transformed how we choose what to read or watch,
          largely thanks to review platforms like Goodreads and IMDB. Book
          Lovers app is here to make your book discovery journey easier and more
          enjoyable!
        </p>
        <ul className='list-unstyled mt-4'>
          <li> ✔️ Explore book reviews and ratings.</li>
          <li> ✔️ Discover books by genre.</li>
          <li> ✔️ Share your thoughts by writing reviews and comments.</li>
          <li> ✔️ Rate books and contribute to the community.</li>
          <li> ✔️ Add missing books with their title, cover, and genre.</li>
        </ul>
      </div>
    </section>

    <section className='how-to-start py-5'>
      <div className='container'>
        <h2 className='text-center mb-4'>Getting Started</h2>
        <div className='row text-center'>
          <div className='col-md-3'>
            <p>
              <Link to='/register' className='text-primary'>
                Create an account by registering
              </Link>
            </p>
          </div>
          <div className='col-md-3'>
            <p>
              <Link to='/books' className='text-primary'>
                Browse the books and reviews
              </Link>
            </p>
          </div>
          <div className='col-md-3'>
            <p>
              <Link to='/login' className='text-primary'>
                Rate, comment or add books
              </Link>
            </p>
          </div>
          <div className='col-md-3'>
            <p>
              <Link to='/register' className='text-primary'>
                Explore genre-specific groups
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className='register-now py-5 bg-dark text-white text-center'>
      <div className='container'>
        <h2>Join the community!</h2>
        <p className='mt-3'>
          Become part of a vibrant community of book lovers. Register now to
          unlock all features, including:
        </p>
        <ul className='list-unstyled'>
          <li>● Adding books to your wish list.</li>
          <li>● Rating and reviewing books.</li>
          <li>● Creating or managing genre-specific groups.</li>
        </ul>
        <a href='/register' className='btn btn-primary btn-lg mt-4'>
          Sign up with email
        </a>
      </div>
    </section>
  </div>
);

export default Home;
