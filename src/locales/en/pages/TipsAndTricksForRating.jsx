import React from 'react';

const TipsAndTricksForRating = () => {
  return (
    <div className='container mt-4'>
      <h1 className='mb-4'>Tips and Tricks for Rating</h1>
      <p>
        <strong>What Does Each Star Mean?</strong> Unsure where to place your
        book? Take a look below at our star rating guide and work out where you
        will put your latest read.
      </p>

      <div className='mt-4'>
        <h3>1 STAR (*)</h3>
        <p>
          Have you come across a tragically dull read? Did it lack structure,
          contain boring characters, or was it packed with grammatical errors?
          Perhaps it was even downright offensive. Whatever the problem was with
          this book, there is no denying it was bad - and we mean really bad!
        </p>
        <p>
          The 1 Star review is for books that have no place on your bookshelf.
          The ones that were snooze-worthy from start to finish (sadly, they are
          out there). If you think a book was utterly terrible and need everyone
          to know it, don't be afraid to use the 1 Star review.
        </p>
        <p>
          Remember - you need to back up your star rating, so be prepared to
          explain why the book was so disastrous in your review. If you simply
          didn't engage with the content as it wasn't your cup of tea, but can
          still appreciate that it is a good piece of writing, consider moving
          it up the scale.
        </p>
      </div>

      <div className='mt-4'>
        <h3>2 STARS (**)</h3>
        <p>
          It's safe to say that you won't reread this book, and it's doubtful
          that it will remain on your bookshelf. However, perhaps this book
          wasn't complete nonsense. The 2-star review is for a book that
          definitely wasn't good but wasn't completely bad.
        </p>
        <p>
          If you appreciated the story or enjoyed a few snippets of text, but
          felt overall that the book lacked personality and storyline, then
          award your below-average read a 2-star review.
        </p>
      </div>

      <div className='mt-4'>
        <h3>3 STARS (***)</h3>
        <p>
          Are you feeling neutral about your recent read? Were you a little
          underwhelmed? Are you plagued by the feeling of indifference? Then
          bring out the 3 Star review.
        </p>
        <p>
          You should award 3 Stars to books that you mostly enjoyed but didn't
          leave you with the "wow, that was good" kind of feeling. If, overall,
          you liked the book but were still troubled by a few components (i.e.
          Basic characters, simple storylines, obvious endings etc.) or felt it
          lacked personality, award your book 3 stars in appreciation, but not
          glorification.
        </p>
      </div>

      <div className='mt-4'>
        <h3>4 STARS (****)</h3>
        <p>
          Now the party is starting! 4 Stars are for books that you enjoyed,
          from beginning to end - a truly great read.
        </p>
        <p>
          It may not be top of your reread pile, but if the opportunity arose,
          you wouldn't say no. You should be pleased with all the components of
          the novel, and perhaps you were even thrilled about one element in
          particular (such as an engaging character or plot twist).
        </p>
        <p>
          A 4 Star rating is for books that are truly superb but are perhaps
          just missing the cherry on top to boost them to the full 5 Stars.
        </p>
      </div>

      <div className='mt-4'>
        <h3>5 STARS (*****)</h3>
        <p>
          Can't wait to reread? Top of your recommendation list? Can't stop
          thinking about the ending? Beginning? Chapter 13, page 4?!
        </p>
        <p>
          5 Stars are for the creme de la creme of your bookshelf. Those books
          that give you the "I'm so sad it has ended!" kind of feeling. Of
          course, no book is entirely perfect, but if this book has you almost
          shouting from the rooftops, filled you with a joyous buzz and reminded
          you how wondrous it is to read, then 5 Stars are certainly on the
          menu.
        </p>
      </div>

      <div className='mt-4'>
        <p>
          <em>
            Reference:{' '}
            <a
              href='https://www.onbookstreet.com/blog/book-rating-system'
              target='_blank'
              rel='noopener noreferrer'
            >
              onbookstreet.com
            </a>
          </em>
        </p>
      </div>
    </div>
  );
};

export default TipsAndTricksForRating;
