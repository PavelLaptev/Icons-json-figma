const getSinglePath = (svgstring: string) => {
  let parser = new DOMParser();
  let svgDOM = parser.parseFromString(svgstring, "image/svg+xml");
  let svgEl = svgDOM.querySelector("svg") as SVGElement;

  let svgD = [...svgEl.querySelectorAll("path")].map(
    path => path.attributes["d"].value
  );
  let joinedD = svgD.join(" ");

  return {
    data: joinedD,
    size: {
      width: svgEl.getAttribute("width"),
      height: svgEl.getAttribute("height")
    },
    viewBox: svgEl.getAttribute("viewBox")
  };
};

export default getSinglePath;
