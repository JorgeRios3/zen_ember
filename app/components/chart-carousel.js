import Ember from 'ember';

const {
  get,
  set,
  Logger: { info },
  observer,
  computed,
  inject: { service }
} = Ember;

let valor = '';
export default Ember.Component.extend({
  carrusel: service(),
  siguiente: '',
  features: null,
  cambiaTiempo: false,
  onOrOff: false,
  tiempo: 10,
  contador: '',
  cuenta() {
    let c = get(this, 'carrusel');
    let valorCarrusel = get(c, 'activateCarousel');
    let valor = get(this, 'contador');
    if (!valorCarrusel) {
      return;
    }
    let that = this;
    Ember.run.later(this, function() {
      valor = valor - 1;
      if (valor === 1) {
        set(that, 'contador', valor);
        return;
      }
      set(that, 'contador', valor);
      that.cuenta();
    }, 1000);
  },
  init() {
    this._super(...arguments);
    let c = get(this, 'carrusel');
    if (get(c, 'listaGlobal') === null) {
      set(c, 'listaGlobal', get(this, 'features.carousel'));
    }
    info('valor de lvalor en init', valor);
    set(this, 'onOrOff', get(c, 'activateCarousel'));
    let tiempo = get(c, 'tiempo');
    tiempo = tiempo / 1000;
    set(this, 'contador', tiempo);
    this.cuenta();
  },
  actions: {
    controlTiempo() {
      info('entro');
      this.toggleProperty('cambiaTiempo');
    },
    carrusel() {
      info(get(this, 'hola'));
      info('se fue por el activar');
      let c = get(this, 'carrusel');
      c.toggleProperty('activateCarousel');
      valor = get(c, 'activateCarousel');
      set(this, 'onOrOff', valor);
      let tiempo = get(this, 'tiempo') * 1000;
      if (tiempo < 5000) {
        tiempo = 5000;
      }
      c.hazCarrusel(tiempo);
    },
    stopCarrusel() {
      info('detuob el carrusel');
      let c = get(this, 'carrusel');
      set(c, 'activateCarousel', false);
    }
  }
});
