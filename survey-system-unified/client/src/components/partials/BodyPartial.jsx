// BodyPartial.js
import React from 'react';
import { Helmet } from 'react-helmet';
import defaultimg from "../img/page1bg.png";

const BodyPartial = ({ backgroundColor, gradient, fonts, backgroundImage }) => {
  // Use the first font in the provided `fonts` array or default to 'Montserrat'
  const defaultFont = fonts ? fonts[2].family : "'Montserrat', sans-serif";

  // Default background image path
  const defaultBackgroundImage = defaultimg;

  // Determine the background style based on the presence of backgroundImage
  const backgroundStyle = backgroundImage
    ? `url(${backgroundImage}), rgba(0, 0, 0, 0.5)`
    : `url(${defaultBackgroundImage}), rgba(0, 0, 0, 0.5)`;

  return (
    <Helmet>

      {/* Preconnect to the Google Fonts server for optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

      {/* Load multiple Google Fonts */}
      {fonts &&
        fonts.map((font) => (
          <link key={font.url} rel="stylesheet" href={font.url} />
        ))}

      {/* Apply styles to the body */}
      <style>{`
        body {
          height: 100vh;
          background: ${backgroundStyle};
          background-size: cover; /* Ensures the background image covers the entire viewport */
          background-repeat: no-repeat; /* Prevents the background image from repeating */
          background-position: center; /* Centers the background image */
          margin: 0;
          padding: 0;
          font-family: ${defaultFont}; /* Use the first font in the array or default to Montserrat */
          color: #333;
          
        }
      `}</style>
    </Helmet>
  );
};

export default BodyPartial;