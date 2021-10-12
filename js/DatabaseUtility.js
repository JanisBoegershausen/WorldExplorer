// Request the content of the given url and returns the request
function GetJsonTextByRequest(url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.send(null);
  return request;
}

// Load a json as an entity and store it by the given entityId
function LoadEntityFromUrl(entityId, urlToJson) {
  // Send a request to read the entities file
  var entityRequest = GetJsonTextByRequest(urlToJson);

  // Once the file was recieved, save the json data into the entites variable
  entityRequest.onreadystatechange = function () {
    if (entityRequest.readyState === 4 && entityRequest.status === 200) {
      entities[entityId] = JSON.parse(entityRequest.responseText);
    }

    // Show all existing entites below the searchbar for testing
    UpdateSearchPreview("");
  };
}

// Load all entities from the database.json file and store the result in the entities dict
function LoadEntityDatabase() {
  // Get url to the database.json file, which is a dict of all ids and their relative file paths
  var databaseUrl = settings.dataUrl + "database.json";

  // Request the content of the database.json file
  var fileListRequest = GetJsonTextByRequest(databaseUrl);

  // Once the file was recieved, do the following
  fileListRequest.onreadystatechange = function () {
    if (fileListRequest.readyState === 4 && fileListRequest.status === 200) {
      // Parse the file-database to an object
      var fileDatabase = JSON.parse(fileListRequest.responseText);
      // Get all keys and therefore the ids of all entities in the database
      var entityIds = Object.keys(fileDatabase);

      // Foreach entity id, save the id along with its entity in the entities variable
      entityIds.forEach((entityId) => {
        LoadEntityFromUrl(entityId, settings.dataUrl + fileDatabase[entityId]);
      });
    }
  };
}
