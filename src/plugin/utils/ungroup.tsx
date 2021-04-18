import outline from "./outline";

const ungroup = (group, parent) => {
  if (!group.children) return;

  group.children.forEach(child => {
    let outlinedChildren = outline(child, parent);
    console.log(outlinedChildren);

    // parent.appendChild(outlinedChildren);
    // set absolute position
    // outlinedChildren.forEach(child => {
    //   parent.appendChild(child);

    //   child.x = child.x + parent.x;
    //   child.y = child.y + parent.y;
    // });
  });
};

export default ungroup;
