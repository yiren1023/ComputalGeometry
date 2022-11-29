
//page fonctions used to disable/show some part of the page

function disableAllBodyPart(){
    document.getElementsByClassName("explanation")[0].style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("gameWonMessage").style.display = "none"
}

function showExplanationPage(){
    disableAllBodyPart();
    document.getElementsByClassName("explanation")[0].style.display = "block";
    
}

function showGamePage(){
    disableAllBodyPart();
    document.getElementById("game").style.display = "block";
    resetpoints();
}

function showGameExplanation(){
  if (document.getElementById("gameExplanationText").style.display === "block"){
    document.getElementById("gameExplanationText").style.display = "none";
  }
  else{
    document.getElementById("gameExplanationText").style.display = "block";
  }
  
}

function showWonMessage(){
  disableAllMessage();
  document.getElementById("gameExplanationText").style.display = "none";
  document.getElementById("gameWonMessage").style.display = "block";
  
}

function showErrorMessage(){
  disableAllMessage();
  document.getElementById("gameExplanationText").style.display = "none";
  document.getElementById("gameErrorMessage").style.display = "block";
}

function showTryAgainMessage(){
  disableAllMessage();
  document.getElementById("gameExplanationText").style.display = "none";
  document.getElementById("gameTryAgainMessage").style.display = "block";
}

function showLostMessage(){
  disableAllMessage();
  document.getElementById("gameExplanationText").style.display = "none";
  document.getElementById("gameLostMessage").style.display = "block";
}

function disableAllMessage(){
  document.getElementById("gameExplanationText").style.display = "none";
  document.getElementById("gameTryAgainMessage").style.display = "none";
  document.getElementById("gameWonMessage").style.display = "none";
  document.getElementById("gameErrorMessage").style.display = "none";
  document.getElementById("gameLostMessage").style.display = "none";
}

//algorithm implementation
/* eslint-disable no-undef, no-unused-vars */

// object used to perform our algorithm
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Node {
  constructor(node, numberLeaf, leaf, line1, line2) {
    //array of the 4 children if not a leaf
    this.node = node;
    //
    this.numberLeaf = numberLeaf;
    //the point if the node is a leaf
    this.leaf = leaf;
    //the two lines that divise the space if not a leaf
    this.line1 = line1;
    this.line2 = line2;
  }
  setNode(node) {
    this.node = node;
  }
  addNode(node) {
    this.node.push(node);
  }
  calculateCenterPoints() {
    return new Point(line1.a.x, line2.b.y);
  }
}

class Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

var can =null;
// datastructure
var tree = null;
var trianglePoints = [];
var countPoints = [];
var pickedTrianglePoints = [];
var numberPointsInsideBestTriangle = 0;
var solutionTriangle = [];
//game variable
var difficulty = 1;
var numberOfTryLeft = 3 - (difficulty - 1);

//mode
var isPlacingPoints = true;
var isPickingPointsToFormATriangle = false;
var isDrawSolution =false;
var isGivenSolutionGood = false;

