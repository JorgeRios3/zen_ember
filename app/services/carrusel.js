import Ember from 'ember';

const {
  get,
  set,
  isEmpty,
  computed,
  observer,
  Logger: { info }
} = Ember;

let listaGlobal = ['panorama', 'ventaspordia', 'cobradasporsemana', 'mediospublicitarios', 'asignadasporsemana', 'ventasporsemana'];
export default Ember.Service.extend({
  listaCarrusel: '',
  observaListaCarrusel: observer('listaCarrusel', function() {
    get(this, 'listaCarrusel').w().forEach((item)=>{
      if (listaGlobal.indexOf(item) !== -1){
        //info('agregando a la lista', item);
        get(this, 'lista').push(item);
      }
    });
  }),
  lista: [], //listaGlobal,
  activateCarousel: false,
  siguiente: '',
  tiempo: '',
  hazCarrusel(tiempo) {
    set(this, 'tiempo', tiempo);
    let r = get(this, 'router');
    if (!get(this, 'lista').includes(get(r, 'currentRouteName'))) {
      //info('entre en ruta fuera de lista');
      set(this, 'activateCarousel', false);
      return;
    }
    info('entro en hazCarrusel');
    if (!get(this, 'activateCarousel')) {
    	return;
    }
    let that = this;
  	let lista = get(this, 'lista');
    let dondeEstoy = get(r, 'currentRouteName');
    let adondeVoy= lista.indexOf(dondeEstoy)+1;
    adondeVoy = lista[adondeVoy];

    if (isEmpty(adondeVoy)) {
      adondeVoy = lista[0];
    }
    info('adonde voy', adondeVoy);
  	//let b = lista.shift();
  	//lista.push(b)
    this.get('router').transitionTo(adondeVoy);
  	Ember.run.later(adondeVoy, function() {
  	  info('corriendo el later de ', dondeEstoy);
  	  that .hazCarrusel(get(that, 'tiempo'));
    }, get(that, 'tiempo'));
  }

  
});
