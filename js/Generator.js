// Get a valid parent type for a child type
function GetRandomValidParentType(childType) {
    var allValidParentTypes = [];
    Object.entries(settings.validChildTypes).forEach(([parentType, validChildTypes]) => {
        if (validChildTypes.includes(childType)) {
            allValidParentTypes.push(parentType);
        }
    });
    var type = allValidParentTypes[Math.floor(random(0, allValidParentTypes.length))];

    if (type == null) {
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
    if (parentType != null)
        entity.parent = "[" + GenerateEntityByType(parentType, GetSeedFromSeed(entity.seed - 1), null, ["[" + entity.id + "]"]).id + "]";
    else
        entity.parent = "Void";
}

// Generate random children for the given entity and set all needed references
function GenerateChildren(entity) {
    if (entity.children == null) {
        entity.children = [];
    }
    for (let i = 0; i < Math.floor(SeededRandom(entity.seed) * 10); i++) {
        var type = GetRandomValidChildType(entity.type);
        if (type != null) {
            var generatedChild = GenerateEntityByType(type, GetSeedFromSeed(entity.seed + entity.children.length), entity, []);
            if (generatedChild != null) {
                entity.children.push("[" + generatedChild.id + "]");
                generatedChild.parent = "[" + entity.id + "]";
            }
        }
    }
    if (entity.children == null)
        entity.children = "None";


    entity["_hasGeneratedChildren"] = true;
}

function GenerateEntityByType(type, seed, parentId, childrenIds) {
    switch (type) {
        case "Planet":
            return GeneratePlanet(seed, parentId, childrenIds);
        case "Star System":
            return GenerateStarSystem(seed, parentId, childrenIds);
        case "Landmass":
            return GenerateLandmass(seed, parentId, childrenIds);
        case "Settlement":
            return GenerateSettlement(seed, parentId, childrenIds);
        default:
            console.error("The enetity type " + type + " does not exist!");
            break;
    }
}

function GeneratePlanet(seed, parentId, childrenIds) {
    var planet = {
        id: "PLANET_" + seed,
        seed: seed,
        type: "Planet",
        displayName: GetRandomWord(2).toUpperCase() + "-" + GetRandomWord(1) + seed,
        parent: parentId,
        children: childrenIds,
        _hasGeneratedChildren: false
    }
    entities[planet.id] = planet;
    return planet;
}

function GenerateStarSystem(seed, parentId, childrenIds) {
    var entity = {
        id: "STARSYSTEM_" + seed,
        seed: seed,
        type: "Star System",
        displayName: "System - " + GetRandomWord(2) + seed,
        parent: parentId,
        children: childrenIds,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}

function GenerateLandmass(seed, parentId, childrenIds) {
    var entity = {
        id: "LANDMASS_" + seed,
        seed: seed,
        type: "Landmass",
        displayName: GetRandomWord(random(4, 10)),
        parent: parentId,
        children: childrenIds,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}

function GenerateSettlement(seed, parentId, childrenIds) {
    var entity = {
        // General properties:
        id: "SETTLEMENT_" + seed,
        seed: seed,
        type: "Settlement",
        displayName: GetRandomWord(SeededRandom(seed) * 6 + 4),
        parent: parentId,
        children: childrenIds,
        _hasGeneratedChildren: true,
        // Settlement specific properties:
        inhabitantCount: floor(SeededRandom(seed + 1) * 1000),
    }

    if (entity.children == null) { entity.children = []; }

    // Generate Houses
    var houseCount = floor(SeededRandom(seed + 2) * entity.inhabitantCount * 0.4) + 3;
    for (let i = 0; i < houseCount; i++) {
        var building = GenerateBuilding(GetSeedFromSeed(seed + houseCount + i), "[" + entity.id + "]", []);
        building.displayName = "Building " + (i + 1);
        entity.children.push("[" + building.id + "]");
        building._hasGeneratedChildren = true;
    }

    // Generate inhabitants
    var i = 0;
    while (i < entity.inhabitantCount) {
        // Pick a building to live in
        var building = GetEntityById(entity.children[floor(SeededRandom(seed + entity.inhabitantCount + i) * houseCount)]);
        var inhabitant = GenerateLifeForm(GetSeedFromSeed(seed + entity.inhabitantCount + i), "[" + building.id  + "]", []);
        building.children.push("[" + inhabitant.id + "]");

        i++;
    }



    entities[entity.id] = entity;
    return entity;
}

function GenerateBuilding(seed, parentId, childrenIds) {
    var entity = {
        id: "BUILDING_" + seed,
        seed: seed,
        type: "Building",
        displayName: "Building: " + seed,
        parent: parentId,
        children: childrenIds,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}

function GenerateLifeForm(seed, parentId, childrenIds) {
    var entity = {
        id: "LIFEFORM_" + seed,
        seed: seed,
        type: "LifeForm",
        displayName: GetRandomWord(random(2, 6)) + " " + GetRandomWord(random(6, 14)),
        parent: parentId,
        children: childrenIds,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}