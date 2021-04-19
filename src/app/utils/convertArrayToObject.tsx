const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item.data
    };
  }, initialValue);
};

export default convertArrayToObject;
