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
    cloneFrame.name = frame.name;
    cloneFrame.resize(frame.width, frame.height);

    frame.children.forEach(child => {
      if (child.visible) {
        console.log(child);
        // cloneFrame.relativeTransform = child.relativeTransform;
        cloneFrame.x = child.x;
        cloneFrame.y = child.y;
        clone(child, cloneFrame);
        // console.log(cloneFrame.children);
      }
    });

    // let childrenGroup = figma.group(cloneFrame.children, cloneFrame);

    // let frameProps = {
    //   rotation: cloneFrame.rotation,
    //   width: cloneFrame.width,
    //   height: cloneFrame.height
    // };

    // let unionSVG = figma.union([cloneFrame], figma.currentPage);
    // unionSVG.rotation = -frameProps.rotation;

    // let exportContainer = figma.createFrame();
    // exportContainer.resize(frameProps.width, frameProps.height);
    // exportContainer.backgrounds = [];
    // let flattenSVG = figma.flatten(cloneFrame.children);
    figma.flatten(cloneFrame.children);
    // console.log()
    // exportContainer.appendChild(flattenSVG);

    // unionSVG.x = groupPosition.x;
    // unionSVG.y = groupPosition.y;

    cloneFrame.exportAsync({ format: "SVG" }).then(result => {
      let svgString = String.fromCharCode.apply(null, result);

      svgStrings.push(svgString);

      // exportContainer.remove();
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
