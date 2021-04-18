import * as React from "react";
import styles from "./app.module.scss";
import { getSinglePath } from "./utils";

const MachineSection = props => {
  return (
    <div className={`${styles.machine} ${props.className}`}>
      <h3 className={styles.machine_amount}>{props.amount}</h3>

      <svg
        className={styles.machine_pressure}
        width="37"
        height="21"
        viewBox="0 0 37 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.3458 0L20.3458 20H16.3458L18.3458 0Z"
          fill="black"
          className={styles.machine_pressure_arrow}
        />
        <path
          d="M18.3458 16.5C21.6277 16.5 24.4475 18.1374 25.8646 20.5H10.827C12.2441 18.1374 15.0639 16.5 18.3458 16.5Z"
          fill="black"
          stroke="black"
        />
      </svg>

      <div className={styles.machine_alphabet}>
        <svg
          className={styles.machine_alphabet_thumb}
          width="23"
          height="20"
          viewBox="0 0 23 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.77576 1.45679H13.3379C18.1889 1.45679 22.1214 5.38928 22.1214 10.2403C22.1214 15.0912 18.1889 19.0237 13.3379 19.0237H9.77576V1.45679Z"
            fill="black"
            stroke="black"
          />
          <path
            d="M18.4142 10.2403C18.4142 15.092 14.488 19.0237 9.64644 19.0237C4.80493 19.0237 0.878662 15.092 0.878662 10.2403C0.878662 5.38848 4.80493 1.45679 9.64644 1.45679C14.488 1.45679 18.4142 5.38848 18.4142 10.2403Z"
            fill="white"
            stroke="black"
          />
          <path
            d="M12.4828 14.325L11.6207 12.0289H7.60326L6.74114 14.325H4.08582L8.05156 4.67017H11.2931L15.2071 14.325H12.4828ZM9.63786 6.579H9.55164L8.22398 10.2445H10.9828L9.63786 6.579Z"
            fill="black"
          />
        </svg>
      </div>

      <svg
        className={styles.machine_greenlamp}
        width="36"
        height="23"
        viewBox="0 0 36 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 2.94169L23.6134 0.978545C29.6744 0.452371 34.8853 5.23043 34.8853 11.3142V11.3142C34.8853 17.398 29.6744 22.176 23.6134 21.6499L1 19.6867V2.94169Z"
          fill="white"
          stroke="black"
        />
        <path
          d="M1 8.02638L20.1147 6.96265L18.377 9.13846L20.1147 11.3143L18.377 13.4901L20.1147 15.6659L1 14.6022"
          stroke="black"
        />
      </svg>

      <svg
        className={styles.machine_orangelamp}
        width="36"
        height="23"
        viewBox="0 0 36 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 2.94169L23.6134 0.978545C29.6744 0.452371 34.8853 5.23043 34.8853 11.3142V11.3142C34.8853 17.398 29.6744 22.176 23.6134 21.6499L1 19.6867V2.94169Z"
          fill="white"
          stroke="black"
        />
        <path
          d="M1 8.02638L20.1147 6.96265L18.377 9.13846L20.1147 11.3143L18.377 13.4901L20.1147 15.6659L1 14.6022"
          stroke="black"
        />
      </svg>

      <div className={styles.machine_base} />

      <svg
        className={styles.machine_lever}
        width="21"
        height="50"
        viewBox="0 0 21 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10.0651 11.5288L10.0327 49.8932" stroke="black" />
        <path
          d="M17.0595 16.9664C13.4774 20.5485 7.67454 20.5534 4.0985 16.9774C0.522459 13.4014 0.527369 7.59854 4.10946 4.01645C7.69156 0.434351 13.4944 0.429442 17.0704 4.00548C20.6465 7.58152 20.6415 13.3843 17.0595 16.9664Z"
          fill="white"
          stroke="black"
        />
        <path
          d="M6.6994 6.60631C8.84866 4.45705 12.3304 4.4541 14.476 6.59972"
          stroke="black"
        />
      </svg>
    </div>
  );
};

const PleaseSelectSection = props => {
  return (
    <div className={`${styles.pelaseSelect} ${props.className}`}>
      <div className={styles.pelaseSelect_cursor}></div>
      <div className={styles.pelaseSelect_selelction} />
      <h3 className={styles.pelaseSelect_text}>
        Please select some icons to start
      </h3>
    </div>
  );
};

const App = () => {
  const [selectedAmount, setSelectedAmount] = React.useState(0);
  const [iconsData, setIconsData] = React.useState(
    [] as Array<svgStringObject>
  );
  const isIcons = () => iconsData.length > 0;

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

  const handleDownload = () => {};

  React.useEffect(() => {
    onmessage = event => {
      if (event.data.pluginMessage.type === "selected-amount") {
        setSelectedAmount(event.data.pluginMessage.data);
      }

      if (event.data.pluginMessage.type === "svg-strings") {
        let svgStrings = event.data.pluginMessage.data;

        const icons = svgStrings.map((svgString: svgStringObject) => ({
          name: svgString.name,
          data: getSinglePath(svgString.data)
        }));

        setIconsData(icons);
      }
    };
  }, [selectedAmount, iconsData]);

  return (
    <main className={styles.app}>
      <section className={styles.floatingSection}>
        {selectedAmount ? (
          <button onClick={handlePreview}>
            {`Preview ${selectedAmount} icons`}
          </button>
        ) : null}
        {isIcons() ? (
          <button onClick={handleDownload}>Download JSON</button>
        ) : null}
      </section>

      <section className={styles.beginningView}>
        <MachineSection amount={selectedAmount} />
        <PleaseSelectSection />
      </section>

      <section className={styles.previewView}>
        {isIcons()
          ? iconsData.map((icon: svgStringObject, i) => {
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
                  <path d={icon.data} />
                </svg>
              );
            })
          : null}
      </section>
    </main>
  );
};

export default App;
