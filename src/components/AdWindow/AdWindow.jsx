import React, { useEffect } from 'react';

const AdWindow = ({ ad, username }) => {
  useEffect(() => {
    if (ad) {
      // CSS styles as a string
      const adStyles = `
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }

        h1 {
          color: #333;
        }

        p {
          color: #555;
        }

        img {
          max-width: 100%;
          height: auto;
        }

        a {
          color: #007bff;
          text-decoration: none;
        }

        .button-container {
          margin-top: 20px;
        }

        .close-button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
        }

        .close-button:hover {
          background-color: #c82333;
        }
      `;

      // Open a new window for the ad
      const adWindow = window.open("", "_blank", "width=400,height=300");
      if (adWindow) {
        // Write content to the new window
        adWindow.document.write(`
          <html>
            <head>
              <title>${ad.title}</title>
              <style>${adStyles}</style>
            </head>
            <body>
              <h1>${ad.title}</h1>
              <p>${ad.description}</p>
              ${ad.image ? `<img src="${ad.image}" alt="Ad Image">` : ''}
              <a href="${ad.link}" target="_blank">Learn more</a>
              <div class="button-container">
                <button class="close-button" id="close-button">Close</button>
              </div>
              <script>
                async function sendAdReadRequest() {
                  try {
                    await fetch('http://localhost:3000/ad-read', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username: '${username}', adId: '${ad.id}' })
                    });
                  } catch (error) {
                    console.error('Error sending ad-read request:', error);
                  }
                }

                document.getElementById('close-button').addEventListener('click', () => {
                  sendAdReadRequest().then(() => {
                    window.close(); // Ensure the window closes after sending the request
                  });
                });

                window.addEventListener('beforeunload', sendAdReadRequest);
              </script>
            </body>
          </html>
        `);
        adWindow.document.close(); // Ensure the document is closed and styles are applied
      } else {
        console.error('Failed to open a new window');
      }
    }
  }, [ad, username]);

  return null; // This component does not render anything
};

export default AdWindow;
