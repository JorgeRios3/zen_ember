import Ember from 'ember';
import moment from 'moment';

const {
	observer,
	get,
	set,
	Logger: { info },
  isEmpty,
	computed,
	getProperties,
	setProperties
} = Ember;

let cuantosPrevio = null;
export default Ember.Controller.extend({
  selectedEtapa: '',
  selectedTipo: '',
  nullFechaInicial: null,
  nullFechaFinal: null,
  fechaInicial: '',
  fechaFinal: '',
  total: '',
  totDocumentos: null,
  totMontoCredito: null,
  totMontoSubsidio: null,
  cuantos: 0,
  showNavigation: false,
  tipocobradas: computed.equal('selectedTipo', 'X'),
  inmuebles: null,
  cargando: false,
  resultPage: '',
  resultPages: '',
  resultRowCountFormatted: '',
  requestedPage: '',
  inmueblesLista: '',
  mostrarCaracteristicas: false,
  manzanaLoteFormateado: '',
  carateristicasLista: Ember.A(),
  hayPagPrevias: computed('resultPage', {
    get() {
      if (get(this, 'resultPage') === '') {
        return false;
      }
      if (parseInt(get(this, 'resultPage')) === 1) {
        return false;
      } else {
        return true;
      }
    }
  }),

  hayPagSiguientes: computed('resultPage', {
    get() {
      if (get(this, 'resultPage') === '') {
        return false;
      }
      if (parseInt(get(this, 'resultPage')) < parseInt(get(this, 'resultPages'))) {
        return true;
      } else {
        return false;
      }
    }
  }),
  init() {
    this._super(...arguments);
    set(this, 'tipos', Ember.ArrayProxy.create({ content: [{ valor: 'C', nombre: 'Cotejadas' }, { valor: 'F', nombre: 'Firma sin cotejo' },
	{ valor: 'E', nombre: 'En firma' }, { valor: 'I', nombre: 'Ingresadas' }, { valor: 'P', nombre: 'Por ingresar' }, { valor: 'S', nombre: 'Solicitados por cerrar' },
	{ valor: 'A', nombre: 'Asignados por solicitar' }, { valor: 'X', nombre: 'Cobradas' }, { valor: 'T', nombre: 'Taller infonavit' }] }));
    // set(this, 'inmueblesLista', Ember.ArrayProxy.create({ content: [] }));
  },
  etapaSeleccionada: observer('selectedEtapa', function() {
    let that = this;
    if (get(this, 'inmuebles') !== null) {
      set(that, 'inmuebles', null);
    }
    this.store.query('inmueblestramite', { etapa: get(this, 'selectedEtapa') })
    .then((data)=> {
      set(this, 'inmueblesLista', data);
    });
    info('valor de inmuebles', get(this, 'inmueblesLista'));
  }),
  tipoSeleccionado: observer('selectedTipo', function() {
    let that = this;
    if (get(this, 'inmuebles') !== null) {
      set(that, 'inmuebles', null);
    }
    // info('valor de selectedTipo', get(this, 'selectedTipo'));
    for (let key of 'totMontoCredito totMontoSubsidio totDocumentos'.w()) {
      set(this, key, '');
    }
  }),

  observaFechas: observer('fechaInicial', 'fechaFinal', function() {
    let finicial = moment(get(this, 'fechaInicial')).format('YYYY/MM/DD');
    let ffinal = moment(get(this, 'fechaFinal')).format('YYYY/MM/DD');
    // info(`${finicial}, ${ffinal}`);
  }),
  observaCuantos: observer('cuantos', function() {
    let objeto = {};
    let cuantos = get(this, 'cuantos');
    if (isEmpty(cuantos)) {
      cuantos = 0;
    }
    cuantos = parseInt(cuantos);
    // info(`hay ${cuantos}`);
    set(this, 'showNavigation', false);
    if (cuantos === 0) {
      // info('cuanto es igual a 0');
      set(this, 'cargando', false);
      return;
    }
    if (cuantos > 20) {
      set(this, 'showNavigation', true);
      // info('setting showNavigation to true');
      objeto.page = 1;
    }
    if (get(this, 'tipocobradas')) {
      objeto.fechainicial = moment(get(this, 'fechaInicial')).format('DD/MM/YYYY');
      if (objeto.fechainicial === 'Invalid date') {
        objeto.fechainicial = '';
      }
      objeto.fechafinal = moment(get(this, 'fechaFinal')).format('DD/MM/YYYY');
      if (objeto.fechafinal === 'Invalid date') {
        objeto.fechafinal = '';
      }
    }
    // info('objecto vale ', objeto);
    objeto.etapa = get(this, 'selectedEtapa');
    objeto.tipo = get(this, 'selectedTipo');
    objeto.page = get(this, 'requestedPage') || '1';
    cuantosPrevio = cuantos;
    this.store.query('detallecobranza', objeto)
    .then((data)=> {
      let totMontoCredito = get(data, 'meta.totmontocredito');
      let totMontoSubsidio = get(data, 'meta.totmontosubsidio');
      let totDocumentos = get(data, 'meta.totdocumentos');
      let resultPage = get(data, 'meta.page');
      let resultPages = get(data, 'meta.pages');
      let resultRowCountFormatted = get(data, 'meta.rowcountformatted');
      setProperties(this, { totDocumentos, totMontoCredito, totMontoSubsidio, resultPage, resultPages, resultRowCountFormatted });
      set(this, 'inmuebles', data);
      set(this, 'cargando', false);
    }, (error)=> {
      set(this, 'cargando', false);
    });
  }),
  actions: {
    cerrarModal() {
      this.toggleProperty('mostrarCaracteristicas');
    },
    muestraCaracteristicas(manzana, lote) {
      set(this, 'manzanaLoteFormateado', `${manzana} ${lote}`);
      let that = this;
      let Inmueble = '';
      let domicilio = '';
      let selectedPrecio = '';
      let PrecioCatalogo = '';
      get(this, 'carateristicasLista').clear();
      get(this, 'inmueblesLista').filter((item) => {
        if (get(item, 'manzana') === manzana && get(item, 'lote') === lote) {
          info('valor de item bueno', get(item, 'id'), get(item, 'manzana'), get(item, 'lote'));
          Inmueble = get(item, 'id');
        }
      });
      this.store.find('inmuebleindividual', Inmueble)
      .then((dato)=> {
        domicilio = get(dato, 'domicilio'),
        selectedPrecio = 0,
        PrecioCatalogo = get(dato, 'precioCatalogo');
        this.store.query('caracteristicasinmueble', {
          inmueble: Inmueble,
          precio: selectedPrecio,
          precioCatalogo: PrecioCatalogo,
          etapa: get(this, 'selectedEtapa') }).then((otro) => {
            otro.forEach((item)=> {
              get(that, 'carateristicasLista').pushObject(item);
            });
          });
      });
      this.toggleProperty('mostrarCaracteristicas');

    },
    mostrarPagPrevia() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage - 1;
      set(this, 'requestedPage', nextPage);
      // info(get(this, 'requestedPage'));
      this.send('pedir');
    },
    mostrarPagSiguiente() {
      // info('valor de resultPage antes', get(this, 'resultPage'));
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage + 1;
      // info('valor de resultPage despues de sumar', get(this, 'resultPage'));
      set(this, 'requestedPage', nextPage);
      // info(get(this, 'requestedPage'));
      this.send('pedir');
    },
    pedir() {
      set(this, 'cuantos', 0);
      let that = this;
      set(this, 'cargando', true);
      let objeto = {};

      if (get(this, 'tipocobradas')) {
        objeto.fechainicial = moment(get(this, 'fechaInicial')).format('DD/MM/YYYY');
        if (objeto.fechainicial === 'Invalid date') {
          objeto.fechainicial = '';
        }
        objeto.fechafinal = moment(get(this, 'fechaFinal')).format('DD/MM/YYYY');
        if (objeto.fechafinal === 'Invalid date') {
          objeto.fechafinal = '';
        }
      }
      objeto.etapa = get(this, 'selectedEtapa');
      objeto.tipo = get(this, 'selectedTipo');
      // objeto.page = get(this, 'requestedPage') || '1';
      if (true === true) {
        objeto.cuantos = 1;
        that.store.query('detallecobranza', objeto)
        .then((data)=> {
          // info('valor de data', data);
          let totMontoCredito = get(data, 'meta.totmontocredito');
          // info('totMontoCredito ', totMontoCredito);
          let totMontoSubsidio = get(data, 'meta.totmontosubsidio');
          let totDocumentos = get(data, 'meta.totdocumentos');
          let cuantos = get(data, 'meta.cuantos');
          setProperties(this, { cuantos });
          if (cuantosPrevio !== cuantos) {
            this.notifyPropertyChange('cuantos');
          }
        }, (error)=> {
          info('error en llamado a detallecobranza');
        });
      }
    }
  }
});