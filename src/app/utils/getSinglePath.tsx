const getSinglePath = (string: string) => {
  let parser = new DOMParser();
  let svgDOM = parser.parseFromString(string, "image/svg+xml");
  let svgPaths = svgDOM.getElementsByTagName("path");

  let svgD = [...svgPaths].map(
    (path: SVGElement) => path.attributes["d"].nodeValue
  );

  let joinedD = svgD.join(" ");

  return joinedD;
};

export default getSinglePath;
