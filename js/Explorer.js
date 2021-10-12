var settings = {
  dataUrl: "https://janisboegershausen.github.io/WorldExplorer/data/",
};

// Refferences
var listParent;
var header;

var entities = {};

function setup() {
  // Get refferences to dom elements
  header = document.getElementById("entity-name");
  listParent = document.getElementById("entity-property-list");

  LoadEntityDatabase();
}

// Returns the entity with the given id if it exists in the database
function GetEntityById(id) {
  return entities[id];
}

// Displays the entity with the given id on the screen
function DisplayEntityById(entityId) {
  var entity = GetEntityById(entityId);
  if(entity != null) {
    DisplayEntity(entity);
  }
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

  // Generate the actuall innerHtml for the property entry
  var labelHtml = `<p style="width: 25%;">` + label.charAt(0).toUpperCase() + label.substring(1) + ": " + "</p>";
  var valueHtml = `<p style="width: 75%;">` + ParsePropertyValueToHtml(value) + "</p>";
  div.innerHTML = labelHtml + valueHtml;

  // Parent the created div under the list parent
  listParent.appendChild(div);
}

// Returns html code for the given property value, propperly including links
function ParsePropertyValueToHtml(valueString) {
  var htmlString = valueString;

  var i = 0; // Limit to avoid infinit loop in case of an error
  while(htmlString.includes("[") && i < 100) {
    i += 1;

    // Extract needed data and indecies from string
    var startIndex = htmlString.search('\\[');
    var endIndex = htmlString.search('\\]');
    var linkId = htmlString.substring(startIndex + 1, endIndex);

    // Generate html
    var onClickEventHtml = ` class="entity-link" onclick="DisplayEntityById('` + linkId + `')"`;
    var linkHtml = `<a` + onClickEventHtml + `>` + GetEntityById(linkId).displayName + `</a>`

    // Place html into the output string
    htmlString = htmlString.substring(0, startIndex) + linkHtml + htmlString.substring(endIndex + 1);
  }

  return htmlString;
}