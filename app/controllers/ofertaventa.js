import Ember from 'ember';
import ajax from 'ember-ajax';
import moment from 'moment';
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

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  selectedEtapa: '',
  selectedGerente: '',
  selectedEstatus: '',
  selectedOrden: '',
  catalogo: '',
  fechaInicial: '',
  fechaFinal: '',
  // fechaInicial: null,
  // fechaFinal: null,
  resultPage: '',
  resultPages: '',
  resultRowCountFormatted: '',
  requestedPage: 0,
  metaRDB: '',
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
  muestraNavegacion: computed('resultPage', {
    get() {
      let cuantos = get(this, 'resultPages');
      if (Ember.isEmpty(cuantos)) {
        return false;
      }
      return parseInt(cuantos) > 1;
    }
  }),
  init() {
    this._super(...arguments);
    set(this, 'estatus', Ember.ArrayProxy.create({ content: [{ id: 1, nombre: 'Activada' }, { id: 2, nombre: 'Cancelada' }, { id: 3, nombre: 'Todas' }] }));
    set(this, 'ordenado', Ember.ArrayProxy.create({ content: [{ id: 1, nombre: 'Oferta' }, { id: 2, nombre: 'Cliente' }, { id: 3, nombre: 'Vendedor' }, { id: 4, nombre: 'Cancelacion' }] }));
  },
  limpiaFechas: computed('fechaInicial', 'fechaFinal', {
    get() {
      if (get(this, 'fechainIcial') !== '' && get(this, 'fechaFinal')) {
        info('entro');
        return true;
      } else {
        return false;
      }
    }
  }),

  actions: {
    limpiarFechas() {
      set(this, 'fechaInicial', null);
      set(this, 'fechaFinal', null);
    },
    seleccionaEtapa(item) {
      set(this, 'selectedEtapa', item.id);
    },
    seleccionaGerente(item) {
      set(this, 'selectedGerente', item.id);
    },
    seleccionaEstatus(item) {
      set(this, 'selectedEstatus', item.id);
    },
    seleccionaOrden(item) {
      set(this, 'selectedOrden', item.id);
    },
    mostrarPagPrevia() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage - 1;
      set(this, 'requestedPage', nextPage);
      info(get(this, 'requestedPage'));
      this.send('pedir');
    },
    mostrarPagSiguiente() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage + 1;
      set(this, 'requestedPage', nextPage);
      info(get(this, 'requestedPage'));
      this.send('pedir');
    },
    togglePrinterComponent() {
      this.toggleProperty('showComponent');
    },
    pedir() {
      this.store.unloadAll('ofertabusqueda');
      let that = this;
      let objectparam = {};
      info('valor de fechaInicial', get(this, 'fechaInicial'));
      let etapa = get(this, 'selectedEtapa');
      // etapa!=='' ? objectparam['etapa']=etapa : '';
      objectparam.etapa = etapa !== '' ? etapa : '';
      let gerente = get(this, 'selectedGerente');
      // gerente!=='' ? objectparam['gerente']=gerente : '';
      objectparam.gerente = gerente !== '' ? gerente : '';
      let estatus = get(this, 'selectedEstatus');
      // estatus!=='' ? objectparam['estatus']=estatus : '';
      objectparam.estatus = estatus !== '' ? estatus : '';
      let orden = get(this, 'selectedOrden');
      // orden!=='' ? objectparam['orden']=orden : '';
      objectparam.orden = orden !== '' ? orden : '';
      let fInicial = get(this, 'fechaInicial');
      let fechainicial = !isEmpty(fInicial) ? fInicial.format('DD/MM/YYYY') : '';
      objectparam.fechaInicial = fechainicial;
      let fFinal = get(this, 'fechaFinal');
      let fechafinal = !isEmpty(fFinal) ? fFinal.format('DD/MM/YYYY') : '';
      objectparam.fechaFinal = fechafinal;
      objectparam.page = get(this, 'requestedPage') || '1';
      info(`${etapa} ${gerente} ${estatus} ${orden}`);
      set(this, 'catalogo', this.store.query('ofertabusqueda', objectparam));
      this.store.query('ofertabusqueda', objectparam)
      .then((data)=> {
        set(that, 'cuantosBusqueda', '');
        set(that, 'catalogo', data);
        set(that, 'resultPage', get(data, 'meta.page'));
        set(that, 'resultPages', get(data, 'meta.pages'));
        set(that, 'metaRDB', get(data, 'meta.rdb'));
        info(get(that, 'metaRDB'));
        set(that, 'resultRowCountFormatted', get(data, 'meta.rowcountformatted'));
      });
    }
  }
});
