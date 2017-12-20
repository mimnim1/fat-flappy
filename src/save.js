const save = {
  mute: false,
  bestScore: 0,
  lastScore: 0,
};

const storage = window.localStorage;
const prefix = 'FatFlappy';

// Load the save
(function() {
  // check each key seperately for undefined in case of previous storage
  for (const key in save) {
    const loadedVal = storage.getItem(prefix + key);

    if (loadedVal !== null) {
      save[key] = JSON.parse(loadedVal);
    }
  }
})();

// Save function
function saveToStore(key) {
  const valToSave = save[key];

  storage.setItem(prefix + key, JSON.stringify(valToSave));
}

// Define the exports
const api = {};

for (const key in save) {
  Object.defineProperty(api, key, {
    get: () => save[key],
    set: (value) => {
      save[key] = value;
      saveToStore(key);
    }
  });
}

export default api;
