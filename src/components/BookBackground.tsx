import React from 'react';
import bookImage from '../assets/images/white-book2.png';

interface BookBackgroundProps {
  leftPageContent: React.ReactNode;
  rightPageContent: React.ReactNode;
}

const BookBackground: React.FC<BookBackgroundProps> = ({
  leftPageContent,
  rightPageContent,
}) => {
  return (
    <div
      style={{
        width: '700px',
        height: '550px',
        backgroundImage: `url(${bookImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        marginTop: '30px',
      }}
    >
      <div
        className="left-page"
        style={{
          width: '50%',
          padding: '0 25px 0 75px',
          overflowWrap: 'break-word',
          boxSizing: 'border-box',
        }}
      >
        {leftPageContent}
      </div>
      <div
        className="right-page"
        style={{
          width: '50%',
          padding: '20px 75px 0 25px',
          overflowWrap: 'break-word',
          boxSizing: 'border-box',
        }}
      >
        {rightPageContent}
      </div>
    </div>
  );
};

export default BookBackground;
