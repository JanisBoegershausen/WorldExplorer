function InitializeDrawer() {
    var canvasParent = document.getElementById("drawingCanvasParent");
    var canvas = createCanvas(200, 200);
    canvas.parent(canvasParent);
    UpdateCanvasSize();
    Clear();
}

function Clear() {
    background(36, 38, 46)
}

function DrawEntity(entity) {
    UpdateCanvasSize();
    Clear();
    switch (entity.type) {
        case "Planet":
            DrawPlanet(entity);
            break;
        case "Star System":
            DrawStarSystem(entity);
            break;
        default:
            // ToDo: Draw Questionmark or something
            break;
    }
}

// Draw a given system
function DrawStarSystem(system) {
    // Calculate how big the system can be to still fit into the canvas
    var maxDiameter = min(width, height);

    // Setup
    noStroke();

    // Space background
    background(5, 5, 10);

    // Draw Sun
    var sunDiameter = 50;
    fill(255, 215, 0);
    circle(width/2, height/2, sunDiameter, sunDiameter);

    // Draw children
    var i = 0;
    system.children.forEach(childId => {
        var child = GetEntityById(childId);
        switch (child.type) {
            case "Planet":
                // Choose random position and size
                var orbitAngle = SeededRandom(child.seed + 3) * 2 * PI;
                var orbitDistance = SeededRandom(child.seed + 4) * maxDiameter * 0.5;
                var planetDiameter = SeededRandom(child.seed + 6) * maxDiameter * 0.1 + 5;

                // Prevent plantes from intersecting sun
                while(orbitDistance - planetDiameter < sunDiameter) {orbitDistance++; planetDiameter--;}

                // Calculate position
                var positionX = (width / 2) + cos(orbitAngle) * orbitDistance;
                var positionY = (height / 2) + sin(orbitAngle) * orbitDistance;

                // Draw planet
                noStroke();
                fill(SeededRandom(child.seed) * 255, SeededRandom(child.seed + 1) * 255, SeededRandom(child.seed + 2) * 255, 255);
                ellipse(positionX, positionY, planetDiameter, planetDiameter)

                // Draw orbit line
                noFill();
                stroke(255, 255, 255, 50)
                strokeWeight(1);
                ellipse(width/2, height/2, orbitDistance*2, orbitDistance*2);

                // Draw label when hovered
                if (abs(positionX - mouseX) < planetDiameter / 2 && abs(positionY - mouseY) < planetDiameter / 2) {
                    fill(255);
                    stroke(0);
                    strokeWeight(2);
                    textStyle(BOLD);
                    textAlign(CENTER, CENTER);
                    text(child.displayName, positionX, positionY);
                }
                break;

            default:
                break;
        }
    });
}

// Draw a given planet
function DrawPlanet(planet) {
    // Calculate how big the planet can be to still fit into the canvas
    var maxDiameter = min(width, height);

    // Setup
    noStroke();

    // Space background
    background(5, 5, 10);

    // Draw athmosphere
    if (SeededRandom(planet.seed) < 0.8) {
        fill(100, 150, 250, 10);
        for (let a = 0.8; a < 0.9; a += 0.01) {
            circle(width / 2, height / 2, maxDiameter * a);
        }
    }

    // Draw main body
    if (SeededRandom(planet.seed + 1) < 0.75) {
        fill(79, 164, 184); // Water
    } else {
        fill(171, 81, 48); // Dust
    }
    circle(width / 2, height / 2, maxDiameter * 0.8);

    // Draw children
    planet.children.forEach(childId => {
        var child = GetEntityById(childId);
        switch (child.type) {
            case "Landmass":
                // Draw continent
                noStroke();
                fill(SeededRandom(child.seed) * 255, SeededRandom(child.seed + 1) * 255, SeededRandom(child.seed + 2) * 255, 255);
                var positionRandom = SeededRandom(child.seed + 3) * 2 * PI;
                var positionX = (width / 2) + maxDiameter * 0.4 * cos(positionRandom) * SeededRandom(child.seed + 4);
                var positionY = (height / 2) + maxDiameter * 0.4 * sin(positionRandom) * SeededRandom(child.seed + 5);
                var w = SeededRandom(child.seed + 6) * maxDiameter * 0.2 + 5;
                var h = SeededRandom(child.seed + 7) * maxDiameter * 0.2 + 5;
                ellipse(positionX, positionY, w, h)

                if (abs(positionX - mouseX) < w / 2 && abs(positionY - mouseY) < h / 2) {
                    // Draw label
                    fill(255);
                    stroke(0);
                    strokeWeight(2);
                    textStyle(BOLD);
                    textAlign(CENTER, CENTER);
                    text(child.displayName, positionX, positionY);
                }
                break;
            default:
                break;
        }
    });
}

// Updates the p5.js canvas to work with the correct scaling, set by the html
function UpdateCanvasSize() {
    var canvasParent = document.getElementById("drawingCanvasParent");
    resizeCanvas(canvasParent.offsetWidth, canvasParent.offsetHeight);
}