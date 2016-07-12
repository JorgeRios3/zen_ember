import Ember from 'ember';
import EmberValidations from 'ember-validations';
import config from '../config/environment';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  Logger: { info }
} = Ember;

let ErrorValidacion = Ember.Object.extend({
  variable: '',
  mensaje: '',
  campo: ''
});

let NumeroExterior = Ember.Object.extend({
  numero: ''
});

let log = Ember.Logger.info;

export default Ember.Controller.extend(Ember.Evented, EmberValidations, {
  session: Ember.inject.service(),
  // 'etapasofertas', 'preciosinmuebles','manzanasdisponibles','inmueblesdisponibles','prospectosofertas',
  // needs: ['clientessinofertas'],
  cantidadDescuento: null,
  codigoDescuento: '',
  seGrabo: false,
  comentarioValor: '',
  clientesofertas: null,
  clientessinofertas: null,
  todosSortingDesc: ['loteSort:asc'],
  sortedTodosDesc: '',
  origenCliente: false,
  labelProspecto: 'Prospecto',
  labelCliente: 'Cliente',
  labelAfiliacion: 'Afiliación de Prospecto',
  labelReferencia: 'Referencia RAP',
  labelMontocredito: 'Monto de Crédito',
  labelSelectedEtapa: 'Etapa',
  labelSelectedManzana: 'Manzana',
  labelSelectedInmueble: 'Lote',
  labelSelectedPrecio: 'Precio del Inmueble',
  labelSumaCheca: 'Sumas',
  domicilio: '',
  hayCaracteristicas: computed.gt('carateristicasLista.length', 0),
  etapasofertas: null,
  preciosinmuebles: null,
  inmueblesdisponibles: '',
  featureControl: false,
  inmuebleSaldo: '',
  errorMessage: '',
  candadoPrecio: '',
  precioCatalogo: '',
  processingGrabar: false,
  selectedEtapa: null,
  selectedPrecio: null,
  selectedManzana: null,
  selectedLote: null,
  selectedInmueble: null,
  hayClientesSinOfertas: false,
  numerointerior: '',
  numeroexterior: '',
  numerosExteriores: null,
  numerosInteriores: null,
  proxyNumerosExteriores: null,
  precio: '',
  precioRaw: null,
  inmueble: '',
  manzana: '',
  lote: '',
  cuantosInmueblesDisponibles: 0,
  flagLista: false,
  huboErrorAlGrabar: false,
  muestroErrores: false,
  errorAlGrabar: '',
  comodin: Ember.inject.service('comodin'),

  init() {
    this._super(...arguments);
    set(this, 'precios', Ember.ArrayProxy.create({ content: [] }));
    set(this, 'erroresHabidos', Ember.ArrayProxy.create({ content: [] }));
  },

  
  observaFlagLista: observer('flagLista', function() {
    if (get(this, 'flagLista')) {
      this.requestList();
      this.toggleProperty('flagLista');
    }
  }),
  observaSelectedInmueble: observer('selectedInmueble', function() {
    let that = this;
    let antes = get(this, 'selectedInmueblePrevio');
    let despues = get(this, 'selectedInmueble');
    set(this, 'inmueble', despues);
    if (Ember.isEmpty(antes) && Ember.isEmpty(despues)) {
      info('no hay nada');
    } else {
      if (Ember.isEmpty(despues)) {
        set(this, 'domicilio', '');
        this.send('freeInmueble', antes);
      } else {
        let p = this.store.find('inmuebleindividual', despues);
        p.then((dato)=> {
          set(that, 'domicilio', dato.get('domicilio'));
          set(that, 'candadoPrecio', dato.get('candadoPrecio'));
          set(that, 'precioCatalogo', dato.get('precioCatalogo'));
          set(that, 'selectedPrecio', 0);
          let p1 = that.store.find('catalogoprecio', despues);
          p1.then((dato)=> {
            let idPrecioCatalogo = get(dato, 'idPrecioCatalogo');
            if (idPrecioCatalogo !== 0) {
              info('paso la prueba', get(dato, 'idPrecioCatalogo'));
            } else {
              info('se fue por el else no hay idPrecioCatalogo');
              return;
            }
          });
          let p2 = that.store.query('caracteristicasinmueble', { inmueble: despues, precio: get(that, 'selectedPrecio'), precioCatalogo: get(that, 'precioCatalogo'), etapa: get(that, 'selectedEtapa') });
          p2.then((data)=> {
            if (get(data, 'length') > 0) {
              set(that, 'carateristicasLista', data);
            } else {
              set(that, 'carateristicasLista', null);
            }
          }, (error)=> {

          });
        });
      }
    }
  }),
  /* highLightAndTrue: function(key) {
    if (!Ember.isEmpty(key)) {
      set(this, key, true);
    }
  }.on('highlightandtrue'),*/
  mislotes: computed('selectedManzana', {
    get() {
      let that = this;
      let manzana = get(this, 'selectedManzana');
      info('valor de manzana', manzana);
      // var v = get(this, 'controllers.inmueblesdisponibles');
      let c = get(this, 'inmueblesdisponibles');
      let isDepto = get(this, 'departamento');
      if (get(this, 'departamento')) {
        let mySet = new Set([]);
        set(this, 'numerosExteriores', mySet);
      }
      return c.filter(function(item) {
        let m = item.get('manzana');
        let lote = item.get('lote');
        if (m === manzana) {
          if (isDepto) {
            get(that, 'numerosExteriores').add(lote.substring(0, 2));
          }
          return true;
        } else {
          return false;
        }
      });
    }
  }),
  misprecios: computed('selectedEtapa', {
    get() {
      info('aqui truena');
      let etapa = parseInt(get(this, 'selectedEtapa'));
      info('valor de etapa', etapa);
      // var v = get(this, 'controllers.preciosinmuebles');
      let c = get(this, 'preciosinmuebles');
      let that = this;
      set(this, 'cuantosprecios', 0);
      return c.filter(function(item) {
        let e = item.get('etapa');
        if (e === etapa) {
          that.incrementProperty('cuantosprecios');
          info('la libro mis precios');
          return true;
        } else {
          return false;
        }
      });
      info('la libro mis precios');
    }
  }),
  observaEtapa: observer('selectedEtapa', function() {
    let _this = this;
    set(_this, 'cuantosInmueblesDisponibles', 0);
    // get(this, 'manzanasdisponibles').
    set(this, 'manzanasdisponibles', this.store.query('manzanasdisponible', { etapa: get(this, 'selectedEtapa') }));
    let etapaPromesa =  this.store.find('etapasoferta', get(this, 'selectedEtapa'));
    etapaPromesa.then((data)=> {
      set(_this, 'departamento', data.get('departamento'));
    });
    let idisp = this.store.query('inmueblesdisponible', { etapa: get(this, 'selectedEtapa') });
    idisp.then((data)=> {
      set(_this, 'cuantosInmueblesDisponibles', data.get('length'));
    });
    let params = this.store.find('parametrosetapa', get(this, 'selectedEtapa'));
    params.then((data)=> {
      'anticipocomision apartado gastosadministrativos precioseguro'.w().forEach((key)=> {
        set(_this, key, get(data, key));
      });
    });
    //  get(this, 'controllers.inmueblesdisponibles').
    set(this, 'inmueblesdisponibles', idisp);
    //  set(this, 'selectedManzana', null);
  }),
  
  observaManzana: observer('selectedManzana', function() {
    set(this, 'selectedInmueble', null);
  }),
  observaPrecios: observer('selectedPrecio', function() {
    if (isEmpty(get(this, 'selectedEtapa'))) {
      return;
    }
    let precioid = get(this, 'selectedPrecio');
    // var v = get(this,'controllers.preciosinmuebles');
    let c = get(this, 'preciosinmuebles');
    let item = c.findBy('id', precioid);
    if (!get(this, 'candadoPrecio')) {
      set(this, 'precioRaw', get(item, 'precioraw'));
    }
  }),
  // clientesofertas : Ember.computed.alias('controllers.clientesofertas'),
  // clientessinofertas : Ember.computed.alias('controllers.clientessinofertas'),
  validations: {
    selectedEtapa: {
      exclusion: { in: [null] , message: 'Debe seleccionar etapa' }
    },
    selectedManzana: {
      exclusion: { in: [null], message: 'Debe seleccionar manzana' }
    },
    selectedInmueble: {
      exclusion: { in: [null] , message: 'Debe seleccionar inmueble' }
    },
    cantidadDescuento: {
      numericality: { allowBlank: false},
      exclusion: { in: [null], message: 'Debe tener descuento con numero' }
    },
    comentarioValor: {
      exclusion: { in: [''], message: 'Debe de tener comentario' }
    }
    /* oferta: {
      numericality: { onlyInteger: true, messages: { onlyInteger: 'la oferta solo debe contenter numeros' } }
    } */
  },
  actions: {
    grabar() {
      let comentario = get(this, 'comentarioValor');
      let descuento = get(this, 'cantidadDescuento');
      let inmueble = get(this, 'inmueble');
      let record = this.store.createRecord('autorizaciondescuento', {
        comentario,
        descuento,
        inmueble
      });
      record.save().then((data)=> {
        set(this, 'seGrabo', true);
        set(this, 'codigoDescuento', get(data, 'autorizacion'))
      },(error)=> {
        info('no se grabo');
      });
    },
    revisarErrores() {
      let _this = this;
      get(this, 'erroresHabidos.content').clear();
      Object.keys(this.get('errors')).forEach((que)=> {
        if (typeof que === 'string' || que instanceof String) {
          let error = get(_this, `errors.${que}`);
          if (typeof error[0] === 'string' || error[0] instanceof String) {
            let [errmsg] = error;
            if (errmsg === 'is not a number') {
              errmsg = 'no es numérico';
            }
            get(_this, 'erroresHabidos.content').pushObject(ErrorValidacion.create({
              variable: que,
              mensaje: errmsg,
              campo: _this.getWithDefault(`label${que.capitalize()}`, '')
            }));
          }
        }
      });
      this.toggleProperty('muestroErrores');
    },
    enteradoHuboErrorAlGrabar() {
      this.toggleProperty('huboErrorAlGrabar');
    },
    okGraboConExito() {
      set(this, 'seGrabo', false);
      set(this, 'codigoDescuento', '');
      this.transitionToRoute('index');
    },
    enteradoInspeccionarErrores() {
      this.toggleProperty('muestroErrores');
    },
    numeroExteriorElegido(edificio) {
      set(this, 'numeroexterior', edificio);
      let that = this;
      // var v = get(this, 'controllers.inmueblesdisponibles');
      let c = get(this, 'inmueblesdisponibles');
      let mySet2 = new Set([]);
      set(this, 'numerosInteriores', mySet2);
      return c.filter(function(item) {
        let lote = item.get('lote');
        if (edificio === lote.substring(0, 2)) {
          get(that, 'numerosInteriores').add(lote.substring(2, 5));
          return true;
        } else {
          return false;
        }
      });
    },
    numeroInteriorElegido(depa) {
      let ne = get(this, 'numeroexterior');
      let loteoficial = `${ne}${depa}`;
      let misLotes = get(this, 'mislotes');
      let cual = misLotes.findBy('lote', loteoficial);
      let inmueble = cual.get('id');
      set(this, 'selectedInmueble', inmueble);
    }
  }
});
