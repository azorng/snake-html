const gameCtx = {
  direction: undefined,
  speed: 90,
  score: 0,
  moveHistory: []
}

const xCols = 20
const screenHeight = 600
const screenWidth = 600
const pixelSize = screenWidth / xCols
const nFood = 4

const screen = initScreen()
const menu = initMenu()
const head = initHead()
const body = []
const food = []

window.onload = () => {
  const main = document.getElementById('main')
  main.appendChild(screen)
  main.appendChild(menu)
  initKeyBindings()
  spawnApple(nFood)
}

function start() {
  setInterval(() => {
    moveNext()
    handleScreenEdges()
    handleCollision()
    handleEat()
  }, gameCtx.speed)
}

function initKeyBindings() {
  const keyMapping = {
    ArrowDown: 'Down',
    ArrowUp: 'Up',
    ArrowRight: 'Right',
    ArrowLeft: 'Left',
  }

  document.onkeydown = function (e) {
    const direction = keyMapping[e.key]
    if (direction) {
      if (!gameCtx.direction) start()
      if (gameCtx.direction != oppositeDirection(direction))
        gameCtx.direction = direction
    }
  }
}

function handleScreenEdges() {
  handleEdge(head)
  body.forEach(bodyPart => handleEdge(bodyPart))
}

function handleEdge(el) {
  if (parseInt(el.style.top) > parseInt(screen.style.height) - pixelSize)
    el.style.top = 0

  if (parseInt(el.style.top) < 0)
    el.style.top = parseInt(screen.style.height) - pixelSize

  if (parseInt(el.style.left) > parseInt(screen.style.width) - pixelSize)
    el.style.left = 0

  if (parseInt(el.style.left) < 0)
    el.style.left = parseInt(screen.style.width) - pixelSize
}

function moveNext() {
  move(head, gameCtx.direction)

  body.forEach((part, i) => {
    const direction = gameCtx.moveHistory[i]
    move(part, direction)
  })

  gameCtx.moveHistory.unshift(gameCtx.direction)
}

function move(el, direction) {
  let finalPos;
  switch (direction) {
    case 'Down':
      finalPos = parseInt(el.style.top) + pixelSize
      el.animate([{ top: el.style.top }, { top: `${finalPos}px` }], { duration: gameCtx.speed })
      el.style.top = finalPos
      break

    case 'Up':
      finalPos = parseInt(el.style.top) - pixelSize
      el.animate([{ top: el.style.top }, { top: `${finalPos}px` }], { duration: gameCtx.speed })
      el.style.top = finalPos 
      break

    case 'Right':
      finalPos = parseInt(el.style.left) + pixelSize
      el.animate([{ left: el.style.left }, { left: `${finalPos}px` }], { duration: gameCtx.speed })
      el.style.left = finalPos
      break

    case 'Left':
      finalPos = parseInt(el.style.left) - pixelSize
      el.animate([{ left: el.style.left }, { left: `${finalPos}px` }], { duration: gameCtx.speed })
      el.style.left = finalPos
      break
  }
}

function initScreen() {
  const screen = document.createElement('div')
  screen.id = 'screen'
  screen.style.width = screenWidth
  screen.style.height = screenHeight
  return screen
}

function spawnApple(n = 1) {
  const availablePositions = Array(xCols).fill().map((_, i) => pixelSize * i)
  for (let i = 0; i < n; i++) {
    const apple = document.createElement('div')
    apple.className = 'apple'
    apple.style.height = pixelSize
    apple.style.width = pixelSize
    apple.style.fontSize = pixelSize
    apple.style.left = availablePositions[rand(0, availablePositions.length)]
    apple.style.top = availablePositions[rand(0, availablePositions.length)]
    screen.appendChild(apple)
    food.push(apple)
  }
}

function initMenu() {
  const menu = document.createElement('div')
  menu.id = 'menu'
  menu.style.width = screenHeight
  menu.innerHTML = `Score: <span id='score'>${gameCtx.score}</span>`

  return menu
}

function initHead() {
  const head = document.createElement('div')
  head.id = 'head'

  initObj(head)
  screen.appendChild(head)
  return head
}

function rand(min, max) {
  return parseInt(Math.random() * (max - min) + min)
}

function handleEat() {
  food.forEach(apple => {
    if (isSamePos(head, apple)) {
      addScore(10)
      addBody()
      removeApple(apple)
      spawnApple()
    }
  })
}

function removeApple(apple) {
  for (let i = 0; i <= food.length; i++) {
    if (food[i] == apple) {
      food.splice(i, 1)
      apple.remove()
      return
    }
  }
}

function addScore(points) {
  gameCtx.score += points
  const score = document.getElementById('score')
  score.innerHTML = gameCtx.score
}

function addBody() {
  const bodyPart = document.createElement('div')
  bodyPart.className = 'body-part'
  initObj(bodyPart)

  const lastPart = body.length == 0 ? head : body[body.length - 1]

  bodyPart.style.left = lastPart.style.left
  bodyPart.style.top = lastPart.style.top
  direction = oppositeDirection(gameCtx.moveHistory[body.length])

  move(bodyPart, direction)
  screen.appendChild(bodyPart)
  body.push(bodyPart)
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

function initObj(piece) {
  piece.style.left = 0
  piece.style.right = 0
  piece.style.top = 0
  piece.style.bottom = 0
  piece.style.height = pixelSize
  piece.style.width = pixelSize
  piece.style.lineHeight = pixelSize + 'px'
  piece.style.fontSize = pixelSize + 'px'
}

function handleCollision() {
  body.forEach(bodyPart => {
    if (isSamePos(head, bodyPart)) {
      alert('Game over')
      location.reload()
    }
  })
}

function isSamePos(el1, el2) {
    return el1.style.left == el2.style.left && el1.style.top == el2.style.top
}
