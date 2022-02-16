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

function GenerateEntityByType(type, seed, parent, children) {
    switch (type) {
        case "Planet":
            return GeneratePlanet(seed, parent, children);
        case "Star System":
            return GenerateStarSystem(seed, parent, children);
        case "Landmass":
            return GenerateLandmass(seed, parent, children);
        case "Settlement":
            return GenerateSettlement(seed, parent, children);
        default:
            console.error("The enetity type " + type + " does not exist!");
            break;
    }
}

function GeneratePlanet(seed, parent, children) {
    var planet = {
        id: "PLANET_" + seed,
        seed: seed,
        type: "Planet",
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
        type: "Star System",
        displayName: "System - " + GetRandomWord(2) + seed,
        parent: parent,
        children: children,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}

function GenerateLandmass(seed, parent, children) {
    var entity = {
        id: "LANDMASS_" + seed,
        seed: seed,
        type: "Landmass",
        displayName: GetRandomWord(random(4, 10)),
        parent: parent,
        children: children,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}

function GenerateSettlement(seed, parent, children) {
    var entity = {
        // General properties:
        id: "SETTLEMENT_" + seed,
        seed: seed,
        type: "Settlement",
        displayName: GetRandomWord(SeededRandom(seed) * 6 + 4),
        parent: parent,
        children: children,
        _hasGeneratedChildren: true,
        // Settlement specific properties:
        inhabitantCount: floor(SeededRandom(seed + 1) * 1000),
    }

    if (entity.children == null) { entity.children = []; }

    // Generate Houses
    var houseCount = floor(SeededRandom(seed + 2) * entity.children.length * 0.4) + 3;
    for (let i = 0; i < houseCount; i++) {
        entity.children.push("[" + GenerateBuilding(GetSeedFromSeed(seed + houseCount + i), entity, []).id + "]");
    }

    // Generate inhabitants
    var i = 0;
    while (i < entity.inhabitantCount) {
        // Pick a building to live in
        var building = GetEntityById(entity.children[floor(SeededRandom(seed + entity.inhabitantCount + i) * houseCount)]);
        building.children.push("[" + GenerateLifeForm(GetSeedFromSeed(seed + entity.inhabitantCount + i)) + "]");

        building._hasGeneratedChildren = true;
        i++;
    }


    entities[entity.id] = entity;
    return entity;
}

function GenerateBuilding(seed, parent, children) {
    var entity = {
        id: "BUILDING_" + seed,
        seed: seed,
        type: "Building",
        displayName: GetRandomWord(random(4, 10)),
        parent: parent,
        children: children,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}

function GenerateLifeForm(seed, parent, children) {
    var entity = {
        id: "LIFEFORM_" + seed,
        seed: seed,
        type: "LifeForm",
        displayName: GetRandomWord(random(4, 10)),
        parent: parent,
        children: children,
        _hasGeneratedChildren: false
    }

    entities[entity.id] = entity;
    return entity;
}