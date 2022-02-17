/**
 * @file Manages drawing the visuals for the entities. 
 */

/** Initialize the canvas on which the visuals are drawn. */
function InitializeDrawer() {
    var canvasParent = document.getElementById("drawingCanvasParent");
    var canvas = createCanvas(200, 200);
    canvas.parent(canvasParent);
    UpdateCanvasSize();
    Clear();
}

/** Clear the canvas with the selected background color. */
function Clear() {
    background(36, 38, 46)
}

/** Draw the given entity onto the canvas. */
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

/** Draw the given system. */
function DrawStarSystem(system) {
    // Calculate how big the system can be to still fit onto the canvas
    var maxDiameter = min(width, height);

    // Setup p5 setting
    noStroke();

    // Draw space background
    background(5, 5, 10);

    // Draw Sun
    var sunDiameter = 50;
    fill(255, 215, 0);
    circle(width / 2, height / 2, sunDiameter);

    // Draw children of this system (currently only planets)
    system.children.forEach(childId => {
        var child = GetEntityById(childId);
        switch (child.type) {
            case "Planet":
                // Choose random position and size
                var orbitAngle = SeededRandom(child.seed + 3) * 2 * PI;
                var orbitDistance = SeededRandom(child.seed + 4) * maxDiameter * 0.5;
                var planetDiameter = SeededRandom(child.seed + 6) * maxDiameter * 0.1 + 5;

                // Prevent plantes from intersecting sun
                while (orbitDistance - planetDiameter < sunDiameter) { orbitDistance++; planetDiameter--; }

                // Calculate planet coordinates
                var positionX = (width / 2) + cos(orbitAngle) * orbitDistance;
                var positionY = (height / 2) + sin(orbitAngle) * orbitDistance;

                // Draw planet (cult replace this with actually calling the DrawPlanet method)
                noStroke();
                fill(SeededRandom(child.seed) * 255, SeededRandom(child.seed + 1) * 255, SeededRandom(child.seed + 2) * 255, 255);
                ellipse(positionX, positionY, planetDiameter, planetDiameter)

                // Draw orbit line
                noFill();
                stroke(255, 255, 255, 50)
                strokeWeight(1);
                ellipse(width / 2, height / 2, orbitDistance * 2, orbitDistance * 2);

                // Draw label when hovered
                if (abs(positionX - mouseX) < planetDiameter / 2 && abs(positionY - mouseY) < planetDiameter / 2) {
                    fill(255);
                    stroke(0);
                    strokeWeight(2);
                    textStyle(BOLD);
                    textAlign(CENTER, CENTER);
                    text(child.displayName, positionX, positionY);
                    
                    if(mouseIsPressed) {
                        DisplayEntityById(child.id);
                    }
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

    // Setup p5 settings
    noStroke();

    // Space background
    background(5, 5, 10);

    // Draw athmosphere
    var hasAthmosphere = SeededRandom(planet.seed) < 0.8;
    if (hasAthmosphere) {
        fill(100, 150, 250, 10);
        for (let a = 0.8; a < 0.9; a += 0.01) {
            circle(width / 2, height / 2, maxDiameter * a);
        }
    }

    // Draw main body (TODO: Generate the planet type in Generator.js)
    if (SeededRandom(planet.seed + 1) < 0.75) {
        fill(79, 164, 184); // Water
    } else {
        fill(171, 81, 48); // Dust
    }
    circle(width / 2, height / 2, maxDiameter * 0.8);

    // Draw children (currently only landmasses)
    planet.children.forEach(childId => {
        var child = GetEntityById(childId);
        switch (child.type) {
            case "Landmass":
                // Setup p5 drawing settings
                noStroke();

                // Select the landmasses color
                fill(SeededRandom(child.seed) * 75 + 75, SeededRandom(child.seed + 1) * 75 + 75, SeededRandom(child.seed + 2) * 50 + 50, 255);

                // Choose a center from where we start generating the landmass
                var positionRandom = SeededRandom(child.seed + 3) * 2 * PI;
                var originX = (width / 2) + maxDiameter * 0.4 * cos(positionRandom) * SeededRandom(child.seed + 4);
                var originY = (height / 2) + maxDiameter * 0.4 * sin(positionRandom) * SeededRandom(child.seed + 5);

                // Select random points that lay in this landmass
                var points = [];
                for (let i = 0; i < 10; i++) {
                    points.push({
                        x: (SeededRandom(child.seed + 6 + i) - 0.5) * maxDiameter * 0.2 + 5,
                        y: (SeededRandom(child.seed + 7 + i) - 0.5) * maxDiameter * 0.2 + 5
                    })
                }

                // Get the convex that contains theese points
                var vertices = GetConvexContainingPoints(points);

                // Clamp the convex shape to only lay on the planet
                for (let i = 0; i < vertices.length; i++) {
                    var convexPos = createVector(vertices[i].x + originX - width/2.0, vertices[i].y + originY - height/2.0);
                    var clampedPos = p5.Vector.mult(p5.Vector.normalize(convexPos), min(convexPos.mag(), min(p5.Vector.mag(convexPos), maxDiameter * 0.8 * 0.5)))
                    
                    vertices[i] = createVector(clampedPos.x + width/2.0, clampedPos.y + height/2.0);
                }

                var center = createVector(0, 0);
                // Calculate the center of the generated convex
                for (let i = 0; i < vertices.length; i++) {
                    center.add(p5.Vector.mult(vertices[i], 1.0/vertices.length));
                }

                var isHovered = abs(center.x - mouseX) < (GetRightMostPoint(vertices).x - GetLeftMostPoint(vertices).x) / 2 && abs(center.y - mouseY) < (GetBottomMostPoint(vertices).y - GetTopMostPoint(vertices).y) / 2;

                // Draw the landmass
                stroke(0,0,0,255)
                strokeWeight(isHovered ? 3 : 0);
                beginShape();
                for (let i = 0; i < vertices.length; i++) {
                    vertex(vertices[i].x, vertices[i].y);
                }
                endShape(CLOSE)


                // Draw the planets name if it is hovered
                if (isHovered) {
                    fill(255);
                    stroke(0);
                    strokeWeight(2);
                    textStyle(BOLD);
                    textAlign(CENTER, CENTER);
                    text(child.displayName, center.x, center.y);

                    if(mouseIsPressed) {
                        DisplayEntityById(child.id);
                    }
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
    resizeCanvas(canvasParent.offsetWidth, canvasParent.offsetHeight - 5);
}

// Get convex containing the given points using the Gift-Wrapping Allgorithm
function GetConvexContainingPoints(points) {
    var pointOnHull = GetLeftMostPoint(points);
    var convex = [];
    var i = 0;
    do {
        convex[i] = pointOnHull;
        var endpoint = points[0]; 
        for (let j = 0; j < points.length; j++) {
            var lineVector = p5.Vector.sub(createVector(endpoint.x, endpoint.y), createVector(convex[i].x, convex[i].y));
            var testVector = p5.Vector.sub(createVector(points[j].x, points[j].y), createVector(convex[i].x, convex[i].y));
            var isLeft = lineVector.cross(testVector).z < 0;
            if (endpoint == pointOnHull || isLeft) {
                endpoint = points[j];
            }
        }
        i++;
        pointOnHull = endpoint;
    } while (endpoint != convex[0]);
    return convex;
}

/** From a set of points, get leftmost point */
function GetLeftMostPoint(points) {
    var leftmost = createVector(Infinity, Infinity);
    points.forEach(point => {
        if(point.x < leftmost.x) {
            leftmost = point;
        }
    });
    return leftmost;
}

/** From a set of points, get rightmost point */
function GetRightMostPoint(points) {
    var rightmost = createVector(-Infinity, -Infinity);
    points.forEach(point => {
        if(point.x > rightmost.x) {
            rightmost = point;
        }
    });
    return rightmost;
}

/** From a set of points, get bottommost point */
function GetBottomMostPoint(points) {
    var bottommost = createVector(-Infinity, -Infinity);
    points.forEach(point => {
        if(point.y > bottommost.y) {
            bottommost = point;
        }
    });
    return bottommost;
}

/** From a set of points, get topmost point */
function GetTopMostPoint(points) {
    var topmost = createVector(Infinity, Infinity);
    points.forEach(point => {
        if(point.y < topmost.y) {
            topmost = point;
        }
    });
    return topmost;
}