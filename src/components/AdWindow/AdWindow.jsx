import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import AdContent from "../AdContent/AdContent";

const AdWindow = ({ ad, username }) => {
  useEffect(() => {
    if (ad) {
      console.log(ad);
      const adWindow = window.open("", "_blank", "width=400,height=300");

      if (adWindow) {
        const container = adWindow.document.createElement("div");
        adWindow.document.body.appendChild(container);

        const onClose = () => {
          adWindow.close();
        };

        ReactDOM.render(
          <React.StrictMode>
            <AdContent ad={ad} username={username} onClose={onClose} />
          </React.StrictMode>,
          container
        );

        adWindow.document.title = ad.title;

        adWindow.onbeforeunload = () => {
          ReactDOM.unmountComponentAtNode(container);
        };
      } else {
        console.error("Failed to open a new window");
      }
    }
  }, [ad, username]);

  return null; 
};

export default AdWindow;
