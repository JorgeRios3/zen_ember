import Ember from 'ember';
import moment from 'moment';

const {
  get,
  set,
  observer,
  computed,
  isEmpty,
  getProperties,
	setProperties,
  Logger: { info }
} = Ember;

let cuantosPrevio = null;
export default Ember.Controller.extend({
  fechaInicial: '',
  fechaFinal: '',
  nullFechaInicial: '',
  nullFechaFinal: '',
  selectedTipo: '',
  cuantos: 0,
  requestedPage: '',
  showNavigation: false,
  resultPage: '',
  resultPages: '',
  resultRowCountFormatted: '',
  selectedEmpresa: '',
  hayCuantos: computed.gt('cuantos', 0),
  dataCheques: null,
  cargando: false,

  titulosCheques: computed('selectedTipo', {
    get() {
      if (get(this, 'selectedTipo') === 'ingreso') {
        return ['Centro de Costo', 'Partida', 'Subpartida 1', 'Subpartida 2', 'Subpartida 3', 'Subpartida 4', 'Subpartida 5', 'Cantidad'];
      } else {
        return ['Empresa', 'Cuenta', 'Cheque', 'Beneficiario', 'Cantidad', 'Fecha'];
      }
    }
  }),

  alignments: computed('selectedTipo', {
    get() {
      if (get(this, 'selectedTipo') === 'ingreso') {
        return ['left','left','left','left','left','left','left','right'];
      } else {
        return ['left','left','left','left','right','left'];
      }
    }
  }),

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
    set(this, 'opciones', Ember.ArrayProxy.create({ content: [{ id: 'ingreso', opcion: 'ingresos' }, { id: 'chequesfondeado', opcion: 'cheques fondeados' }] }));
  },
  observaCuantos: observer('cuantos', function() {
    let objeto = {};
    let cuantos = get(this, 'cuantos');
    if (isEmpty(cuantos)) {
      cuantos = 0;
    }
    cuantos = parseInt(cuantos);
    set(this, 'showNavigation', false);
    if (cuantos === 0) {
      set(this, 'cargando', false);
      return;
    }
    if (cuantos > 20) {
      set(this, 'showNavigation', true);
      objeto.page = 1;
    }
    objeto.fechainicial = moment(get(this, 'fechaInicial')).format('DD/MM/YYYY');
    if (objeto.fechainicial === 'Invalid date') {
      objeto.fechainicial = '';
    }
    objeto.fechafinal = moment(get(this, 'fechaFinal')).format('DD/MM/YYYY');
    if (objeto.fechafinal === 'Invalid date') {
      objeto.fechafinal = '';
    }
    if (get(this, 'selectedEmpresa') !== '') {
      objeto.empresa = get(this, 'selectedEmpresa');
    }
    objeto.page = get(this, 'requestedPage') || '1';
    cuantosPrevio = cuantos;
    let modelo = get(this, 'selectedTipo');
    this.store.query(modelo, objeto)
    .then((data)=> {
      let resultPage = get(data, 'meta.page');
      let resultPages = get(data, 'meta.pages');
      let resultRowCountFormatted = get(data, 'meta.rowcountformatted');
      setProperties(this, { resultPage, resultPages, resultRowCountFormatted });
      let lista  = Ember.A();
      if (modelo === 'chequesfondeado') {
        data.forEach((item)=> {
          lista.pushObject(
            item.getProperties('empresa cuenta cheque beneficiario cantidad fecha'.w())
          );
        });
      }
      if (modelo === 'ingreso') {
        data.forEach((item)=> {
          lista.pushObject(
            item.getProperties('centrodecosto partida subpartida1 subpartida2 subpartida3 subpartida4 subpartida5 cantidad'.w())
          );
        });
      }
      set(this, 'dataCheques', lista);
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
      let objeto = {};
      objeto.fechainicial = moment(get(this, 'fechaInicial')).format('DD/MM/YYYY');
      if (objeto.fechainicial === 'Invalid date') {
        objeto.fechainicial = '';
      }
      objeto.fechafinal = moment(get(this, 'fechaFinal')).format('DD/MM/YYYY');
      if (objeto.fechafinal === 'Invalid date') {
        objeto.fechafinal = '';
      }
      objeto.cuantos = 1;
      if (get(this, 'selectedEmpresa') !== '') {
        objeto.empresa = get(this, 'selectedEmpresa');
      }
      let modelo = get(this, 'selectedTipo');
      	this.store.query(modelo, objeto)
      	.then((data)=> {
        let cuantos = get(data, 'meta.cuantos');
        setProperties(this, { cuantos });
        if (cuantosPrevio !== cuantos) {
          this.notifyPropertyChange('cuantos');
        }
      }, (error)=> {
        info('error en llamado a ', modelo);
      });
    }
  }

});
