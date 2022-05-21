const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') 

canvas.width = 960
canvas.height = 960

const collisionsMap = []

for(let i = 0; i < collisions.length; i+= 30){
  collisionsMap.push(collisions.slice(i, 30 + i))
}

const battleZonesMap = []

for(let i = 0; i < battleZonesData.length; i+= 30){
  battleZonesMap.push(battleZonesData.slice(i, 30 + i))
}

const boundaries = []
const offset = {
  x: -130,
  y: -260
}

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if(symbol === 1){
      boundaries.push(new Boundary({position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y
      }}))
    }
  })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if(symbol === 1){
      battleZones.push(new Boundary({position: {
        x: j * Boundary.width + offset.x,
        y: i * Boundary.height + offset.y
      }}))
    }
  })
})

const img = new Image()
img.src = './img/Pallet town.png'

const foregroundImg = new Image()
foregroundImg.src = './img/foregroundObjects.png'

const playerDownImage = new Image()
playerDownImage.src = './img/boy_run_down.png'

const playerUpImage = new Image()
playerUpImage.src = './img/boy_run_up.png'

const playerRightImage = new Image()
playerRightImage.src = './img/boy_run_right.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/boy_run_left.png'

const stanleyImage = new Image()
stanleyImage.src = './img/stanley.png'

const stanley = new Sprite({
  position:{
    x: 1285,
    y: 955
  },
  img:stanleyImage
})

const player = new Sprite({
  position: {
    x: canvas.width/2 - 200/4 /2,
    y: canvas.height/2 - 63/2
  },
  img: playerDownImage,
  frames : {
    max: 4,
    hold:20
  },
  sprites:{
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  }
})

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  img: img
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  img: foregroundImg
})

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

const movables = [background, ...boundaries, foreground, ...battleZones, stanley]

function rectangularCollision({rectangle1, rectangle2}){
  return(
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  )
}

function stanleyCollision(){
  return(
    player.position.x + player.width +10 >= stanley.position.x && player.position.x <= stanley.position.x  && stanley.position.y <= 447 && stanley.position.y >= 400||
    player.position.x -10 <= stanley.position.x + stanley.width && player.position.x>= stanley.position.x && stanley.position.y <= 447 && stanley.position.y >= 400 
  )
}

const battle = {
  initiated: false
}

function animate(){
  document.querySelector('#userInterface').style.display = 'none'
  const animationId = window.requestAnimationFrame(animate)
  background.draw()
  boundaries.forEach(boundary=>{
    boundary.draw()
  })
  
  battleZones.forEach(battleZone => {
    battleZone.draw()
  })
  stanley.draw(true, 3)
  player.draw()

  foreground.draw()

  let moving = true
  player.animate = false

  if(battle.initiated) return

  if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
    for(let i = 0; i < battleZones.length; i++){
      const battleZone = battleZones[i]
      const overlappingArea =(Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))
      if(
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone
        }) && 
        overlappingArea > (player.width * player.height) /2 &&
        Math.random() < 0.007
      ){
        window.cancelAnimationFrame(animationId)
        battle.initiated = true
        gsap.to('#overlappingDiv', {
          opacity: 1,
          repeat: 4,
          yoyo: true,
          duration: 0.3,
          onComplete(){
            gsap.to('#overlappingDiv', {
              opacity: 1,
              duration: 0.3,
              onComplete(){
                initBattle()
                animateBattle()
                gsap.to('#overlappingDiv', {
                  opacity: 0,
                  duration: 0.3,
                })
              }
            })
          }
        })
        break
      }
    }
  }

  if (keys.w.pressed && lastKey === 'w') {
    player.animate = true
    player.img = player.sprites.up
    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i]
      if(
        rectangularCollision({
          rectangle1: player,
          rectangle2: {...boundary, position:{
            x: boundary.position.x,
            y: boundary.position.y + 1.5
          }}
        })
      ){
        moving = false
        break
      }
    }

    if(moving){
      movables.forEach(movable => movable.position.y += 1.5)
    }
  }
  else if (keys.a.pressed && lastKey === 'a'){
    window.addEventListener('keydown', (ev)=>{
      if(ev.code === 'Space' && stanleyCollision()){
        stanley.frames.val = 2
        document.querySelector('#chatBox').style.display ='block'
      }else{
        document.querySelector('#chatBox').style.display ='none'
        stanley.frames.val = 0
      }
    })
    player.animate = true
    player.img = player.sprites.left
    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i]
      if(
        rectangularCollision({
          rectangle1: player,
          rectangle2: {...boundary, position:{
            x: boundary.position.x + 1.5,
            y: boundary.position.y
          }}
        })
      ){
        moving = false
        break
      }
    }
    if(moving){
      movables.forEach(movable => movable.position.x += 1.5)
    }
  }
  else if (keys.s.pressed && lastKey === 's'){
    player.animate = true
    player.img = player.sprites.down
    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i]
      if(
        rectangularCollision({
          rectangle1: player,
          rectangle2: {...boundary, position:{
            x: boundary.position.x,
            y: boundary.position.y - 1.5
          }}
        })
      ){
        moving = false
        break
      }
    }
    if(moving){
      movables.forEach(movable => movable.position.y -= 1.5)
    }
  }
  else if (keys.d.pressed && lastKey === 'd'){
    window.addEventListener('keydown', (ev)=>{
      if(ev.code === 'Space' && stanleyCollision()){
        stanley.frames.val = 1
        document.querySelector('#chatBox').style.display ='block'
      }else {
        document.querySelector('#chatBox').style.display ='none'
        stanley.frames.val = 0
      }
    })
    player.animate = true
    player.img = player.sprites.right
    for(let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i]
      if(
        rectangularCollision({
          rectangle1: player,
          rectangle2: {...boundary, position:{
            x: boundary.position.x - 1.5,
            y: boundary.position.y
          }}
        })
      ){
        moving = false
        break
      }
    }
    if(moving){
      movables.forEach(movable => movable.position.x -= 1.5)
    }
  }
}

let lastKey = ''

window.addEventListener('keydown', (ev)=>{
  switch(ev.key){
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
  }
})

window.addEventListener('keyup', (ev)=>{
  switch(ev.key){
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
  }
})