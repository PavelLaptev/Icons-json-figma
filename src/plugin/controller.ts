////////////////////////////////////////////////////////////////
///////////////////////// UI AND DATA //////////////////////////
////////////////////////////////////////////////////////////////

// UI
figma.showUI(__html__, { width: 280, height: 350 });

////////////////////////////////////////////////////////////////
////////////////////////// FUNCTIONS ///////////////////////////
////////////////////////////////////////////////////////////////

const outlineAll = child => {
  if (child.strokes.length > 0) {
    return child.outlineStroke();
  } else {
    return child.clone();
  }
};

const ungroup = (group, parent) => {
  if (!group.children) return;

  return group.children.map(child => {
    let outlinedChild = outlineAll(child);
    parent.appendChild(outlinedChild);
    // set absolute position
    outlinedChild.x = outlinedChild.x + parent.x;
    outlinedChild.y = outlinedChild.y + parent.y;
  });
};

const cloneChildren = (frame, parent) => {
  if (frame.visible) {
    if (frame.type === "INSTANCE") {
      frame.children.forEach(child => {
        cloneChildren(child, parent);
      });
    } else if (frame.type === "GROUP") {
      ungroup(frame, parent);
    } else {
      parent.appendChild(outlineAll(frame));
    }
  }
};

const convertIcons = () => {
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
        cloneFrame.relativeTransform = child.relativeTransform;
        cloneChildren(child, cloneFrame);
      }
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
