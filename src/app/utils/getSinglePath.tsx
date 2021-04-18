const getSinglePath = (svgstring: string) => {
  let parser = new DOMParser();
  let svgDOM = parser.parseFromString(svgstring, "image/svg+xml");
  let svgD = [...svgDOM.querySelectorAll("path")].map(
    path => path.attributes["d"].value
  );

  let joinedD = svgD.join(" ");

  return joinedD;
};

export default getSinglePath;
