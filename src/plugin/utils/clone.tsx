import { ungroup, outline } from "./";

const clone = (frame, parent) => {
  if (frame.visible) {
    if (frame.type === "INSTANCE") {
      frame.children.forEach(child => {
        clone(child, parent);
      });
    } else if (frame.type === "GROUP") {
      ungroup(frame, parent);
    } else {
      // console.log(frame.name);
      outline(frame).map(item => {
        parent.appendChild(item);
      });
    }
  }
};

export default clone;
