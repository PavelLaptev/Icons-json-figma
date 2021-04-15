import * as React from "react";
import styles from "./app.module.scss";
import { getSinglePath } from "./utils";

const App = () => {
  const [selectedAmount, setSelectedAmount] = React.useState(0);
  const [icons, setIcons] = React.useState([]);
  const [errors, setErrors] = React.useState([] as Array<string>);

  const handlePreview = () => {
    // setErrors([]);
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

      if (event.data.pluginMessage.type === "svg-errors") {
        let svgErrors = event.data.pluginMessage.data;
        setErrors(svgErrors);
      }
    };
  }, [selectedAmount, icons, errors]);

  return (
    <main className={styles.app}>
      <section>
        <h2>selected {selectedAmount} icons</h2>
      </section>

      <section>
        <button onClick={handlePreview}>Preview</button>
      </section>

      <section className={styles.previewView}>
        {icons.length > 0
          ? icons.map((dString: string, i) => {
              return (
                <svg
                  className={styles.icon}
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
      </section>

      {errors.length > 0 ? (
        <section>
          <h3>Oops…</h3>
          {errors.map((error, i) => {
            return <div key={`error-${i}`}>{error}</div>;
          })}
          <span>Please check required conditions</span>
        </section>
      ) : null}
    </main>
  );
};

export default App;
