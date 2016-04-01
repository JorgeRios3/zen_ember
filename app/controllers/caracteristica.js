import Ember from 'ember';
const {
	get,
	set,
	computed,
	observer,
	isEmpty,
	Logger: { info }
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
  session: Ember.inject.service(),
  pruebaLotes: Ember.computed.sort('lotesArray', 'todosSortingDesc'),
  currentManzana: '0',
  currentNumeroInterior: '0',
  currentLoteElegido: '0',
  // hayCaracteristicas:computed.gt('carateristicasLista.length', 0),
  tramiteNuevoInmueble: '',
  todosSortingDesc: ['loteSort:asc'],
  agregarTramite: false,
  sortedTodosDesc: '',
  catalogoTramites: null,
  departamento: false,
  inmueblesdisponibles: '',
  cuantosInmueblesDisponibles: '',
  tramiteConsiderado: 0,
  selectedEtapa: null,
  etapas: '',
  selectedManzana: null,
  selectedInmueble: 0,
  numerointerior: '',
  numeroexterior: '',
  numerosExteriores: null,
  numerosInteriores: null,
  inmuebleBien: '',
  domicilio: '',
  inmueble: '',
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
  init() {
    this._super(...arguments);
    this.setProperties({
      etapas: Ember.ArrayProxy.create({ content: [] }),
      lotesArray: Ember.ArrayProxy.create({ content: [] }),
      inmueblesFiltrados: Ember.ArrayProxy.create({ content: [] })
    });
  },
  limpiaValores() {
    'fechaEstEntrega fechaRealEntrega fechaVencimiento fechaInicio record'.w().forEach((item)=> {
      set(this, item, '');
    });
    this.transitionToRoute('index');
  },
  ponerInmueble(loteoficial) {
    let cual = get(this, 'lotesArray').findBy('lote', loteoficial);
    let inmueble = get(cual, 'inmueble');
    set(this, 'selectedInmueble', inmueble);
  },
  observaSelectedInmueble: observer('selectedInmueble', function() {
    let inmueble = get(this, 'selectedInmueble');
    let that = this;
    // info('selectedInmueble paso');
    this.store.find('inmuebleindividual', inmueble)
    .then((dato) => {
      that.setProperties({
        domicilio: get(dato, 'domicilio'),
        inmueble,
        precioCatalogo: get(dato, 'precioCatalogo'),
        selectedPrecio: 0
      });
      that.store.query('caracteristicasinmueble', { inmueble })
      .then((data)=> {
        if (get(data, 'length') > 0) {
          set(that, 'hayCaracteristicas', true);
          set(that, 'carateristicasLista', data);
        } else {
          set(that, 'carateristicasLista', null);
          set(that, 'hayCaracteristicas', false);
        }
      });
    });
  }),
  actions: {
    selectedEtapaAction(item) {
      set(this, 'currentManzana', '0');
      set(this, 'hayCaracteristicas', false);
      set(this, 'carateristicasLista', null);
      set(this, 'currentLoteElegido', '0');
      let _this = this;
      this.setProperties({
        tramitesLista: '',
        inmueble: '',
        selectedEtapa: item.id,
        cuantosInmueblesDisponibles: 0,
        manzanasTramite: this.store.query('manzanastramite', { etapa: item.id })
      });
      this.store.find('etapastramite', item.id)
      .then((data)=> {
        set(_this, 'departamento', get(data, 'departamento'));
      });
      this.store.query('inmueblestramite', {
        etapa: get(this, 'selectedEtapa')
      }).then((data)=> {
        set(_this, 'cuantosInmueblesDisponibles', get(data, 'length'));
        set(_this, 'inmueblesdisponibles', data);
      });
    },
    seleccionaManzana(item) {
      if (typeof (item) === 'string') {
        return;
      }
      set(this, 'caracteristicasLista', null);
      set(this, 'hayCaracteristicas', false);
      set(this, 'currentNumeroInterior', '0');
      let manzana = get(item, 'manzana');
      let that = this;
      let mySet = new Set([]);
      this.setProperties({
        tramitesLista:  '',
        inmueble: '',
        muestraZonaCaptura: false,
        numerosExteriores: mySet
      });
      let numerosExteriores = get(this, 'numerosExteriores');
      let l = get(this, 'lotesArray');
      l.clear();
      get(this, 'inmueblesdisponibles').forEach((item)=> {
        if (manzana === item.get('manzana')) {
          lote = get(item, 'lote');
          l.pushObject(
						Ember.Object.create({
              manzana: get(item, 'manzana'),
              lote,
              loteSort: parseInt(lote),
              inmueble: get(item, 'id')
            })
          );
          get(that, 'numerosExteriores').add(lote.substring(0, 2));
        }
      });
      set(this, 'sortedTodosDesc', Ember.computed.sort('lotesArray', 'todosSortingDesc'));
    },
    loteElegido(item) {
      if (typeof (item) === 'string') {
        return;
      }
      let cual = get(item, 'lote');
      this.ponerInmueble(cual);
    },
    numeroExteriorElegido(edificio) {
      set(this, 'currentNumeroInterior', '0');
      set(this, 'numeroexterior', edificio);
      set(this, 'inmueble', '');
      set(this, 'hayCaracteristicas', false);
      set(this, 'caracteristicasLista', null);
      let that = this;
      let mySet2 = new Set([]);
      set(this, 'numerosInteriores', mySet2);
      return get(this, 'inmueblesdisponibles').filter((item)=> {
        let lote = get(item, 'lote');
        if (edificio === lote.substring(0, 2)) {
          get(that, 'numerosInteriores').add(lote.substring(2, 5));
          return true;
        } else {
          return false;
        }
      });
    },
    numeroInteriorElegido(depa) {
      if (parseInt(depa) === 0) {
        return;
      }
      let that = this;
      let ne = get(this, 'numeroexterior');
      let loteoficial = `${ne}${depa}`;
      let l = get(this, 'inmueblesdisponibles');
      let cual = l.findBy('lote', loteoficial);
      this.store.find('inmuebleindividual', cual.id)
      .then((dato)=> {
        that.setProperties(
        {
          domicilio: get(dato, 'domicilio'),
          selectedPrecio: 0,
          precioCatalogo: get(dato, 'precioCatalogo'),
          carateristicasLista: that.store.query('caracteristicasinmueble',
            {
              inmueble: cual.id,
              precio: get(that, 'selectedPrecio'),
              precioCatalogo: get(that, 'precioCatalogo'),
              etapa: get(that, 'selectedEtapa')
            }
          )
        }
		    );
      });
      set(this, 'inmueble', loteoficial);
      set(this, 'hayCaracteristicas', true);
    },
    buscar() {
      set(this, 'etapas', this.store.findAll('etapastramite', { reload: true }));
    }
  }
});
