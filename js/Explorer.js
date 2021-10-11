var settings = {
  dataUrl: "https://janisboegershausen.github.io/WorldExplorer/data/",
};

// Refferences
var listParent;
var header;

var entities = {};

function setup() {
  header = document.getElementById("entity-name");
  listParent = document.getElementById("entity-property-list");

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

// Returns the entity with the given id if it exists in the database
function GetEntityById(id) {
  return entities[id];
}

// Displays the properties of the given entity on screen
function DisplayEntity(entity) {
  // Set header to the entity name
  header.innerHTML = entity.displayName;

  // Get all property keys of the entity
  var propertyKeys = Object.keys(entity);

  // Delete all previous properties that are displayed on the page
  listParent.childNodes.forEach(childNode => {
    listParent.removeChild(childNode);
  });

  // Show all properties of the entity
  propertyKeys.forEach((propertyKey) => {
    console.log(propertyKey + ": " + entity[propertyKey]);
    AddPropertyDisplayToPage(propertyKey, entity[propertyKey]);
  });
}

// Adds a property (label: value) to the bottom of the property list
function AddPropertyDisplayToPage(label, value) {
  var div = document.createElement("div");
  
  // Add html code to the div
  div.innerHTML = "<p>" + label + ": " + value + "</p>";

  // Parent the created div under the list parent
  listParent.appendChild(div);
}
