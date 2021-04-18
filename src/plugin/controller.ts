// import { outline } from "./utils";

////////////////////////////////////////////////////////////////
///////////////////////// UI AND DATA //////////////////////////
////////////////////////////////////////////////////////////////

// UI
figma.showUI(__html__, { width: 320, height: 420 });

// ////////////////////////////////////////////////////////////////
// ////////////////////////// FUNCTIONS ///////////////////////////
// ////////////////////////////////////////////////////////////////
let svgStrings = [];
// let svgErrors = [];

const isNode = (c: BaseNode): c is InstanceNode =>
  c.type === "INSTANCE" ||
  c.type === "FRAME" ||
  c.type === "COMPONENT" ||
  c.type === "GROUP";

const postMsg = (type, data) =>
  figma.ui.postMessage({
    type: type,
    data: data
  });

const cloneFrame = ref => {
  let clone = figma.createFrame();
  clone.name = ref.name;
  clone.fills = ref.fills;
  clone.resize(ref.width, ref.height);
  clone.x = ref.x;
  clone.y = ref.y;
  clone.rotation = ref.rotation;
  return clone;
};

const detachAndUnion = (page: PageNode) => {
  const selection = page.selection.map(c => c.clone());
  const frameClones = selection.map(c => cloneFrame(c));

  selection.filter(isNode).forEach((c, i) => figma.union([c], frameClones[i]));

  return frameClones as Array<FrameNode>;
};

const convertIcons = async () => {
  const nodes = detachAndUnion(figma.currentPage);

  await nodes.forEach(c =>
    c.exportAsync({ format: "SVG" }).then(result => {
      let svgString = String.fromCharCode.apply(null, result);
      let rawSVGNode = figma.createNodeFromSvg(svgString) as FrameNode;
      figma.flatten([figma.union(rawSVGNode.children, rawSVGNode)]);

      rawSVGNode.exportAsync({ format: "SVG" }).then(result => {
        svgStrings.push({
          name: c.name,
          data: String.fromCharCode.apply(null, result)
        } as svgStringObject);

        c.remove();
        rawSVGNode.remove();
      });
    })
  );
};

// ////////////////////////////////////////////////////////////////
// ///////////////////// ON SELECTION CHANGE //////////////////////
// ////////////////////////////////////////////////////////////////

figma.on("selectionchange", () => {
  let selected = figma.currentPage.selection;
  postMsg("selected-amount", selected.length);
});

// ////////////////////////////////////////////////////////////////
// ///////////////////////// ON MESSAGE ///////////////////////////
// ////////////////////////////////////////////////////////////////

figma.ui.onmessage = async msg => {
  if (msg.type === "preview") {
    // postMsg("svg-errors", []);
    // svgErrors = [];
    await convertIcons().then(() => {
      postMsg("svg-strings", svgStrings);
      //
      svgStrings = [];
    });
  }
};
