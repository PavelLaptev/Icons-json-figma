import * as React from "react";
import styles from "./app.module.scss";
import { getSinglePath } from "./utils";

const App = () => {
  const [selectedAmount, setSelectedAmount] = React.useState(0);
  const [icons, setIcons] = React.useState([]);

  const handlePreview = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "preview"
        }
      },
      "*"
    );
  };

  React.useEffect(() => {
    onmessage = event => {
      if (event.data.pluginMessage.type === "selected-amount") {
        setSelectedAmount(event.data.pluginMessage.data);
      }

      if (event.data.pluginMessage.type === "svg-strings") {
        let svgStrings = event.data.pluginMessage.data;
        setIcons(
          svgStrings.map((svgString: string) => getSinglePath(svgString))
        );
      }
    };
  }, [selectedAmount, icons]);

  return (
    <div className={styles.app}>
      <div>
        <h2>selected {selectedAmount} icons</h2>
      </div>
      <div>
        <button onClick={handlePreview}>Preview</button>
      </div>
      <div className={styles.previewView}>
        {icons.length > 0
          ? icons.map((dString: string, i) => {
              return (
                <svg
                  key={`icon-${i}`}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="black"
                  fillRule="evenodd"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d={dString} />
                </svg>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default App;
