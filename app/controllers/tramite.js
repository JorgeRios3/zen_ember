import Ember from 'ember';
import ajax from 'ember-ajax';
import moment from 'moment';
// import EmberValidations from 'ember-validations';
import config from '../config/environment';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  Logger: { info },
  getOwner,
  inject: { service }
} = Ember;

let etapa = Ember.Object.extend({
  id: '',
  departamento: '',
  nombre: ''
});

let lote = Ember.Object.extend({
  manzana: '',
  lote: ''
});

let inmuebleFiltrado = Ember.Object.extend({
  id: '',
  manzana: '',
  tramite: '',
  etapa: '',
  lote: '',
  entero: computed('lote', {
    get() {
      return parseInt(get(this, 'lote'));
    }
  })
});

let fechaAntes = '';

export default Ember.Controller.extend({
  session: service(),
  tramiteNuevoInmueble: '',
  todosSortingDesc: ['loteSort:asc'],
  agregarTramite: false,
  siHayInmuebleFiltrado: true,
  sortedTodosDesc: '',
  catalogoTramites: null,
  error: '',
  tramiteValor: false,
  muestraZonaCaptura: false,
  departamento: false,
  anticipocomision: '',
  apartado: '',
  gastosadministrativos: '',
  precioseguro: '',
  inmueblesdisponibles: null,
  cuantosInmueblesDisponibles: '',
  tramiteConsiderado: 0,
  selectedEtapa: null,
  etapas: '',
  manzanasTramite: '',
  bnumeroCredito: true,
  bmontoCredito: true,
  bmontoSubsidio: true,
  numeroCredito: '',
  montoCredito: '',
  montoSubsidio: '',
  comentario: '',
  selectedManzana: '',
  selectedInmueble: 0,
  numerointerior: '',
  numeroexterior: '',
  numerosExteriores: null,
  numerosInteriores: null,
  inmuebleBien: '',
  domicilio: '',
  inmueble: '',
  listaderecho: [1,2,30],
  isGestion: false,
  fechaInicial: '',
  nullfechaInicial: '',
  fechaEstEntrega: '',
  nullfechaEstEntrega: '',
  fechaRealEntrega: '',
  nullfechaRealEntrega: '',
  fechaVencimiento: '',
  nullfechaVencimiento: '',
  fechaInicio: '',
  nullFechaInicio: '',
  limpiarFecha: false,
  esGrabable: false,
  fechaValor: false,
  tramitesLista: '',
  tramites: null,
  huboErrorAlGrabar: false,
  fechaInicialAnterior: '',
  siExiste: false,
  selectedTramite: null,
  valorManzanaFiltrado: '',
  valorTramiteFiltrado: '',
  isManzanaFiltrado: false,
  otro: '',
  inmuebleSorteado: null,
  record: null,
  mostrarTabla: true,
  descripcionTramite: '',
  mutInmueble: '',
  mutInterior: '',
  selectedManzanaFiltrado: '',
  loteElegido: '',
  selectedNumeroExteriorElegido: '',
  selectedNumeroInteriorElegido: '',

  observarNumeroInteriorElegido: observer('selectedNumeroInteriorElegido', function() {
    if (get(this, 'selectedNumeroInteriorElegido') === '') {
      return;
    }
    let depa = get(this, 'selectedNumeroInteriorElegido');
    let that = this;
    let ne = get(this, 'numeroexterior');
    let loteoficial = `${ne}${depa}`;
    let l = get(this, 'inmueblesdisponibles');
    let cual = l.findBy('lote', loteoficial);
    this.store.find('inmuebleindividual', cual.id)
    .then((dato)=> {
      set(that, 'domicilio', get(dato, 'domicilio'));
    });
    set(this, 'inmueble', loteoficial);
    this.send('llenarTramites', cual.id);
  }),

  observaSelectedNumeroExteriorElegido: observer('selectedNumeroExteriorElegido', function() {
    if (get(this, 'selectedNumeroExteriorElegido') === '') {
      return;
    }
    let edificio = get(this, 'selectedNumeroExteriorElegido');
    info('entro en obserervaSelectedNumroExterior nuevo', edificio);
    set(this, 'selectedNumeroInteriorElegido', '');
    Ember.$('#X-inmueble option[value=0]').prop('selected', true);
    Ember.$('#x-interior option[value=0]').prop('selected', true);
    set(this, 'otro', '');
    set(this, 'numeroexterior', edificio);
    set(this, 'inmueble', '');
    set(this, 'tramitesLista', '');
    let that = this;
    let v = get(this, 'inmueblesdisponibles');
    let c = v.get('content');
    let mySet2 = new Set([]);
    set(this, 'numerosInteriores', mySet2);
    return c.filter((item)=> {
      let lote = get(item, 'lote');
      if (edificio === lote.substring(0, 2)) {
        get(that, 'numerosInteriores').add(lote.substring(2, 5));
        return true;
      } else {
        return false;
      }
    });
  }),

  observaSelectedManzana: observer('selectedManzana', function() {
    if (get(this, 'selectedManzana') === '') {
      return;
    }
    let manzana = get(this, 'selectedManzana');
    info('entro en observa selectedManzana');
    Ember.$('#X-inmueble option[value=0]').prop('selected', true);
    Ember.$('#x-exterior option[value=0]').prop('selected', true);
    Ember.$('#x-interior option[value=0]').prop('selected', true);
    let that = this;
    set(this, 'tramitesLista', '');
    set(this, 'inmueble', '');
    set(this, 'muestraZonaCaptura', false);
    let numerosExteriores = get(this, 'numerosExteriores');
    let c = get(this, 'inmueblesdisponibles');
    let l = get(this, 'lotesArray');
    let mySet = new Set([]);
    l.clear();
    set(this, 'numerosExteriores', mySet);
    info('paso el crear set y limpiar lotes array');
    c.forEach((item)=> {
      if (manzana === item.get('manzana')) {
        lote = get(item, 'lote');
        l.pushObject(Ember.Object.create({
          manzana: get(item, 'manzana'),
          lote,
          loteSort: parseInt(lote),
          inmueble: get(item, 'id')
        }));
        get(that, 'numerosExteriores').add(lote.substring(0, 2));
      }
    });
    set(this, 'sortedTodosDesc', computed.sort('lotesArray', 'todosSortingDesc'));
  }),

  observaLoteElegido: observer('loteElegido', function() {
    if (get(this, 'loteElegido') === '') {
      return;
    }
    let cual = get(this, 'loteElegido');
    info('valor de lote', cual);
    this.ponerInmueble(cual);
  }),

  observaManzanaFiltradoSeleccionada: observer('selectedManzanaFiltrado', function() {
    if (get(this, 'selectedManzanaFiltrado') === '') {
      return;
    }
    info('entro en observer manzanafiltradoselccionada');
    let that = this;
    let manzana = get(this, 'selectedManzanaFiltrado');
    this.store.unloadAll('inmueblesfiltrado');
    set(this, 'tramitesLita', '');
    set(this, 'inmueble', '');
    set(this, 'muestraZonaCaptura', false);
    let numerosExteriores = get(this, 'numerosExteriores');
    try {
      let l = get(this, 'lotesArray');
      l.clear();
      info('entro valor de manzana filtrado', manzana);
      let tramite = get(this, 'selectedTramite');
      let etapa = get(this, 'selectedEtapa');
      let origen = '';
      let catalogo = get(this, 'catalogoTramites');
      catalogo.forEach((item)=> {
        if (get(item, 'id') === tramite) {
          origen = get(item, 'origen');
        }
      });
      this.store.unloadAll('inmueblesfiltrado');
      this.store.query('inmueblesfiltrado', { etapa, origen, tramite, manzana })
      .then((data)=> {
        if (get(data, 'length')) {
          set(that, 'siHayInmuebleFiltrado', true);
        } else {
          set(that, 'siHayInmuebleFiltrado', false);
        }
        data.forEach((item)=> {
          l.pushObject(inmuebleFiltrado.create({
            manzana: get(item, 'manzana'),
            tramite: get(item, 'tramite'),
            etapa: get(item, 'etapa'),
            lote: get(item, 'lote'),
            inmueble: get(item, 'id'),
            loteSort: parseInt(get(item, 'lote'))
          }));
        });
        info('aqui llego manzana filtrado');
        set(that, 'sortedTodosDesc', computed.sort('lotesArray', 'todosSortingDesc'));
        Ember.$('#x-lote-filtrado option[value=0]').prop('selected', true);
      });
    } catch(e) {
      info('error en el try', e);
    }
  }),

  observaEtapaSeleccionada: observer('selectedEtapa', function() {
    if (get(this, 'selectedEtapa') === '') {
      return;
    } else {
      info('paso por aqui', get(this, 'selectedEtapa'));
      let etapa = get(this, 'selectedEtapa');
      let inmueblesdisponibles = get(this, 'inmueblesdisponibles');
      inmueblesdisponibles.clear();
      set(this, 'tramitesLista', '');
      set(this, 'inmueble', '');
      // set(this, 'selectedEtapa', item.id);
      let _this = this;
      set(_this, 'cuantosInmueblesDisponibles', 0);
      set(this, 'manzanasTramite', this.store.query('manzanastramite', { etapa }));
      this.store.find('etapastramite', etapa)
      .then((data)=> {
        set(_this, 'departamento', data.get('departamento'));
      });
      this.store.query('inmueblestramite', { etapa })
      .then((data)=> {
        try {
          let cuantos = get(data, 'length');
          info('cuantos es ', cuantos);
          set(_this, 'cuantosInmueblesDisponibles', cuantos);
          data.forEach((item)=> {
            inmueblesdisponibles.pushObject(item);
          });
        } catch (e) {
          info('callo en error buscado', e);
        }
      });
      this.store.find('parametrosetapa', get(this, 'selectedEtapa'))
      .then((data)=> {
        'anticipocomision apartado gastosadministrativos precioseguro'.w().forEach((key)=> {
          set(_this, key, data.get(key));
        });
      });
      set(this, 'selectedManzana', null);
      Ember.$('#x-manzana-filtrado option[value=0]').prop('selected', true);
      set(this, 'selectedTramite', null);
      set(this, 'muestraZonaCaptura', false);
    }
  }),

  init() {
    this._super(...arguments);
    'etapas lotesArray inmueblesFiltrados inmueblesdisponibles'.w().forEach((item)=> {
      this.set(item, Ember.ArrayProxy.create({ content: [] }));
    });

  },
  limpiaValores() {
    let that = this;
    'fechaEstEntrega fechaRealEntrega fechaVencimiento fechaInicio record'.w().forEach((item)=> {
      set(that, item, '');
    });
    this.transitionToRoute('index');
  },
  catalogoTramitePorAgregarFiltrado: computed('catalogoTramitePorAgregar', 'tramiteNuevoInmueble', {
    get() {
      let cat = get(this, 'catalogoTramitePorAgregar');
      let tra = get(this, 'tramites');
      return cat.filter((item)=> {
        let cual = tra.findBy('id', get(item, 'id'));
        let indice = tra.indexOf(cual);
        return indice !== -1;
      });
    }
  }),
  validanumero: observer('numeroCredito', 'montoCredito', 'montoSubsidio', function() {
    let that = this;
    ['numeroCredito','montoCredito','montoSubsidio'].forEach((item)=> {
      if (isEmpty(get(that, item))) {
        set(that, `b${item}`, true);
      } else {
        set(that, `b${item}`, Ember.$.isNumeric(get(that, item)));
      }
    });
  }),
  observaTramite: observer('selectedTramite', function() {
    set(this, 'tramitesLista', '');
    let a = !isEmpty(get(this, 'selectedTramite'));
    info('valor de a', a);
    set(this, 'isManzanaFiltrado', a);
    Ember.$('#x-manzana-filtrado option[value=0]').prop('selected', true);
    Ember.$('#x-lote-filtrado option[value=0]').prop('selected', true);
  }),
  observaManzana: observer('selectedManzana', function() {
    set(this, 'selectedInmueble', null);
  }),
  ponerInmueble(loteoficial) {
    info('lote oficial este es lote filtrado', loteoficial);
    let cual = get(this, 'lotesArray').findBy('lote', loteoficial);
    let inmueble = cual.get('inmueble');
    this.send('llenarTramites', inmueble);
    set(this, 'inmueble', inmueble);
    set(this, 'selectedInmueble', inmueble);
  },
  observaSelectedInmueble: observer('selectedInmueble', function() {
    if (get(this, 'selectedInmueble') === null) {
      return;
    }
    let inmueble = get(this, 'selectedInmueble');
    info('valor de inmueble en observar selectedInmuebke', inmueble);
    let that = this;
    this.store.find('inmuebleindividual', inmueble)
    .then((dato)=> {
      info('entro en la promesa si encontra algo');
      set(that, 'domicilio', dato.get('domicilio'));
    });
    set(this, 'mostrarTabla', true);
    this.store.unloadAll('tramite');
    set(this, 'tramitesLista', this.store.query('tramite', { inmueble }));
  }),

  observaFecha: observer('fechaInicial', function() {
    let that = this;
    let valor = get(this, 'fechaInicial');
    let a = !Ember.isEmpty(valor);
    set(this, 'esGrabable', a);
  }),
  observaFechaInicio: observer('fechaInicio', function() {
    let valor = get(this, 'fechaInicio');
    if (valor !== '') {
      set(this, 'esGrabable', true);
    } else {
      set(this, 'esGrabable', false);
    }
  }),
  actions: {
    abreCatalogoTramite() {
      let that = this;
      set(this, 'catalogoTramitePorAgregar', this.store.query('catalogotramiteporagregar', { inmueble: get(this, 'tramiteNuevoInmueble') }));
      get(this, 'catalogoTramitePorAgregar')
      .then((data)=> {
        that.toggleProperty('agregarTramite');
      });
    },
    agregaTramiteSelect(tram) {
      let that = this;
      let tramite = tram.id;
      let inmueble = get(this, 'tramiteNuevoInmueble');
      let date = new Date();
      let fecha = moment(date).format('YYYY/MM/DD');
      let model = this.store.createRecord('tramite', {
        inmueble,
        tramite,
        numeroCredito: '',
        montoCredito: '',
        montoSubsidio: '',
        comentario: '',
        fechaInicial: fecha,
        fechaInicio: '',
        fechaEstEntrega: '',
        fechaRealEntrega: '',
        fechaVencimiento: '',
        descripcion: '',
        origen: '',
        isGestion: ''
      });
      model.save().then(function() {
        that.send('llenarTramites', inmueble);
        that.toggleProperty('agregarTramite');
      });
    },
    enteradoHuboErrorAlGrabar() {
      set(this, 'huboErrorAlGrabar', false);
      set(this, 'mostrarTabla', true);
    },
    cancelar() {
      set(this, 'muestraZonaCaptura', false);
      set(this, 'mostrarTabla', true);
    },
    grabar() {
      let record = get(this, 'record');
      let valorFecha = '';
      let that = this;
      'fechaInicial fechaEstEntrega fechaRealEntrega fechaVencimiento fechaInicio'.w().forEach((item)=> {
        let valor = get(that, item);
        set(that, item, valor);
        if (valor) {
          valorFecha = moment(valor).format('YYYY/MM/DD');
        } else {
          valorFecha = '';
        }
        set(record, item, valorFecha);
      });

      'numeroCredito montoCredito montoSubsidio comentario'.w().forEach((item)=> {
        record.set(item, get(that, item));
      });
      record.save().then(()=> {
        set(that, 'muestraZonaCaptura', false);
        set(that, 'mostrarTabla', true);
      }, (error)=> {
        set(that, 'huboErrorAlGrabar', true);
        set(that, 'tramitesLista', '');
        set(that, 'error', error.errors.resultado[0]);
        set(that, 'muestraZonaCaptura', false);
        set(that, 'mostrarTabla', true);
      });

    },
    eliminar() {
      let that = this;
      let record = get(this, 'record');
      let id = get(record, 'id');
      info('eliminar tramite', id);
      this.store.find('tramite', id).then((tramite)=> {
        tramite.deleteRecord();
        // tramite.get('isDeleted'); // => true
        tramite.save(); // => DELETE to /posts/1
        set(that, 'muestraZonaCaptura', false);
        set(that, 'mostrarTabla', true);
      }, (error)=> {
        set(that, 'huboErrorAlGrabar', true);
        set(that, 'mostrarTabla', true);
      });
    },
    /*selectedEtapaAction(item) {
      set(this, 'tramitesLista', '');
      set(this, 'inmueble', '');
      set(this, 'selectedEtapa', item.id);
      let _this = this;
      set(_this, 'cuantosInmueblesDisponibles', 0);
      set(this, 'manzanasTramite', this.store.query('manzanastramite', { etapa: item.id }));
      this.store.find('etapastramite', item.id)
      .then((data)=> {
        set(_this, 'departamento', data.get('departamento'));
      });
      this.store.query('inmueblestramite', { etapa: get(this, 'selectedEtapa') })
      .then((data)=> {
        set(_this, 'cuantosInmueblesDisponibles', data.get('length'));
        set(_this, 'inmueblesdisponibles', data);
      });
      this.store.find('parametrosetapa', get(this, 'selectedEtapa'))
      .then((data)=> {
        'anticipocomision apartado gastosadministrativos precioseguro'.w().forEach((key)=> {
          set(_this, key, data.get(key));
        });
      });
      set(this, 'selectedManzana', null);
      Ember.$('#x-manzana-filtrado option[value=0]').prop('selected', true);
      set(this, 'selectedTramite', null);
      set(this, 'muestraZonaCaptura', false);
    },*/
    seleccionar(tramite) {
      let that = this;
      set(this, 'tramiteConsiderado', tramite);
      set(this, 'muestraZonaCaptura', true);
      set(this, 'siExiste', true);
      this.store.findRecord('tramite', tramite)
      .then((data)=> {
        set(that, 'mostrarTabla', false);
        set(that, 'descripcionTramite', get(data, 'descripcion'));
        set(that, 'record', data);
        set(that, 'isGestion', get(data, 'isGestion'));
        set(that, 'esGrabable', get(data, 'isGestion'));
        set(that, 'fechaInicial', get(data, 'fechaInicial'));

        fechaAntes = get(data, 'fechaInicial');
        set(that, 'fechaInicio', get(data, 'fechaInicio'));
        set(that, 'fechaEstEntrega', get(data, 'fechaEstEntrega'));
        set(that, 'fechaRealEntrega', get(data, 'fechaRealEntrega'));
        set(that, 'fechaVencimiento', get(data, 'fechaVencimiento'));
        set(that, 'numeroCredito', get(data, 'numeroCredito'));
        set(that, 'montoCredito', get(data, 'montoCredito'));
        set(that, 'montoSubsidio', get(data, 'montoSubsidio'));
      });
    },
    /*selectedManzana(manzana) {
      info('entro');
      Ember.$('#X-inmueble option[value=0]').prop('selected', true);
      Ember.$('#x-exterior option[value=0]').prop('selected', true);
      Ember.$('#x-interior option[value=0]').prop('selected', true);
      let that = this;
      set(this, 'tramitesLista', '');
      set(this, 'inmueble', '');
      set(this, 'muestraZonaCaptura', false);
      let numerosExteriores = get(this, 'numerosExteriores');
      let c = get(this, 'inmueblesdisponibles');
      let l = get(this, 'lotesArray');
      let mySet = new Set([]);
      l.clear();
      set(this, 'numerosExteriores', mySet);
      info('paso el crear set y limpiar lotes array');
      c.forEach((item)=> {
        if (manzana === item.get('manzana')) {
          lote = get(item, 'lote');
          l.pushObject(Ember.Object.create({
            manzana: get(item, 'manzana'),
            lote,
            loteSort: parseInt(lote),
            inmueble: get(item, 'id')
          }));
          get(that, 'numerosExteriores').add(lote.substring(0, 2));
        }
      });
      set(this, 'sortedTodosDesc', computed.sort('lotesArray', 'todosSortingDesc'));
    },*/

    /*selectedManzanaFiltrado(manzana) {
      let that = this;
      this.store.unloadAll('inmueblesfiltrado');
      set(this, 'tramitesLita', '');
      set(this, 'inmueble', '');
      set(this, 'muestraZonaCaptura', false);
      let numerosExteriores = get(this, 'numerosExteriores');
      try {
        let l = get(this, 'lotesArray');
        l.clear();
        info('entro valor de manzana filtrado', manzana);
        let tramite = get(this, 'selectedTramite');
        let etapa = get(this, 'selectedEtapa');
        let origen = '';
        let catalogo = get(this, 'catalogoTramites');
        catalogo.forEach((item)=> {
          if (get(item, 'id') === tramite) {
            origen = get(item, 'origen');
          }
        });
        // var l= get(this, 'inmueblesFiltrados');
        this.store.unloadAll('inmueblesfiltrado');
        this.store.query('inmueblesfiltrado', { etapa, origen, tramite, manzana })
        .then((data)=> {
          if (get(data, 'length')) {
            set(that, 'siHayInmuebleFiltrado', true);
          } else {
            set(that, 'siHayInmuebleFiltrado', false);
          }
          data.forEach((item)=> {
            l.pushObject(inmuebleFiltrado.create({
              manzana: get(item, 'manzana'),
              tramite: get(item, 'tramite'),
              etapa: get(item, 'etapa'),
              lote: get(item, 'lote'),
              inmueble: get(item, 'id'),
              loteSort: parseInt(get(item, 'lote'))
            }));
          });
          info('aqui llego manzana filtrado');
          set(that, 'sortedTodosDesc', computed.sort('lotesArray', 'todosSortingDesc'));
          Ember.$('#x-lote-filtrado option[value=0]').prop('selected', true);

        });
      } catch(e) {
        info('error en el try');
      }

    },*/

    /*loteElegido(cual) {
      info('valor de lote', cual);
      this.ponerInmueble(cual);
    },*/

    /*numeroExteriorElegido(edificio) {
      Ember.$('#X-inmueble option[value=0]').prop('selected', true);
      Ember.$('#x-interior option[value=0]').prop('selected', true);
      set(this, 'otro', '');
      set(this, 'numeroexterior', edificio);
      set(this, 'inmueble', '');
      set(this, 'tramitesLista', '');
      let that = this;
      let v = get(this, 'inmueblesdisponibles');
      let c = v.get('content');
      let mySet2 = new Set([]);
      set(this, 'numerosInteriores', mySet2);
      return c.filter((item)=> {
        let lote = get(item, 'lote');
        if (edificio === lote.substring(0, 2)) {
          get(that, 'numerosInteriores').add(lote.substring(2, 5));
          return true;
        } else {
          return false;
        }
      });
    },*/
    /*numeroInteriorElegido(depa) {
      let that = this;
      let ne = get(this, 'numeroexterior');
      let loteoficial = `${ne}${depa}`;
      let l = get(this, 'inmueblesdisponibles');
      let cual = l.findBy('lote', loteoficial);
      this.store.find('inmuebleindividual', cual.id)
      .then((dato)=> {
        set(that, 'domicilio', get(dato, 'domicilio'));
      });
      set(this, 'inmueble', loteoficial);
      this.send('llenarTramites', cual.id);
    },*/

    llenarTramites(lote) {
      set(this, 'tramitesLista', null);
      set(this, 'tramitesLista', this.store.query('tramite', { inmueble: lote }));
      set(this, 'tramiteNuevoInmueble', lote);
      set(this, 'catalogoTramitePorAgregar', this.store.query('catalogotramiteporagregar', { inmueble: lote }));
    },

    buscar() {
      let that = this;
      this.store.findAll('etapastramite')
      .then((etapa)=> {
        set(that, 'etapas', etapa);
      });
    }
  }
});