function mode() {
  if (isPlacingPoints || isDrawSolution) {
    resetpoints();
    //creating the count points
    let x = 0;
    let y = 0;
    let tooClose = false;
    while(int(countPoints.length) < int(6 * difficulty)){
      x = Math.random() * (can.width - 6) + 3;
      y = Math.random() * (can.height - 6) + 3;
      tooClose = false;
      countPoints.forEach(element => {
        if(Math.abs(x - element.x) < 3 || Math.abs(y - element.y) < 3){
          tooClose = true;
        }
      });
      if(!tooClose){
        countPoints.push(new Point(x, y));
      }
    }
    //create the tree from the set countPoints
    tree = treeBuild(countPoints);

    //creating the triangle points
    while(int(trianglePoints.length) < int(4 * difficulty)){
      x = Math.random() * (can.width - 6) + 3;
      y = Math.random() * (can.height - 6) + 3;
      tooClose = false;
      countPoints.forEach(element => {
        if(Math.abs(x - element.x) < 3 || Math.abs(y - element.y) < 3){
          tooClose = true;
        }
      });
      trianglePoints.forEach(element => {
        if(Math.abs(x - element.x) < 3 || Math.abs(y - element.y) < 3){
          tooClose = true;
        }
      });
      if(!tooClose){
        trianglePoints.push(new Point(x, y));
      }
    }
    //find all possible best solution.
    findSolution();
    isDrawSolution = false;
    isPlacingPoints = false;
    isPickingPointsToFormATriangle = true;
  } else if (isPickingPointsToFormATriangle) {
    if (pickedTrianglePoints.length === 3) {
      if (verif()) { // look if choosed points are in solution list
        //victory
        isGivenSolutionGood = true;
        showWonMessage();
        if (difficulty !== 10){
          difficulty += 1;
        }
        numberOfTryLeft = 3 - (difficulty - 1);
        isDrawSolution =true;
        isPickingPointsToFormATriangle = false;
      } else {
        if (numberOfTryLeft > 0) {
          //try again
          showTryAgainMessage();
          pickedTrianglePoints = [];
          numberOfTryLeft -= 1;
        } else {
          //game over
          pickedTrianglePoints = [];
          showLostMessage();
          isDrawSolution =true;
          isPickingPointsToFormATriangle = false;
        }
      }
    } else {
      // error message about the number of points picked to form a triangle( != 3)
      showErrorMessage();
      pickedTrianglePoints = [];
    }
  }
}

function setup() {
  can = createCanvas(1200, 800);
  can.parent("game");
  // Put setup code here
  can.fill("black");
  textSize(40);
  buttonClear = createButton("Clear");
  buttonNext = createButton("Next");
  buttonClear.parent("gameExplanation");
  buttonNext.parent("gameExplanation");
  can.mousePressed(addPoints);
  buttonClear.mousePressed(resetAll);
  buttonNext.mousePressed(mode);
  showExplanationPage();
}

function resetAll(){
  difficulty =1;
  resetpoints();
}

function resetpoints() {
  disableAllMessage();
  isGivenSolutionGood = false;
  tree = null;
  trianglePoints = [];
  countPoints = [];
  pickedTrianglePoints = [];
  numberPointsInsideBestTriangle = 0;
  solutionTriangle = [];
  isPlacingPoints = true;
  isPickingPointsToFormATriangle = false;
  isDrawSolution =false;
}

function draw() {
  // Drawn points, line, triangle,...
  background(200);
  for (i in countPoints) {
    ellipse(countPoints[i].x, countPoints[i].y, 4, 4);
  }
  stroke("red");
  for (i in trianglePoints) {
    ellipse(trianglePoints[i].x, trianglePoints[i].y, 4, 4);
  }
  if(isDrawSolution) {
  for (var j = 0; j < solutionTriangle.length ; j +=1) {
    for(var k = 0; k < solutionTriangle[j].length ; k +=1)
    
    line(
      solutionTriangle[j][k].x,
      solutionTriangle[j][k].y,
      solutionTriangle[j][(int(k) + 1) % int(solutionTriangle[j].length)].x,
      solutionTriangle[j][(int(k) + 1) % int(solutionTriangle[j].length)].y
    );
  }}

  stroke("blue");
  if (isGivenSolutionGood){
    for(var k = 0; k < pickedTrianglePoints.length ; k +=1){
      line(
        pickedTrianglePoints[k].x,
        pickedTrianglePoints[k].y,
        pickedTrianglePoints[(int(k) + 1) % int(pickedTrianglePoints.length)].x,
        pickedTrianglePoints[(int(k) + 1) % int(pickedTrianglePoints.length)].y
      );
    }
  }
  stroke("blue");
  for (i in pickedTrianglePoints) {
    ellipse(pickedTrianglePoints[i].x, pickedTrianglePoints[i].y, 8, 8);
  }
  stroke("black");
}

