var settings = {
  dataUrl: "https://janisboegershausen.github.io/WorldExplorer/data/",
};

var database;

function setup() {
  
}

// Load the database from the database.json file
function LoadDatabase() {

  // Get path to json file
  var databaseUrl = dataUrl + "database.json";

  // Create and send the request to read the file
  var fileListRequest = new XMLHttpRequest();
  fileListRequest.open("GET", databaseUrl, true);
  fileListRequest.send(null);

  // Once the file was recieved, save the json data into the variable
  fileListRequest.onreadystatechange = function () {
    if (fileListRequest.readyState === 4 && fileListRequest.status === 200) {
      database = JSON.parse(fileListRequest.responseText);
    }
  }
}

function GetEntityById(id) {
  return database[id];
}