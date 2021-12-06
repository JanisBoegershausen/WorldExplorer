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
  searchString = searchString.toLowerCase();

  // Get a list of all entity ids
  var entityIds = Object.keys(entities);
  var matching = [];

  // Check all entities and remember all that match the searchstring
  if (searchString != "") {
    for (let i = 0; i < entityIds.length; i++) {
      var matchingId = entityIds[i].toLowerCase().includes(searchString);
      var matchingDisplayName = GetEntityById(entityIds[i]).displayName.toLowerCase().includes(searchString);
      if (matchingId || matchingDisplayName) {
        matching.push(GetEntityById(entityIds[i]));
      }
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
    div.innerHTML = `<searchSuggestion onclick="DisplayEntityById('` + sugestion.id + `')">` + sugestion.displayName + "</searchSugestion>";

    // Parent the created div under the list parent
    searchSuggestionParent.appendChild(div);
  });
}

function ClearSearchBarSuggestions() {
  // Get the string typed into the search bar
  var searchSuggestionParent = document.getElementById("search-suggestion-parent");

  // Delete all previous suggestions that are displayed
  while (searchSuggestionParent.childNodes.length > 0) {
    searchSuggestionParent.removeChild(searchSuggestionParent.childNodes[0]);
  }
}