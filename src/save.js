const save = {
    bestScore: 0,
    lastScore: 0,
};

const storage = window.localStorage;

// Load the save
(function() {
  // check each key seperately for undefined in case of previous storage
  for (const key in save) {
    const loadedVal = storage.getItem(key);

    if (!loadedVal === null) {
      save[key] = JSON.parse(loadedVal);
    }
  }
})();

// Save function
function saveToStore(key) {
  const valToSave = save[key];

  storage.setItem(key, JSON.stringify(valToSave));
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

module.exports = api;
