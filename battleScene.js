const battleBackgroundImage = new Image()

battleBackgroundImage.src = './img/field.png'

const battleBackground = new Sprite({
  position:{
    x:0,
    y:0
  },
  img:battleBackgroundImage
})

const enemyBaseImage = new Image()
enemyBaseImage.src = './img/grass_base1.png'

let enemyBase = new Sprite({
  position:{
    x: 500,
    y:200
  },
  img:enemyBaseImage
})

const myBaseImage = new Image()
myBaseImage.src = './img/grass_base0.png'

let myBase = new Sprite({
  position:{
    x:-50,
    y:500
  },
  img:myBaseImage
})

let pidgey = new Pokemon(pokemons.Pidgey)
let charmander = new Pokemon(pokemons.Charmander)
let renderedSprites = [enemyBase, myBase, pidgey, charmander]
let battleAnimationId
let queue = []
let opened = false
let potionQuantity = 2

const pidgeyAttack = ()=>{
  const randomAttack = pidgey.attacks[Math.floor(Math.random() * pidgey.attacks.length)]
  return(
    queue.push(()=>{
      pidgey.attack({ 
        attack: randomAttack,
        recipient: charmander,
        renderedSprites
      })

      if(charmander.health <= 0){
        queue.push(()=>{
          charmander.faint()
        })
        queue.push(()=>{
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: ()=>{
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#userInterface').style.display = 'none'
              gsap.to('#overlappingDiv', {
                opacity:0
              })
              battle.initiated = false
            }
          })
        })
      }
    })
  )
}

function initBattle(){
  document.querySelector('#mainPokemonHealthBar').style.width = '325px'
  document.querySelector('#itemsBox').style.display = 'none'
  document.querySelector('#userInterface').style.display ='block'
  document.querySelector('#dialogueBox').style.display ='none'
  document.querySelector('#enemyHealthBar').style.width ='100%'
  document.querySelector('#playerHealthBar').style.width ='100%'
  document.querySelector('#attacksBox').replaceChildren()
  enemyBase = new Sprite({
    position:{
      x: 500,
      y:200
    },
    img:enemyBaseImage
  })
  myBase = new Sprite({
    position:{
      x:-50,
      y:500
    },
    img:myBaseImage
  })
  pidgey = new Pokemon({...pokemons.Pidgey, position:{
    x:550,
    y:90
  }})
  charmander = new Pokemon({...pokemons.Charmander, position:{
    x:140,
    y:278
  }})
  renderedSprites = [enemyBase, myBase, pidgey, charmander]
  queue=[]

  const charmanderAnimation = gsap.to('#mainPokemonIcon',{
    attr:{
      src: "./img/charmander image.png"
    },
    repeat:-1,
    repeatDelay:0.08,
    duration:0.15,
    yoyo:true,
  })
  
  document.querySelector('#noPickPokemon').addEventListener('click', ()=>{
    charmanderAnimation
    document.querySelector('#party').style.display = 'none'
    document.querySelector('#partyChat').style.display = 'none'
  })
  
  document.querySelector('#partyButton').addEventListener('click', ()=>{
    const newHP = 325 * charmander.health/100
    document.querySelector('#mainPokemonHp').innerHTML = `${charmander.health}/100`
    document.querySelector('#mainPokemonHealthBar').style.width = `${newHP}px`
    document.querySelector('#party').style.display = 'block'
    document.querySelector('#partyChat').style.display = 'block'
  })
  
  document.querySelector('#mainPokemonIcon').addEventListener('mouseover', ()=>{
      charmanderAnimation.play()
    })
  
  document.querySelector('#mainPokemonIcon').addEventListener('mouseleave', ()=>{
    charmanderAnimation.pause()
    document.querySelector('#mainPokemonIcon').src='./img/charmander icon2.png'
  })

  charmander.attacks.forEach(attack=>{
    const button = document.createElement('button')
    button.innerHTML = `<div>${attack.name}</div> <div>(${attack.type})</div>`
    button.value = attack.name
    button.classList.add('attacks')
    document.querySelector('#attacksBox').append(button)
  })
  //our event listeners for our buttons (attack)
  document.querySelectorAll('.attacks').forEach(button=>{
    button.addEventListener('click', (e)=>{
      const selectedAttack = attacks[e.currentTarget.value]
      charmander.attack({ 
        attack: selectedAttack,
        recipient: pidgey,
        renderedSprites
      })
      if(pidgey.health <= 0){
        queue.push(()=>{
          pidgey.faint()
        })
        queue.push(()=>{
          gsap.to('#overlappingDiv', {
            opacity: 1,
            onComplete: ()=>{
              cancelAnimationFrame(battleAnimationId)
              animate()
              document.querySelector('#userInterface').style.display = 'none'
              gsap.to('#overlappingDiv', {
                opacity:0
              })
              battle.initiated = false
            }
          })
        })
      }
      //enemy attacks
      pidgeyAttack()
    })
  })
}

function animateBattle(){
  battleAnimationId = window.requestAnimationFrame(animateBattle)
  battleBackground.draw()
  renderedSprites.forEach(sprite=>{
    sprite.draw()
  })
}

// initBattle()
// animateBattle()
animate()


document.querySelector('#items').addEventListener('click', ()=>{
  if(document.querySelector('#itemsBox').style.display === 'none') {
    document.querySelector('#itemsBox').style.display = 'block'
  } else {
    document.querySelector('#itemsBox').style.display = 'none'
  }
})

document.querySelector('#dialogueBox').addEventListener('click', (e)=>{
  if(queue.length > 0){
    queue[0]()
    queue.shift()
  }else e.currentTarget.style.display = 'none'
})

document.querySelector('#potion').addEventListener('click', ()=>{
  const healthBar = document.querySelector('#playerHealthBar')
  const healthNumber = document.querySelector('#playerHPNumber')
  document.querySelector('#itemsBox').style.display = 'none'
  opened = false
  const randomAttack = pidgey.attacks[Math.floor(Math.random() * pidgey.attacks.length)]
  if(potionQuantity === 0){
    document.querySelector('#dialogueBox').innerHTML = "You are out of potions!"
    document.querySelector('#dialogueBox').style.display = 'block'
  }
  else if(charmander.health === 100){
    document.querySelector('#dialogueBox').innerHTML = "Charmander is already full health!"
    document.querySelector('#dialogueBox').style.display = 'block'
  }else{
    if(charmander.health >= 90) charmander.health = 100
    else charmander.health += 20
    potionQuantity -=1
    document.querySelector('#potion').innerHTML = `Potion x${potionQuantity}`
    gsap.to(healthBar,{
      width: `${charmander.health}%`,
      onComplete(){
        pidgey.attack({
          attack: randomAttack,
          recipient: charmander,
          renderedSprites
        })
      }
    })
    healthNumber.innerHTML=`${charmander.health}/100`
  }
})

document.querySelector('#run').addEventListener('click', ()=>{
  document.querySelector('#dialogueBox').innerHTML = "You have successfully ran away!"
  document.querySelector('#dialogueBox').style.display = 'block'
  queue.push(()=>{
    gsap.to('#overlappingDiv', {
      opacity: 1,
      onComplete: ()=>{
        cancelAnimationFrame(battleAnimationId)
        animate()
        document.querySelector('#userInterface').style.display = 'none'
        gsap.to('#overlappingDiv', {
          opacity:0
        })
        battle.initiated = false
      }
    })
  })
})

