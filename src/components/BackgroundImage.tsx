import library from '../assets/images/blue-hall.png';

export const BackgroundImage = () => {
  return (
    <div
      style={{
        width: '1024px',
        height: '100vh',
        backgroundImage: `url(${library})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: '-10',
      }}
    ></div>
  );
};
