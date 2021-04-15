const outline = item => {
  if (
    (item.strokes && item.strokes.length > 0 && !item.fills) ||
    item.fills.length === 0
  ) {
    return [item.outlineStroke()];
  } else if (
    item.strokes &&
    item.strokes.length > 0 &&
    item.fills &&
    item.fills.length > 0
  ) {
    return [item.outlineStroke(), item.clone()];
  } else if (
    !item.strokes ||
    (item.strokes.length === 0 && item.fills && item.fills.length > 0)
  ) {
    console.log(item.strokes.length, item.fills.length);
    return [item.clone()];
  }
};

export default outline;
