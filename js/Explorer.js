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

          // Show all existing entites below the searchbar for testing
          UpdateSearchPreview("");
        };
      });
    }
  };
}

// Returns the entity with the given id if it exists in the database
function GetEntityById(id) {
  return entities[id];
}

function DisplayEntityById(entityId) {
  DisplayEntity(GetEntityById(entityId));
}

// Displays the properties of the given entity on screen
function DisplayEntity(entity) {
  // Set header to the entity name
  header.innerHTML = entity.displayName;

  // Get all property keys of the entity
  var propertyKeys = Object.keys(entity);

  // Delete all previous properties that are displayed on the page
  while (listParent.childNodes.length > 0) {
    console.log(listParent.childNodes[0]);
    listParent.removeChild(listParent.childNodes[0]);
  }

  // Show all properties of the entity
  propertyKeys.forEach((propertyKey) => {
    console.log(propertyKey + ": " + entity[propertyKey]);
    AddPropertyDisplayToPage(propertyKey, entity[propertyKey]);
  });
}

// Adds a property (label: value) to the bottom of the property list
function AddPropertyDisplayToPage(label, value) {
  // Create div with display:flex for horizontal layouting
  var div = document.createElement("div");
  div.style = "display:flex";

  // If the value is a link to an entity, add an onClick to display that entity
  var isLinkToEntity = value[0] == "[";
  var linkedEntityId = value.substring(1, value.length - 1);
  var onClick = ` class="entity-link" onclick="DisplayEntityById('` + linkedEntityId + `')"`;

  // Generate the actuall innerHtml
  var labelHtml = `<p style="width: 50%;">` + label + ": " + "</p>";
  var valueHtml = `<p style="width: 50%;"` + (isLinkToEntity ? onClick : "") + ">" + (isLinkToEntity ? GetEntityById(linkedEntityId).displayName : value) + "</p>";
  div.innerHTML = labelHtml + valueHtml;

  // Parent the created div under the list parent
  listParent.appendChild(div);
}

// Called on keyUp of the search bar
function HandleSearchBarChange(searchBarElement) {
  if (event.key === "Enter") {
    DisplayEntity(SearchEntities(searchBarElement.value)[0]);
  } else {
    UpdateSearchPreview(searchBarElement.value);
  }
}

// Returns all entities with an id that contains the searchstring
function SearchEntities(searchString) {
  // Get a list of all entity ids
  var entityIds = Object.keys(entities);
  var matching = [];

  // Check all entities and remember all that match the searchstring
  for (let i = 0; i < entityIds.length; i++) {
    if (entityIds[i].toLowerCase().includes(searchString.toLowerCase()) == true) {
      matching.push(GetEntityById(entityIds[i]));
    }
  }

  // TODO: Sort by simmilarity
  return matching;
}

function UpdateSearchPreview(searchString) {
  // Get the string typed into the search bar
  var searchSuggestionParent = document.getElementById("search-suggestion-parent");

  // Delete all previous suggestions that are displayed
  while (searchSuggestionParent.childNodes.length > 0) {
    searchSuggestionParent.removeChild(searchSuggestionParent.childNodes[0]);
  }

  // Get all matching search results which will me suggested
  var suggestions = SearchEntities(searchString ? searchString : "");

  // Show all suggestions below the searchbar
  suggestions.forEach((sugestion) => {
    // Create div that holds the suggestion
    var div = document.createElement("div");
    div.style = "display:flex";

    // Generate the actuall innerHtml that shows the suggestion and loads it onClick
    div.innerHTML = `<searchSuggestion onclick="DisplayEntityById('` + sugestion.id + `')">` + sugestion.id + "</searchSugestion>";

    // Parent the created div under the list parent
    searchSuggestionParent.appendChild(div);
  });
}
