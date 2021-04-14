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

const convertIcons = async () => {
  let selected = figma.currentPage.selection;

  if (selected.length === 0) {
    figma.notify("Please select icons");
    return;
  }

  selected.forEach((frame: any) => {
    let cloneFrame = figma.createFrame();
    cloneFrame.backgrounds = [];
    cloneFrame.name = frame.name;
    cloneFrame.resize(frame.width, frame.height);

    frame.children.forEach(child => {
      if (child.visible) {
        cloneFrame.relativeTransform = child.relativeTransform;
        clone(child, cloneFrame);
      }
    });

    cloneFrame.children.forEach(child => {
      figma.flatten([child]);
    });

    let unionSVG = figma.union([cloneFrame], figma.currentPage);
    let childrenGroup = figma.group(cloneFrame.children, cloneFrame);
    let groupPosition = {
      x: childrenGroup.x,
      y: childrenGroup.y
    };

    let exportContainer = figma.createFrame();
    exportContainer.resize(cloneFrame.width, cloneFrame.height);
    exportContainer.backgrounds = [];
    exportContainer.appendChild(unionSVG);
    unionSVG.x = groupPosition.x;
    unionSVG.y = groupPosition.y;

    exportContainer.exportAsync({ format: "SVG" }).then(result => {
      let svgString = String.fromCharCode.apply(null, result);

      svgStrings.push(svgString);

      exportContainer.remove();
    });
  });
  return;
};

////////////////////////////////////////////////////////////////
///////////////////// ON SELECTION CHANGE //////////////////////
////////////////////////////////////////////////////////////////

figma.on("selectionchange", () => {
  let selected = figma.currentPage.selection;
  figma.ui.postMessage({
    type: "selected-amount",
    data: selected.length
  });
});

////////////////////////////////////////////////////////////////
///////////////////////// ON MESSAGE ///////////////////////////
////////////////////////////////////////////////////////////////

figma.ui.onmessage = async msg => {
  if (msg.type === "preview") {
    await convertIcons();
    figma.ui.postMessage({
      type: "svg-strings",
      data: svgStrings
    });
    svgStrings = [];
  }
};
