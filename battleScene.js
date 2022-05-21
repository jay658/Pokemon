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
let party = []
let sub = []

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
  party = []
  sub = []
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

  pidgey = new Pokemon({...pokemons.Pidgey})

  charmander = new Pokemon({...pokemons.Charmander,isMain: true})

  pikachu = new Pokemon({...pokemons.Pikachu})

  party.push(charmander, pikachu)

  const mainPokemon = party.find(pokemon=> pokemon.isMain === true)
  sub = party.filter(pokemon=> !pokemon.isMain)
  
  sub.forEach((pokemon, idx)=>{
    document.querySelector(`#partyPokemonHealthBar${idx+1}`).style.width = `${325*pokemon.health/100}px`
    document.querySelector(`#partyImg${idx+1}`).src=`${pokemon.icon1}`
    document.querySelector(`#partyPokemonName${idx+1}`).innerHTML = pokemon.name
    document.querySelector(`#partyPokemonHP${idx+1}`).innerHTML = `${pokemon.health}/100`
  })

  renderedSprites = [enemyBase, myBase, pidgey, charmander]
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
  
  // const charmanderAnimation = gsap.to('#mainPokemonIcon',{
  //   attr:{
  //     src: `${mainPokemon.icon2}`
  //   },
  //   repeat:-1,
  //   repeatDelay:0.08,
  //   duration:0.15,
  //   yoyo:true,
  // })

  // charmanderAnimation.pause()

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
      mainPokemon.attack({ 
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

initBattle()
animateBattle()
// animate()


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
  const mainPokemon = party.find(pokemon=> pokemon.isMain === true) 
  const healthBar = document.querySelector('#playerHealthBar')
  const healthNumber = document.querySelector('#playerHPNumber')
  document.querySelector('#itemsBox').style.display = 'none'
  opened = false
  const randomAttack = pidgey.attacks[Math.floor(Math.random() * pidgey.attacks.length)]
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
        pidgey.attack({
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

