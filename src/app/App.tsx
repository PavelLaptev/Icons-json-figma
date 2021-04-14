import * as React from "react";
import styles from "./app.module.scss";
import { getSinglePath } from "./utils";

const App = () => {
  const [selectedAmount, setSelectedAmount] = React.useState(0);

  const GeneratedIcons = () => {
    return <div>icon</div>;
  };

  const handlePreview = () => {
    console.log("click");
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

      if (event.data.pluginMessage.type === "svg-string") {
        getSinglePath(event.data.pluginMessage.data);
      }
    };
  }, []);

  return (
    <div className={styles.app}>
      <div>
        <h2>selected {selectedAmount} icons</h2>
      </div>
      <div>
        <button onClick={handlePreview}>Preview</button>
      </div>
      <div className={styles.previewView}>
        <GeneratedIcons />
      </div>
    </div>
  );
};

export default App;
