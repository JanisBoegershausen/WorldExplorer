// Get a valid parent type for a child type
function GetRandomValidParentType(childType) {
    var allValidParentTypes = [];
    Object.entries(settings.validChildTypes).forEach(([parentType, validChildTypes]) => {
        if(validChildTypes.includes(childType)) {
            allValidParentTypes.push(parentType);
        }
     });
     var type = allValidParentTypes[Math.floor(random(0, allValidParentTypes.length))];

     if(type == null) {
         console.error("No valid parent type found for " + childType + "!");
     }

     return type;
}

// Get a valid child type for a parent type
function GetRandomValidChildType(parentType) {
    var allValidChildTypes = settings.validChildTypes[parentType];
    return allValidChildTypes[Math.floor(random(0, allValidChildTypes.length))]
}

// Generate a new parent for the given entiy and set all needed references
function GenerateParent(entity) {
    var parentType = GetRandomValidParentType(entity.type);
    if(parentType != null)
        entity.parent = "[" + GenerateEntityByType(parentType, GetSeedFromSeed(entity.seed - 1), null, ["[" + entity.id + "]"]).id + "]";
    else
        entity.parent = "Void";
}

// Generate random children for the given entity and set all needed references
function GenerateChildren(entity) {
    if(entity.children == null) {
        entity.children = [];
    }
    for (let i = 0; i < Math.floor(SeededRandom(entity.seed) * 10); i++) {
        var type = GetRandomValidChildType(entity.type);
        if(type != null) {
            var generatedChild = GenerateEntityByType(type, GetSeedFromSeed(entity.seed + entity.children.length), entity);
            if(generatedChild != null) {
                entity.children.push("[" + generatedChild.id + "]");
                generatedChild.parent = "[" + entity.id + "]";
            }
        }
    }
    if(entity.children == null) 
        entity.children = "None";


    entity["_hasGeneratedChildren"] = true;
}

function GenerateEntityByType(type, seed, parent, children) {
    if(type == "planet") {
        return GeneratePlanet(seed, parent, children);
    } else if(type == "star system") {
        return GenerateStarSystem(seed, parent, children);
    } else if(type == "continent") {
        return GenerateContinent(seed, parent, children);
    } else {
        console.error("The enetity type " + type + " does not exist!");
    }
}

function GeneratePlanet(seed, parent, children) {
    var planet = {
        id: "PLANET_" + seed,
        seed: seed,
        type: "planet",
        displayName: GetRandomWord(2).toUpperCase() + "-" + GetRandomWord(1) + seed,
        parent: parent,
        children: children,
        _hasGeneratedChildren: false
    }
    entities[planet.id] = planet;
    return planet;
}

function GenerateStarSystem(seed, parent, children) {
    var entity = {
        id: "STARSYSTEM_" + seed,
        seed: seed,
        type: "star system",
        displayName: "System - " + GetRandomWord(2) + seed,
        parent: parent,
        children: children,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}

function GenerateContinent(seed, parent, children) {
    var entity = {
        id: "CONTINENT_" + seed,
        seed: seed,
        type: "continent",
        displayName: GetRandomWord(random(4, 10)),
        parent: parent,
        children: children,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}