function isAClickNearToAPoints() {
  for (i in trianglePoints) {
    if (
      mouseX - 3 < trianglePoints[i].x &&
      trianglePoints[i].x < mouseX + 3 &&
      mouseY - 3 < trianglePoints[i].y &&
      trianglePoints[i].y < mouseY + 3
    ) {
      pickedTrianglePoints.push(trianglePoints[i]);
    }
  }
}

function addPoints() {
  if (isPickingPointsToFormATriangle) {
    isAClickNearToAPoints();
  }
}


function find2LineToCutPlane(listPoints) {
  // find 2 line in such a way that each of 4 spaces have the same number of points.
  let cloneX = [].concat(listPoints);
  let cloneY = [].concat(listPoints);
  let middle = Math.ceil(listPoints.length / 2) - 1;
  cloneX.sort((a, b) => {
    return a.x - b.x;
  });
  cloneY.sort((a, b) => {
    return a.y - b.y;
  });
  //set the 2 cutting lines
  line1 = new Line(
    new Point(cloneX[middle].x + 1, cloneX[middle].y),
    new Point(cloneX[middle].x + 1, cloneX[middle].y - 1)
  );
  line2 = new Line(
    new Point(cloneY[middle].x, cloneY[middle].y + 1),
    new Point(cloneY[middle].x - 1, cloneY[middle].y + 1)
  );
  return [line1, line2];
}


function treeBuild(listePoints) {
  // sort and build the tree
  let tree = new Node(null, listePoints.length, null, null, null);
  if (listePoints.length === 1) {
    tree.leaf = listePoints[0];
  } else {
    //find the 2 cutting lines and split points in each sub spaces
    lines = find2LineToCutPlane(listePoints);
    let upLeft = [];
    let upRight = [];
    let downLeft = [];
    let downRight = [];
    listePoints.forEach((element) => {
      if (orientDet(lines[0].a, lines[0].b, element)) {
        if (orientDet(lines[1].a, lines[1].b, element)) {
          upLeft.push(element);
        } else {
          upRight.push(element);
        }
      } else {
        if (orientDet(lines[1].a, lines[1].b, element)) {
          downLeft.push(element);
        } else {
          downRight.push(element);
        }
      }
    });
    //verify if the sub-space is not empty and recurse
    tree.line1 = lines[0];
    tree.line2 = lines[1];
    var node = [];
    if (upLeft.length !== 0) {
      node.push(treeBuild(upLeft));
    } else {
      node.push(null);
    }
    if (upRight.length !== 0) {
      node.push(treeBuild(upRight));
    } else {
      node.push(null);
    }
    if (downLeft.length !== 0) {
      node.push(treeBuild(downLeft));
    } else {
      node.push(null);
    }
    if (downRight.length !== 0) {
      node.push(treeBuild(downRight));
    } else {
      node.push(null);
    }
    tree.node = node;
  }
  return tree;
}

