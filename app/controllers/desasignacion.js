import Ember from 'ember';
import EmberValidations from 'ember-validations';

const {
  get,
  set,
  observer,
  Logger: { info }
} = Ember;

let ErrorValidacion = Ember.Object.extend({
  variable: '',
  mensaje: '',
  campo: ''
});

export default Ember.Controller.extend(Ember.Evented, EmberValidations, {
  session: Ember.inject.service(),
  selectedNombre: '',
  selectedEtapa: '',
  catalogoNombres: '',
  nombre: '',
  manzana: '',
  lote: '',
  cuenta: '',
  cliente: '',
  oferta: '',
  errorAlGrabar: '',
  huboErrorAlGrabar: false,
  processingGrabar: false,
  muestroErrores: false,
  cuantos: '',
  maximo: Ember.computed.lt('cuantos', 101),
  validations: {
    nombre: { length: { minimum: 3 } },
    oferta: { numericality: { greaterThan: 0, messages: { greatherThan: 'Debe ser mayor a 0' } } }
  },
  init() {
    this._super(...arguments);
    set(this, 'erroresHabidos', Ember.ArrayProxy.create({ content: [] }));
    // set(this, 'cancelacion', Ember.ArrayProxy.create({content: []}));
  },
  observaCatNombre: observer('selectedNombre', function() {
    let that = this;
    let cual = get(this, 'catalogoNombres').findBy('cuenta', get(this, 'selectedNombre'));
    'cuenta manzana lote oferta cliente'.w().forEach((key) => {
      set(that, key, get(cual, key));
    });
  }),
  actions: {
    enteradoInspeccionarErrores() {
      this.toggleProperty('muestroErrores');
    },
    desasignar() {
      let that = this;
      let record = this.store.createRecord('desasignacion', { oferta: get(this, 'oferta'), cuenta: get(this, 'cuenta') });
      set(this, 'processingGrabar', true);
      record.save().then(()=> {
        set(that, 'catalogoNombres', null);
        set(that, 'processingGrabar', false);
        that.transitionToRoute('index');
      }, (error)=> {
        set(that, 'errorAlGrabar', '');
        set(that, 'processingGrabar', false);
        that.toggleProperty('huboErrorAlGrabar');
        let errorGenerado = '';
        try {
          errorGenerado = error.errors.resultado[0];
        } catch (er) {
          info('error en obtencion de error', er.message);
        }
        set(that, 'errorAlGrabar', errorGenerado);
      });
    },
    selectedEtapa(item) {
      set(this, 'selectedEtapa', item.id);
    },
    selectedNombre(item) {
      set(this, 'selectedNombre', item.cuenta);
    },
    buscar() {
      let that = this;
      let nombre = get(this, 'nombre');
      let etapa = get(this, 'selectedEtapa');
      info(`valor de selectedEtapa ${etapa}`);
      set(this, 'catalogoNombres', null);
      this.store.unloadAll('clientescuantosconcuentanosaldada');
      this.store.unloadAll('clientesconcuentanosaldada');
      this.store.query('clientescuantosconcuentanosaldada' , { etapa, nombre })
      .then((data) => {
        if (get(data, 'length')) {
          data.forEach((item) => {
            set(that, 'cuantos', get(item, 'cuantos'));
          });
        }
        if (parseInt(get(this, 'cuantos')) <= 100) {
          return this.store.query('clientesconcuentanosaldada', { etapa, nombre })
          .then((data) => {
            set(that, 'catalogoNombres', data);
            set(this, 'oferta', '');
          });
        }
      });
    },
    revisarErrores() {
      get(this, 'erroresHabidos').clear();
      Object.keys(get(this, 'errors')).forEach((que)=> {
        if (typeof que === 'string' || que instanceof String) {
          let error = get(this, `errors.${que}`);
          if (typeof error[0] === 'string' || error[0] instanceof String) {
            let [errmsg] = error;
            if (errmsg === 'is not a number') {
              errmsg = 'no es numérico';
            }
            get(this, 'erroresHabidos').pushObject(ErrorValidacion.create({
              variable: que,
              mensaje: errmsg,
              campo: this.getWithDefault(`label${que.capitalize()}`, '')
            }));
          }
        }
      });
      this.toggleProperty('muestroErrores');
    }
  }
});
