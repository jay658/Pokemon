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

let battleAnimationId
let queue = []
let opened = false
let potionQuantity = 2
let party = []
let sub = []
const allPokemon = []
let renderedSprites, charmander, pidgey, rattata, pikachu, eevee

function initBattle(){
  party = []
  sub = []
  document.querySelector('#mainPokemonHealthBar').style.width = '325px'
  document.querySelector('#itemsBox').style.display = 'none'
  document.querySelector('#userInterface').style.display ='block'
  document.querySelector('#dialogueBox').style.display ='none'
  document.querySelector('#enemyHealthBar').style.width ='100%'
  document.querySelector('#enemyHPNumber').innerHTML ='100/100'
  document.querySelector('#playerHealthBar').style.width = charmander? `${charmander.health}%` : '100%'
  document.querySelector('#playerHPNumber').innerHTML = charmander?`${charmander.health}/100` : `100/100`
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

  pidgey = new Pokemon({...pokemons.Pidgey, isEnemy:true, health:100})

  rattata = new Pokemon({...pokemons.Rattata, isEnemy:true, health:100})

  charmander = new Pokemon({...pokemons.Charmander,isMain: true, health:charmander? charmander.health:100})

  pikachu = new Pokemon({...pokemons.Pikachu})

  eevee = new Pokemon({...pokemons.Eevee})

  allPokemon.push(pidgey, charmander, pikachu, eevee, rattata)

  party.push(charmander, pikachu, eevee)
  const mainPokemon = party.find(pokemon=> pokemon.isMain === true)
  const enemies = allPokemon.filter(pokemon => pokemon.isEnemy === true)
  const enemy = enemies[Math.floor(Math.random() * enemies.length)]
  
  enemy.opacity = 1
  enemy.position = {
    x:550,
    y:90
  }

  document.querySelector('#enemyName').innerHTML = enemy.name
  
  sub = party.filter(pokemon=> !pokemon.isMain)
  
  sub.forEach((pokemon, idx)=>{
    document.querySelector(`#partyPokemonHealthBar${idx+1}`).style.width = `${325*pokemon.health/100}px`
    document.querySelector(`#partyImg${idx+1}`).src=`${pokemon.icon1}`
    document.querySelector(`#partyPokemonName${idx+1}`).innerHTML = pokemon.name
    document.querySelector(`#partyPokemonHP${idx+1}`).innerHTML = `${pokemon.health}/100`
  })

  renderedSprites = [enemyBase, myBase, enemy, mainPokemon]
  queue=[]
  
  document.querySelector('#mainPokemonName').innerHTML= mainPokemon.name
  document.querySelector('#partyImg0').src=`${mainPokemon.icon1}`
  
  const animations = []

  party.forEach((pokemon, idx)=>{
    animations.push(
      gsap.to(`#partyImg${idx}`,{
        attr:{
          src: `${pokemon.icon2}`
        },
        repeat:-1,
        repeatDelay:0.08,
        duration:0.15,
        yoyo:true,
      })
    )
    animations[idx].pause()

    document.querySelector(`#partyImg${idx}`).addEventListener('mouseover', ()=>{
      animations[idx].play()
    })
  
    document.querySelector(`#partyImg${idx}`).addEventListener('mouseleave', ()=>{
      animations[idx].pause()
      document.querySelector(`#partyImg${idx}`).src= pokemon.icon1
    })
  })

  document.querySelector('#noPickPokemon').addEventListener('click', ()=>{
    document.querySelector('#party').style.display = 'none'
    document.querySelector('#partyChat').style.display = 'none'
  })
  
  document.querySelector('#partyButton').addEventListener('click', ()=>{
    const newHP = 325 * mainPokemon.health/100
    document.querySelector('#mainPokemonHp').innerHTML = `${mainPokemon.health}/100`
    document.querySelector('#mainPokemonHealthBar').style.width = `${newHP}px`
    document.querySelector('#party').style.display = 'block'
    document.querySelector('#partyChat').style.display = 'block'
  })

  for(let i = 0; i < 4; i++){
    const attack = mainPokemon.attacks[i]
    if(mainPokemon.attacks[i]){
      const button = document.createElement('button')
      button.innerHTML = `<div>${attack.name}</div> <div>(${attack.type})</div>`
      button.value = attack.name
      button.classList.add('attacks')
      document.querySelector('#attacksBox').append(button)
    }else {
      const button = document.createElement('button')
      document.querySelector('#attacksBox').append(button)
    }
  }
  
  document.querySelectorAll('.attacks').forEach(button=>{
    button.addEventListener('click', (e)=>{
      const selectedAttack = attacks[e.currentTarget.value]
      mainPokemon.attack({ 
        attack: selectedAttack,
        recipient: enemy,
        renderedSprites
      })
      if(enemy.health <= 0){
        queue.push(()=>{
          enemy.faint()
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
      
      const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]
      return(
        queue.push(()=>{
          enemy.attack({ 
            attack: randomAttack,
            recipient: mainPokemon,
            renderedSprites
          })
    
          if(mainPokemon.health <= 0){
            queue.push(()=>{
              mainPokemon.faint()
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

//initBattle()
//animateBattle()
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
  const enemy = allPokemon.find(pokemon=> pokemon.isEnemy === true)
  const mainPokemon = party.find(pokemon=> pokemon.isMain === true) 
  const healthBar = document.querySelector('#playerHealthBar')
  const healthNumber = document.querySelector('#playerHPNumber')
  document.querySelector('#itemsBox').style.display = 'none'
  opened = false
  const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]
  if(potionQuantity === 0){
    document.querySelector('#dialogueBox').innerHTML = "You are out of potions!"
    document.querySelector('#dialogueBox').style.display = 'block'
  }
  else if(mainPokemon.health === 100){
    document.querySelector('#dialogueBox').innerHTML = `${mainPokemon.name} is already full health!`
    document.querySelector('#dialogueBox').style.display = 'block'
  }else{
    if(mainPokemon.health >= 90) mainPokemon.health = 100
    else mainPokemon.health += 20
    potionQuantity -=1
    document.querySelector('#potion').innerHTML = `Potion x${potionQuantity}`
    gsap.to(healthBar,{
      width: `${mainPokemon.health}%`,
      onComplete(){
        enemy.attack({
          attack: randomAttack,
          recipient: mainPokemon,
          renderedSprites
        })
      }
    })
    healthNumber.innerHTML=`${mainPokemon.health}/100`
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

