/**
 * Retrieves an array of items from the server.
 * @param {string} type of item to be retrieved.
 * @returns {JSON} The items retrieved from the server.
 */
async function GetItemsFromServer(type) {
  try {
    const response = await fetch('/getItems?type=' + type);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const items = await response.json();
    
    return items;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Posts items to the server for addition or removal
 * @param {string} itemsEndpoint server endpoint to be called.
 * @param {string} type of item to be added or removed.
 * @param {object} item to be posted to server.
 */
function PostItemToServer(itemsEndpoint, type, item) {
  fetch(itemsEndpoint + '?type=' + type, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}