const outline = item => {
  if (
    (item.strokes && item.strokes.length > 0 && !item.fills) ||
    item.fills.length === 0
  ) {
    return [item.outlineStroke()] as Array<any>;
  } else if (
    item.strokes &&
    item.strokes.length > 0 &&
    item.fills &&
    item.fills.length > 0
  ) {
    let fills: Array<object> = item.fills.filter(fill => fill.visible === true);

    if (fills.length > 0) {
      return [item.outlineStroke(), item.clone()];
    }
    return [item.outlineStroke()] as Array<any>;
  } else if (
    !item.strokes ||
    (item.strokes.length === 0 && item.fills && item.fills.length > 0)
  ) {
    return [item.clone()] as Array<any>;
  }
};

export default outline;
