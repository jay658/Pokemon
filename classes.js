class Sprite {
  constructor({ position, velocity, img, frames = {max:1, hold:20}, sprites, animate=false, rotation=0}){
    this.position = position
    this.img = new Image()
    this.frames = {...frames, val: 0, elapsed: 0}

    this.img.onload = () => {
      this.width = this.img.width / this.frames.max
      this.height = this.img.height
    }
    this.img.src = img.src
    this.animate = animate
    this.sprites = sprites
    this.opacity = 1
    this.rotation = rotation
  }

  draw(isVertical = false, verticalFrames){
    c.save()
    c.translate(this.position.x +this.width/2, this.position.y +this.height/2)
    c.rotate(this.rotation)
    c.translate(-(this.position.x +this.width/2), -(this.position.y +this.height/2))
    c.globalAlpha = this.opacity
    if(!isVertical){
      c.drawImage(
        this.img, 
        this.frames.val * this.width,
        0,
        this.img.width/ this.frames.max,
        this.img.height,
        this.position.x,
        this.position.y,
        this.img.width/ this.frames.max,
        this.img.height,
      )
    }else{
      c.drawImage(
        this.img, 
        0,
        this.frames.val * this.height/3,
        this.img.width,
        this.img.height/verticalFrames,
        this.position.x,
        this.position.y,
        this.img.width,
        this.img.height/verticalFrames,
      )
    }
    c.restore()

    if(!this.animate) return
    if(this.frames.max > 1){
      this.frames.elapsed ++
    }
    if(this.frames.elapsed % this.frames.hold === 0){
      if(this.frames.val < this.frames.max - 1) this.frames.val++
      else this.frames.val = 0
    }
  }
}

class Pokemon extends Sprite{
  constructor({position, velocity, img, frames = {max:1, hold:20}, sprites, animate=false, rotation=0, isEnemy = false, name, attacks}){
    super({position, velocity, img, frames, sprites, animate, rotation})
    this.health = 100
    this.isEnemy = isEnemy
    this.name = name,
    this.attacks = attacks
  }

  faint(){
    document.querySelector('#dialogueBox').innerHTML = `${this.name} fainted!`
    gsap.to(this.position, {
      y:this.position.y +20
    })
    gsap.to(this, {
      opacity: 0
    })
  }

  attack({attack, recipient, renderedSprites}){
    
    document.querySelector('#dialogueBox').style.display ='block'
    document.querySelector('#dialogueBox').innerHTML = `${this.name} used ${attack.name}`

    let healthBar = '#enemyHealthBar'
    if(this.isEnemy) healthBar = '#playerHealthBar'

    let healthNumber = '#enemyHPNumber'
    if(this.isEnemy) healthNumber = '#playerHPNumber'

    let rotation = 1
    if(this.isEnemy) rotation = -2.2

    recipient.health -= attack.damage

    switch(attack.name){
      case 'Ember':
        const emberImage = new Image()
        emberImage.src = './img/ember.png'
        const ember = new Sprite({
          position:{
            x:this.position.x +150,
            y:this.position.y +100
          },
          img: emberImage,
          frames:{
            max:4,
            hold:10
          },
          animate:true,
          rotation
        })
        renderedSprites.splice(3,0, ember)
        gsap.to(ember.position, {
          x:recipient.position.x +75,
          y:recipient.position.y +75,
          onComplete: ()=>{
            gsap.to(healthBar,{
              width: `${recipient.health}%`
            })
            gsap.to(recipient.position, {
              x:recipient.position.x +20,
              yoyo:true,
              repeat:5,
              duration: .08
            })
            gsap.to(recipient, {
              opacity: 0,
              repeat:5,
              yoyo:true,
              duration: .08
            })
            document.querySelector(healthNumber).innerHTML= `${recipient.health}/100`
            renderedSprites.splice(3,1)
          }
        })
        break
      case 'Tackle': 
        const tl = gsap.timeline()

        let movementDistance = 30
        if(this.isEnemy) movementDistance = -30

        tl.to(this.position, {
          x:this.position.x - movementDistance
        }).to(this.position, {
          x:this.position.x +movementDistance * 2,
          duration: .2,
          onComplete: ()=>{
            //Enemy gets hit
            gsap.to(healthBar,{
              width: `${recipient.health}%`
            })
            gsap.to(recipient.position, {
              x:recipient.position.x +20,
              yoyo:true,
              repeat:5,
              duration: .08
            })
            gsap.to(recipient, {
              opacity: 0,
              repeat:5,
              yoyo:true,
              duration: .08
            })
            document.querySelector(healthNumber).innerHTML= `${recipient.health}/100`
          }
        }).to(this.position, {
          x:this.position.x
        })
      }
   }
}

class Boundary{
  static width = 64
  static height = 64
  constructor({position}){
    this.position = position
    this.height = 64
    this.width = 64
  }

  draw(){
    c.fillStyle = 'rgba(255, 0, 0, 0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}