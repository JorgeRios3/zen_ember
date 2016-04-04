import Ember from 'ember';
const {
	get,
	set,
	computed,
	observer,
	isEmpty,
	Logger: { info }
} = Ember;

export default Ember.Component.extend({
  attributeBindings: [ 'cuantos', 'dameTodos'],
  datos: null,
  hayError: false,
  mostrarDatos: false,
  dameTodos: false,
  cuantos: 5,
  sinInmueble: false,
  xetapa: null,
  etapa: null,
  asignacion: false,
  observaEtapa: observer('etapa', 'cuantos', function() {
    let etapa = get(this, 'etapa');
    this.set('mostrarDatos', false);
    Ember.Logger.info('entrando a observar etapa', etapa);
    if (!etapa) {
      Ember.Logger.info('etapa es nulo');
      return;
    }
    let that = this;
    let hashOfe;
    let cuantos = get(this, 'cuantos');
    info('cuantos es ', cuantos);
    try {
      if (get(this, 'dameTodos')) {
        hashOfe = { cuantos };
      } else {
        hashOfe = { etapa, cuantos };
      }
      if (get(this, 'sinInmueble')) {
        hashOfe.sininmueble = true;
      }
      info('hashOfe', hashOfe);
      this.get('store').query('ofertasreciente', hashOfe).then((data)=> {
        that.set('datos', data);
      }, function(error) {
        Ember.Logger.info('error al cargar promesa');
        that.set('hayError', true);
      });
    }
    catch(err) {
      info('hubo error en observaEtapa de componente ofertas-recientes ', err.message);
    }
  }),
  actions: {
    mostrar() {
      this.toggleProperty('mostrarDatos');
    },
    ocultar() {
      this.toggleProperty('mostrarDatos');
    },
    seleccionar(oferta) {
      info('valor de oferta en accion seleccionar', get(oferta, 'oferta'));
      this.sendAction('hacer', get(oferta, 'oferta'));
    }

  }
});
