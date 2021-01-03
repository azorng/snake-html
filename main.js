/*
 * TODO:
 * Treat head as a body part
 *
 */

const gameCtx = {
  direction: undefined,
  speed: 150,
  score: 0,
  moveHistory: []
};

const screen = initScreen();
const xCols = 20
const pixelSize = parseInt(screen.style.width) / xCols;
const head = initHead();
screen.appendChild(head);

window.onload = () => {
  document.getElementById('main').appendChild(screen);
  initKeyBindings();
  createFood(3)
};

function start() {
  setInterval(() => {
    moveNext();
    handleScreenEdges();
    handleCollision();
    handleEat();
    updateScore();
  }, gameCtx.speed);
}

function initKeyBindings() {
  const keyMapping = {
    ArrowDown: 'Down',
    ArrowUp: 'Up',
    ArrowRight: 'Right',
    ArrowLeft: 'Left',
  };

  document.onkeydown = function (e) {
    const direction = keyMapping[e.key];
    if (direction) {
      if (!gameCtx.direction) start();
      gameCtx.direction = direction;
    }
  };
}

function handleScreenEdges() {
  handleEdge(head)
  Array.from(document.getElementsByClassName('body')).forEach(bodyPart => {
    handleEdge(bodyPart)
  })
}

function handleEdge(el) {
  if (parseInt(el.style.top) > parseInt(screen.style.height) - pixelSize)
    el.style.top = 0;

  if (parseInt(el.style.top) < 0)
    el.style.top = parseInt(screen.style.height) - pixelSize;

  if (parseInt(el.style.left) > parseInt(screen.style.width) - pixelSize)
    el.style.left = 0;

  if (parseInt(el.style.left) < 0)
    el.style.left = parseInt(screen.style.width) - pixelSize;
}

function moveNext() {
  move(head, gameCtx.direction)
  gameCtx.moveHistory.unshift(gameCtx.direction)

  Array.from(document.getElementsByClassName('body')).forEach((part, i) => {
    const direction = gameCtx.moveHistory[i+1]
    move(part, direction)
  })
}

function move(el, direction) {
  switch (direction) {
    case 'Down':
      el.style.top = parseInt(el.style.top) + pixelSize;
      break;

    case 'Up':
      el.style.top = parseInt(el.style.top) - pixelSize;
      break;

    case 'Right':
      el.style.left = parseInt(el.style.left) + pixelSize;
      break;

    case 'Left':
      el.style.left = parseInt(el.style.left) - pixelSize;
      break;

    default:
      break;
  }
}

function initScreen() {
  const screen = document.createElement('div');
  screen.id = 'screen';
  screen.style.width = 500;
  screen.style.height = 500;

  const menu = initMenu();
  screen.appendChild(menu)
  return screen
}

function createFood(n = 1) {
  const availablePositions = Array(xCols).fill().map((_, i) => pixelSize * i)
  for (let i = 0; i < n; i++) {
    const food = document.createElement('div');
    food.className = 'food';
    food.style.height = pixelSize;
    food.style.width = pixelSize;
    food.style.left = availablePositions[rand(0, availablePositions.length)];
    food.style.top = availablePositions[rand(0, availablePositions.length)];
    screen.appendChild(food);
  }
}

function initMenu() {
  const menu = document.createElement('div');
  menu.id = 'menu'
  menu.style.width = 500;
  menu.innerHTML = `Score: <span id='score'>${gameCtx.score}</span>`
  
  return menu;
}

function initHead() {
  const head = document.createElement('div');
  head.id = 'head';

  setBody(head);
  return head;
}

function rand(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

function handleEat() {
  const food = Array.from(document.getElementsByClassName('food'));
  food.forEach(apple => {
    if (apple.style.left == head.style.left && apple.style.top == head.style.top) {
      gameCtx.score += 10
      addBody();
      apple.remove();
      createFood();
    }
  })
}

function updateScore() {
  const score = document.getElementById('score');
  score.innerHTML = gameCtx.score
}

function addBody() {
  const body = document.createElement('div');
  body.className = 'body';
  setBody(body)
  let direction

  const bodyParts = Array.from(document.getElementsByClassName('body'))

  if (bodyParts.length == 0) {
    body.style.left = head.style.left
    body.style.top = head.style.top
    direction = oppositeDirection(gameCtx.moveHistory[1])
  } else {
    const lastBody = bodyParts[bodyParts.length - 1]
    body.style.left = lastBody.style.left
    body.style.top = lastBody.style.top
    direction = oppositeDirection(gameCtx.moveHistory[bodyParts.length])
  }

  move(body, direction)
  screen.appendChild(body)
}

function oppositeDirection(direction) {
  switch (direction) {
    case 'Down':
      return 'Up'
      
    case 'Up':
      return 'Down'

    case 'Right':
      return 'Left'

    case 'Left':
      return 'Right'
  }
}

function setBody(piece) {
  piece.style.left = 0;
  piece.style.right = 0;
  piece.style.top = 0;
  piece.style.bottom = 0;
  piece.style.height = pixelSize;
  piece.style.width = pixelSize;
}

function handleCollision() {
  Array.from(document.getElementsByClassName('body')).forEach(bodyPart => {
    if (bodyPart.style.left == head.style.left && bodyPart.style.top == head.style.top) {
      alert("COLLISION!!")
    }
  })

}
