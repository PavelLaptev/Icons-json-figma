import { clone } from "./utils";

////////////////////////////////////////////////////////////////
///////////////////////// UI AND DATA //////////////////////////
////////////////////////////////////////////////////////////////

// UI
figma.showUI(__html__, { width: 280, height: 350 });

////////////////////////////////////////////////////////////////
////////////////////////// FUNCTIONS ///////////////////////////
////////////////////////////////////////////////////////////////

const convertIcons = () => {
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

    cloneFrame.exportAsync({ format: "SVG" }).then(result => {
      let svgString = String.fromCharCode.apply(null, result);

      figma.ui.postMessage({
        type: "svg-string",
        data: svgString
      });

      cloneFrame.remove();
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
    convertIcons();
  }
};