function countInHalfplanes(lines, tree, recurInt) {
  //calculate the number of points inside a triangle
  if (tree === null) {
    return null;
  } else {
    //count the number of countPoints's points in the triangle define by the three halfplanes
    if (tree.node == null) {
      if (
        orientDet(lines[0].a, lines[0].b, tree.leaf) ===
        orientDet(lines[1].a, lines[1].b, tree.leaf)
      ) {
        if (
          orientDet(lines[0].a, lines[0].b, tree.leaf) ===
          orientDet(lines[2].a, lines[2].b, tree.leaf)
        ) {
          //the point is in the triangle
          console.log("add a point");
          count += 1;
        }
      }
    } else {
      let inUpLeft = false;
      let inUpRight = false;
      let inDownLeft = false;
      let inDownRight = false;
      let centerPoint = tree.calculateCenterPoints();
      let upLimite = new Point(
        centerPoint.x,
        centerPoint.y + windowHeight / Math.pow(2, recurInt)
      );
      let downLimite = new Point(
        centerPoint.x,
        centerPoint.y - windowHeight / Math.pow(2, recurInt)
      );
      let leftLimite = new Point(
        centerPoint.x - windowWidth / Math.pow(2, recurInt),
        centerPoint.y
      );
      let rightLimite = new Point(
        centerPoint.x + windowWidth / Math.pow(2, recurInt),
        centerPoint.y
      );
      let list = [upLimite, downLimite, leftLimite, rightLimite];
      lines.forEach((element) => {
        //if the vertex is in it, we search in this space
        if (orientDet(tree.line1.a, tree.line1.b, element.a)) {
          if (orientDet(tree.line2.a, tree.line2.b, element.a)) {
            if (!inUpLeft) {
              countInHalfplanes(lines, tree.node[0], recurInt + 1);
              inUpLeft = true;
            }
          } else {
            if (!inUpRight) {
              countInHalfplanes(lines, tree.node[1], recurInt + 1);
              inUpRight = true;
            }
          }
        } else {
          if (orientDet(tree.line2.a, tree.line2.b, element.a)) {
            if (!inDownLeft) {
              countInHalfplanes(lines, tree.node[2], recurInt + 1);
              inDownLeft = true;
            }
          } else {
            if (!inDownRight) {
              countInHalfplanes(lines, tree.node[3], recurInt + 1);
              inDownRight = true;
            }
          }
        }
        //if cross a line between two space, explore both space
        let I = new Point(element.b.x - element.a.x, element.b.y - element.a.y);

        for (let i = 0; i < 4; i++) {
          let J = new Point(
            list[i].x - centerPoint.x,
            list[i].y - centerPoint.y
          );
          if (I.x * J.y - I.y * J.x !== 0) {
            //the lines intersect
            let m =
              -(
                -I.x * element.a.y +
                I.x * centerPoint.y +
                I.y * element.a.x -
                I.y * centerPoint.x
              ) /
              (I.x * J.y - I.y * J.x);
            let k =
              -(
                element.a.x * J.y -
                centerPoint.x * J.y -
                J.x * element.a.y +
                J.x * centerPoint.y
              ) /
              (I.x * J.y - I.y * J.x);
            if (0 < m && m < 1 && 0 < k && k < 1) {
              //the segments intersect
              switch (i) {
                case 0: //upLine crossed
                  if (!inUpLeft) {
                    countInHalfplanes(lines, tree.node[0], recurInt + 1);
                    inUpLeft = true;
                  }
                  if (!inUpRight) {
                    countInHalfplanes(lines, tree.node[1], recurInt + 1);
                    inUpRight = true;
                  }
                  break;
                case 1: //downLine crossed
                  if (!inDownLeft) {
                    countInHalfplanes(lines, tree.node[2], recurInt + 1);
                    inDownLeft = true;
                  }
                  if (!inDownRight) {
                    countInHalfplanes(lines, tree.node[3], recurInt + 1);
                    inDownRight = true;
                  }
                  break;
                case 2: //leftLine crossed
                  if (!inUpLeft) {
                    countInHalfplanes(lines, tree.node[0], recurInt + 1);
                    inUpLeft = true;
                  }
                  if (!inDownLeft) {
                    countInHalfplanes(lines, tree.node[2], recurInt + 1);
                    inDownLeft = true;
                  }
                  break;
                case 3: //rightLine crossed
                  if (!inDownRight) {
                    countInHalfplanes(lines, tree.node[3], recurInt + 1);
                    inDownRight = true;
                  }
                  if (!inUpRight) {
                    countInHalfplanes(lines, tree.node[1], recurInt + 1);
                    inUpRight = true;
                  }
                  break;
                default:
              }
            }
          }
        }
      });

      //we search among the spaces not explored yet if it is because that space is totaly outside or inside the triangle
      let point;
      if (!inUpLeft && tree.node[0] !== null) {
        if (
          orientDet(lines[0].a, lines[0].b, centerPoint) ===
          orientDet(lines[1].a, lines[1].b, centerPoint)
        ) {
          if (
            orientDet(lines[0].a, lines[0].b, centerPoint) ===
            orientDet(lines[2].a, lines[2].b, centerPoint)
          ) {
            //the point is in the triangle
            //so the all space is in the triangle
            count += tree.node[0].numberLeaf;
          }
        }
        inUpLeft = true;
      }
      if (!inUpRight && tree.node[1] !== null) {
        if (
          orientDet(lines[0].a, lines[0].b, centerPoint) ===
          orientDet(lines[1].a, lines[1].b, centerPoint)
        ) {
          if (
            orientDet(lines[0].a, lines[0].b, centerPoint) ===
            orientDet(lines[2].a, lines[2].b, centerPoint)
          ) {
            //the point is in the triangle
            //so the all space is in the triangle
            count += tree.node[1].numberLeaf;
          }
        }
        inUpRight = true;
      }
      if (!inDownLeft && tree.node[2] !== null) {
        if (
          orientDet(lines[0].a, lines[0].b, centerPoint) ===
          orientDet(lines[1].a, lines[1].b, centerPoint)
        ) {
          if (
            orientDet(lines[0].a, lines[0].b, centerPoint) ===
            orientDet(lines[2].a, lines[2].b, centerPoint)
          ) {
            //the point is in the triangle
            //so the all space is in the triangle
            count += tree.node[2].numberLeaf;
          }
        }
        inDownLeft = true;
      }
      if (!inDownRight && tree.node[3] !== null) {
        if (
          orientDet(lines[0].a, lines[0].b, centerPoint) ===
          orientDet(lines[1].a, lines[1].b, centerPoint)
        ) {
          if (
            orientDet(lines[0].a, lines[0].b, centerPoint) ===
            orientDet(lines[2].a, lines[2].b, centerPoint)
          ) {
            //the point is in the triangle
            //so the all space is in the triangle
            count += tree.node[3].numberLeaf;
          }
        }
        inDownRight = true;
      }
    }
  }
}

