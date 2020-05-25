export const getItemFromStorage = key =>{
  const value = localStorage.getItem(key);
  return value ? value.toString() : '';
};

export const setItemFromStorage = (key, value) => {
  localStorage.setItem(key, value);
};

export const removeItemFromStorage = key => {
  localStorage.removeItem(key);
};

export const clearStorage = () => {
  localStorage.clear();
};
