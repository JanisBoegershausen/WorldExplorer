var settings = {
  entityPath: "../Data/",
};

var entities = [];

function setup() {
  LoadAllEntities();
}

function LoadAllEntities() {
  entities = [];
  var entityJsonFiles = [];

  var requestUrl = "https://api.github.com/repos/JanisBoegershausen/WorldExplorer/git/trees/master?recursive=1";
  var fileListRequest = new XMLHttpRequest();

  fileListRequest.open("GET", requestUrl, true);
  fileListRequest.send(null);

  var fileTree;

  fileListRequest.onreadystatechange = function () {
    if (fileListRequest.readyState === 4 && fileListRequest.status === 200) {
      fileTree = JSON.parse(fileListRequest.responseText).tree;

      fileTree.forEach((fileEntry) => {
        if (fileEntry.type == "blob" && fileEntry.path.substring(0, 14) == "data/entities/") {
          entityJsonFiles.push(fileEntry);
        }
      });

      entityJsonFiles.forEach((entityJsonFile) => {
        var entityJsonRequest = new XMLHttpRequest();
        entityJsonRequest.open("GET", "https://janisboegershausen.github.io/WorldExplorer/" + entityJsonFile.path, true);
        entityJsonRequest.send(null);

        entityJsonRequest.onreadystatechange = function () {
          if (fileListRequest.readyState === 4 && fileListRequest.status === 200) {
            entities.push(JSON.parse(fileListRequest.responseText));
          }
        };
      });

      console.log(entityJsonFiles);
    }
  };
}
