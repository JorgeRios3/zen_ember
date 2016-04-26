import Ember from 'ember';
const {
  get,
  set,
  Logger: { info },
  getProperties,
  isEmpty,
  computed,
  observer,
  setProperties
  } = Ember;
  let cuantosPrevio = null;
export default Ember.Controller.extend({
  fechaIncial: '',
  fechaFinal: '',
  nullFechaInicial: '',
  orden: '',
  nullFechaFinal: '',
  datosTabla: null,
  cargando: false,
  cuantos: '0',
  contrato: '',
  alignments: ['left','right','left','right','right','left','left','left','right'],
  titleCols: ['Nombre Obra', 'Proveedor', 'Estatus', 'Contrato Obra', 'Id Pago Factura Estimacion', 'Razon Social', 'Cheque', 'Fecha Programada', 'Importe'],
  ordenLista: [{id: '', nombre: 'Ascendente'}, { id:'1', nombre:'Desencente'}],

  resultPage: '',
  resultPages: '',
  mostrarResumen: false,
  resultRowCountFormatted: '',
  requestedPage: '',
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

  observaCuantos: observer('cuantos', function() {
  	let { store } = this;
  	let lista = Ember.A();
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
      info('setting showNavigation to true');
      objeto.page = 1;
    }
    // info('objecto vale ', objeto);
    let fInicial = get(this, 'fechaInicial');
    let fechainicial = !isEmpty(fInicial) ? fInicial.format('YYYY/MM/DD') : '';
    let fFinal = get(this, 'fechaFinal');
    let fechafinal = !isEmpty(fFinal) ? fFinal.format('YYYY/MM/DD') : '';
    objeto.fechainicial = fechainicial;
    objeto.fechafinal = fechafinal;
    objeto.page = get(this, 'requestedPage') || '1';
    objeto.descendente = get(this, 'orden');
    objeto.contratoobra = get(this, 'contrato');
    cuantosPrevio = cuantos;
    store.query('estimacionpago', objeto).then((data)=> {
      let resultPage = get(data, 'meta.page');
      let resultPages = get(data, 'meta.pages');
      let resultRowCountFormatted = get(data, 'meta.rowcountformatted');
      setProperties(this, { resultPage, resultPages, resultRowCountFormatted });
      data.forEach((item)=> {
        let { nombreobra, proveedor, estatus, contratoobra, idpagofacturaestimacion, razonsocial, cheque, fechaprogramada, importe } = getProperties(item, 'nombreobra proveedor estatus contratoobra idpagofacturaestimacion razonsocial cheque fechaprogramada importe'.w());
        lista.pushObject({ nombreobra, proveedor, estatus, contratoobra, idpagofacturaestimacion, razonsocial, cheque, fechaprogramada, importe });
      });
      set(this, 'datosTabla', lista);
      set(this, 'cargando', false);
    }, (error)=> {
      set(this, 'cargando', false);
    });
  }),

  actions: {
    mostrarPagPrevia() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage - 1;
      set(this, 'requestedPage', nextPage);
      // info(get(this, 'requestedPage'));
      this.send('pedir');
    },
    mostrarPagSiguiente() {
      info('valor de resultPage antes', get(this, 'resultPage'));
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage + 1;
      // info('valor de resultPage despues de sumar', get(this, 'resultPage'));
      set(this, 'requestedPage', nextPage);
      // info(get(this, 'requestedPage'));
      this.send('pedir');
    },
    pedir() {
    let objeto = {};
    set(this, 'cuantos', 0);
    set(this, 'cargando', true);
    let { store } = this;
    let fInicial = get(this, 'fechaInicial');
    let fechainicial = !isEmpty(fInicial) ? fInicial.format('YYYY/MM/DD') : '';
    let fFinal = get(this, 'fechaFinal');
    let fechafinal = !isEmpty(fFinal) ? fFinal.format('YYYY/MM/DD') : '';
    objeto.fechainicial = fechainicial;
    objeto.fechafinal = fechafinal;
    objeto.cuantos = 1;
    store.query('estimacionpago', objeto).then((data)=> {
      let cuantos = get(data, 'meta.cuantos');
      setProperties(this, { cuantos });
      if (cuantosPrevio !== cuantos) {
      	info('entro en notify');
        this.notifyPropertyChange('cuantos');
      }
    });
  	}
  }
});
