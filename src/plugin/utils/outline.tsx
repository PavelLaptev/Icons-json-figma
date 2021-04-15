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
    let fills = item.fills.filter(fill => fill.visible === true);
    if (fills.lenght > 0) {
      return [item.outlineStroke(), item.clone()];
    }
    return [item.outlineStroke()];
  } else if (
    !item.strokes ||
    (item.strokes.length === 0 && item.fills && item.fills.length > 0)
  ) {
    return [item.clone()];
  }
};

export default outline;
