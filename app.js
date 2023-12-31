const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0
let missile_count = 0
let boom1 = new Audio("snd/boom1.mp3")
let boom2 = new Audio("snd/boom2.mp3")
let boom3 = new Audio("snd/boom3.mp3")
let boom4 = new Audio("snd/boom4.mp3")
let boom_idx = 0
let booms = []
booms.push(boom1, boom2, boom3, boom4);
let shootsnd = new Audio("snd/shoot.mp3")
let killsnd = new Audio("snd/kill.mp3")
let deathsnd = new Audio("snd/death.mp3")
let victory = new Audio("snd/you-win.mp3")
let invadersSpeed = 600
let max_missiles = 5
      
for (let i = 0; i < 225; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if(!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader')
    }
  }
}

draw()

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  }
}

squares[currentShooterIndex].classList.add('shooter')


function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter')
  switch(e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -=1
      break
    case 'ArrowRight' :
      if (currentShooterIndex % width < width -1) currentShooterIndex +=1
      break
  }
  squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
  remove()

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width +1
      direction = -1
      goingRight = false
    }
  }

  if(leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width -1
      direction = 1
      goingRight = true
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }

  draw()

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML = 'GAME OVER'
    clearInterval(invadersId)
    deathsnd.play()
    return
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if(alienInvaders[i] > (squares.length)) {
      resultsDisplay.innerHTML = 'GAME OVER'
      clearInterval(invadersId)
      deathsnd.play()
      return
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'YOU WIN'
    clearInterval(invadersId)
    victory.play()
    return
  }

  booms[boom_idx].play();
  boom_idx++;
  if (boom_idx > 3)
    boom_idx = 0;

  newSpeed = 400 + 100 * Math.floor((alienInvaders.length - aliensRemoved.length) / 6);

  if (newSpeed != invadersSpeed)
  {
    invadersSpeed = newSpeed
    clearInterval(invadersId)
    invadersId = setInterval(moveInvaders, invadersSpeed)
  }
}

invadersId = setInterval(moveInvaders, invadersSpeed)

function shoot(e) {
  let laserId
  let currentLaserIndex = currentShooterIndex
  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser')                   
    currentLaserIndex -= width
    if (currentLaserIndex < 0)
    {
        clearInterval(laserId);
        missile_count--
    }
    else
    {
        squares[currentLaserIndex].classList.add('laser')

        if (squares[currentLaserIndex].classList.contains('invader'))
        {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')

            setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)
            missile_count--
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results
            console.log(aliensRemoved)
            killsnd.play()
        }
    }
  }
  switch(e.key) {
    case ' ':
    case 'ArrowUp':
        if (missile_count >= max_missiles)
            return;
        missile_count++;
        laserId = setInterval(moveLaser, 100)
        deathsnd.play()
  }
}

document.addEventListener('keydown', shoot)