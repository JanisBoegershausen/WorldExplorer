var settings = {
  dataUrl: "https://janisboegershausen.github.io/WorldExplorer/data/",
};

var entities = {};

function setup() {
  LoadEntityDatabase();
}

// Load the database from the database.json file and store the result in the entities dict
function LoadEntityDatabase() {
  // Get path to the database.json file, which is a dict of all ids and their relative file paths
  var databaseUrl = settings.dataUrl + "database.json";

  // Create and send the request to read the file
  var fileListRequest = new XMLHttpRequest();
  fileListRequest.open("GET", databaseUrl, true);
  fileListRequest.send(null);

  // Once the file was recieved, do the following
  fileListRequest.onreadystatechange = function () {
    if (fileListRequest.readyState === 4 && fileListRequest.status === 200) {
      // Parse the filedatabase to an object
      var fileDatabase = JSON.parse(fileListRequest.responseText);
      // Get all keys and therefor the ids of all entities in the database
      var entityIds = Object.keys(fileDatabase);
      // Foreach entity id, save the id along with its entity in the entities variable
      entityIds.forEach((entityId) => {
        // Send a request to read the entities file
        var entityRequest = new XMLHttpRequest();
        entityRequest.open("GET", settings.dataUrl + fileDatabase[entityId], true);
        entityRequest.send(null);

        // Once the file was recieved, save the json data into the entites variable
        entityRequest.onreadystatechange = function () {
          if (entityRequest.readyState === 4 && entityRequest.status === 200) {
            entities[entityId] = JSON.parse(entityRequest.responseText);
          }
        };
      });
    }
  };
}

function GetEntityById(id) {
  return entities[id];
}