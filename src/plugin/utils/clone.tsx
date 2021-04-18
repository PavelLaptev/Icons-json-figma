import { outline } from "./";

const clone = (frame, parent) => {
  if (frame.visible) {
    if (frame.type === "INSTANCE") {
      frame.children.forEach(child => {
        clone(child, parent);
      });
    } else {
      console.log(frame.name);
      outline(frame, parent);
    }
  }
};

export default clone;
