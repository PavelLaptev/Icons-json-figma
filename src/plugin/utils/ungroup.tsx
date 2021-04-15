import outline from "./outline";

const ungroup = (group, parent) => {
  if (!group.children) return;

  return group.children.map(child => {
    let outlinedChild = outline(child)[0];
    parent.appendChild(outlinedChild);
    // set absolute position
    outlinedChild.x = outlinedChild.x + parent.x;
    outlinedChild.y = outlinedChild.y + parent.y;
  });
};

export default ungroup;
