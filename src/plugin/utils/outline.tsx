const outline = child => {
  if (child.strokes.length > 0) {
    return child.outlineStroke();
  } else {
    return child.clone();
  }
};

export default outline;
