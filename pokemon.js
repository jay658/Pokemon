const pikachuImage = new Image()

const pidgeyImage = new Image()

const pokemons = {
  Pikachu:{
    position:{
      x:140,
      y:278
    },
    img:{
      src:'./img/pikachu.png'
    },
    icon1:'./img/pikachu icon1.png',
    icon2: './img/pikachu icon image.png',
    name:'Pikachu',
    attacks:[attacks.Tackle, attacks.Ember]
  },
  Charmander:{
    position:{
      x:140,
      y:278
    },
    img:{
      src:'./img/charmander.png'
    },
    icon1:'./img/charmander icon2.png',
    icon2: './img/charmander image.png',
    name:'Charmander',
    attacks:[attacks.Tackle, attacks.Ember]
  },
  Pidgey:{
    position:{
      x:550,
      y:90
    },
    img:{
      src:'./img/pidgey.png'
    },
    isEnemy: true,
    name: 'Pidgey',
    attacks:[attacks.Tackle]
  }
}