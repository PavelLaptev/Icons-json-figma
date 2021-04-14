import { outline } from "./";

const ungroup = (group, parent) => {
  if (!group.children) return;

  return group.children.map(child => {
    let outlinedChild = outline(child);
    parent.appendChild(outlinedChild);
    // set absolute position
    outlinedChild.x = outlinedChild.x + parent.x;
    outlinedChild.y = outlinedChild.y + parent.y;
  });
};

export default ungroup;
