/**
 * Retrieves an array of items from the cache.
 * @param {string} itemsName 
 * @returns {JSON} The items retrieved from cache.
 */
function GetItemsFromCache(itemsName) {
  const storedItems = localStorage.getItem(itemsName);

  if (storedItems) {
    return JSON.parse(storedItems);
  }
}

/**
 * Saves an array of items to the cache.
 * @param {string} itemsName
 * @param {JSON} items
 */
function SaveItemsToCache(itemsName, items) {
  localStorage.setItem(itemsName, JSON.stringify(items));
}

/**
 * Adds a single item to the cache.
 * @param {string} itemsName
 * @param {string} item
 */
function AddItemToCache(itemsName, item) {
  var items = GetItemsFromCache(itemsName)
  items.push({_id: "", name: item});
  localStorage.setItem(itemsName, JSON.stringify(items));
}