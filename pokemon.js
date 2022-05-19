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