function orientDet(A, B, C) {
  //return if the three points form a left turn
  if ((A.x - C.x) * (B.y - C.y) - (A.y - C.y) * (B.x - C.x) < 0) {
    return true;
  }
  return false;
}

var count = 0;

function findSolution() {
  //find all best possible triangle
  for (i = 0; i < int(trianglePoints.length) - 2; i++) {
    for (j = int(i) + 1; j < int(trianglePoints.length) - 1; j++) {
      for (k = int(j) + 1; k < int(trianglePoints.length); k++) {
        if (i !== j && j !== k && k !== i) {
          count = 0;
          countInHalfplanes(
            [
              new Line(trianglePoints[i], trianglePoints[j]),
              new Line(trianglePoints[j], trianglePoints[k]),
              new Line(trianglePoints[k], trianglePoints[i])
            ],
            tree,
            1
          );
          if (count > numberPointsInsideBestTriangle) {
            //found an other possible triangle which contain more points
            solutionTriangle = [
              [trianglePoints[i], trianglePoints[j], trianglePoints[k]]
            ];
            numberPointsInsideBestTriangle = count;
          } else if (count === numberPointsInsideBestTriangle) {
            solutionTriangle.push([
              trianglePoints[i],
              trianglePoints[j],
              trianglePoints[k]
            ]);
          }
        }
      }
    }
  }
}

function verif() {
  //check if the player's awnser is correct
  a = pickedTrianglePoints[0];
  b = pickedTrianglePoints[1];
  c = pickedTrianglePoints[2];
  for (i in solutionTriangle) {
    if (
      solutionTriangle[i].includes(a) &&
      solutionTriangle[i].includes(b) &&
      solutionTriangle[i].includes(c)
    ) {
      return true;
    }
  }
  return false;
}

// This Redraws the Canvas when resized
windowResized = function () {
  can.resizeCanvas(windowWidth, windowHeight);
};
