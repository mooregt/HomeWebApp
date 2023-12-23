/**
 * Retrieves an array of items from the server.
 * @param {string} itemsEndpoint 
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
 * Posts an item to the server for addition or removal
 * @param {string} itemsEndpoint 
 * @param {*} item
 */
function PostItemToServer(itemsEndpoint, item) {
  console.log(item);
  fetch(itemsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item }),
  })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}

function PostMealToServer(itemsEndpoint, item, day) {
  fetch(itemsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item, day }),
  })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
}