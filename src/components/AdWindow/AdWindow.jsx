// import React, { useEffect } from 'react';
// import './AdWindow.css'; // Import the CSS file for this component

// const AdWindow = ({ ads }) => {
//   useEffect(() => {
//     ads.forEach(ad => {
//       window.ipcRenderer.send('show-ad', ad); // Send each ad to be displayed
//     });
//   }, [ads]);

//   return (
//     <div>
//       {ads.map((ad, index) => (
//         <div key={index} className="pop-window-container">
//           {ad.image && <img src={ad.image} alt={ad.title} className="pop-window-image" />}
//           <div className="pop-window-title">{ad.title}</div>
//           <div className="pop-window-description">{ad.description}</div>
//           <a href={ad.link} className="pop-window-link" target="_blank" rel="noopener noreferrer">Learn more</a>
//           <button className="pop-window-close-button" onClick={() => window.close()}>Close</button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AdWindow;
import React, { useEffect } from 'react';

const AdWindow = ({ ad }) => {
  useEffect(() => {
    if (ad) {
      // Open a new window for the ad
      const adWindow = window.open("", "_blank", "width=400,height=300");
      if (adWindow) {
        adWindow.document.write(`
          <html>
            <head><title>${ad.title}</title></head>
            <body>
              <h1>${ad.title}</h1>
              <p>${ad.description}</p>
              ${ad.image ? `<img src="${ad.image}" alt="Ad Image" style="width: 100%; height: auto;">` : ''}
              <a href="${ad.link}" target="_blank">Learn more</a>
              <button onclick="window.close()">Close</button>
            </body>
          </html>
        `);
      } else {
        console.error('Failed to open a new window');
      }
    }
  }, [ad]);

  return null; // This component does not render anything
};

export default AdWindow;


