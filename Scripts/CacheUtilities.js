/**
 * Retrieves an array of items from the cache.
 * @param {string} key identifier of cache.
 * @returns {JSON} The items retrieved from cache.
 */
function GetItemsFromCache(key) {
  const cachedItems = localStorage.getItem(key);

  if (cachedItems) {
    return JSON.parse(cachedItems);
  }
}

/**
 * Saves an array of items to the cache without persisting existing cache.
 * @param {string} key identifier of cache.
 * @param {JSON} items to save to cache.
 */
function SaveItemsToCache(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

/**
 * Adds an item to the existing cache.
 * @param {string} key identifier of cache.
 * @param {JSON} item to add to cache.
 */
function AddItemToCache(key, item) {
  var cachedItems = GetItemsFromCache(key)
  cachedItems.push(item);
  localStorage.setItem(key, JSON.stringify(cachedItems));
}