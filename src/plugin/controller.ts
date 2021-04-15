import { clone } from "./utils";

////////////////////////////////////////////////////////////////
///////////////////////// UI AND DATA //////////////////////////
////////////////////////////////////////////////////////////////

// UI
figma.showUI(__html__, { width: 280, height: 350 });

////////////////////////////////////////////////////////////////
////////////////////////// FUNCTIONS ///////////////////////////
////////////////////////////////////////////////////////////////
let svgStrings = [];
let svgErrors = [];

const postMsg = (type, data) =>
  figma.ui.postMessage({
    type: type,
    data: data
  });

const convertIcons = async () => {
  let selected = figma.currentPage.selection;

  if (selected.length === 0) {
    figma.notify("Please select icons");
    return;
  }

  return await selected.map((frame: any) => {
    let cloneFrame = figma.createFrame();
    cloneFrame.name = frame.name;
    cloneFrame.backgrounds = [];
    cloneFrame.resize(frame.width, frame.height);

    frame.children.forEach(child => {
      if (child.visible) {
        // console.log(child);
        // cloneFrame.relativeTransform = child.relativeTransform;
        cloneFrame.x = child.x;
        cloneFrame.y = child.y;
        clone(child, cloneFrame);
      }
    });

    try {
      return cloneFrame.exportAsync({ format: "SVG" }).then(result => {
        let svgString = String.fromCharCode.apply(null, result);

        let exportedNode = figma.createNodeFromSvg(svgString);
        figma.union(exportedNode.children, exportedNode);

        exportedNode.exportAsync({ format: "SVG" }).then(result => {
          figma.flatten(exportedNode.children);
          let svgString = String.fromCharCode.apply(null, result);
          svgStrings.push(svgString);
          // cloneFrame.remove();
          // exportedNode.remove();
        });
      });
    } catch (err) {
      let customErrorMsg = `Error in "${cloneFrame.name}" icon`;
      console.error(customErrorMsg);
      svgErrors.push(customErrorMsg);

      postMsg("svg-errors", svgErrors);

      cloneFrame.remove(); // remove failed frame clone
    }
  });
};

////////////////////////////////////////////////////////////////
///////////////////// ON SELECTION CHANGE //////////////////////
////////////////////////////////////////////////////////////////

figma.on("selectionchange", () => {
  let selected = figma.currentPage.selection;
  postMsg("selected-amount", selected.length);
});

////////////////////////////////////////////////////////////////
///////////////////////// ON MESSAGE ///////////////////////////
////////////////////////////////////////////////////////////////

figma.ui.onmessage = async msg => {
  if (msg.type === "preview") {
    // postMsg("svg-errors", []);
    // svgErrors = [];
    await convertIcons().then(() => {
      postMsg("svg-strings", svgStrings);
      //
      svgStrings = [];
      svgErrors = [];
    });
  }
};
