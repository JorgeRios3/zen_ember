import Ember from 'ember';
const {
  set,
  get,
  computed,
  Logger: { info },
  getProperties,
  setProperties,
  isEmpty,
  observer
} = Ember;
export default Ember.Controller.extend({
  selectedFiltro: '',
  fechaCapturaIncial: '',
  fechaCapturaFinal: '',
  nullFechaCapturaInicial: '',
  nullFechaCapturaFinal: '',
  fechaProgramadaIncial: '',
  fechaProgramadaFinal: '',
  nullFechaProgramadaInicial: '',
  nullFechaProgramadaFinal: '',
  nullFechaProgramadaSolicitud: '',
  listaFiltro: [{ id: 1, label: 'Todo' }, { id: 2, label: 'Asignadas' }, { id: 3, label: 'Sin Asignar' }, { id: 4, label: 'Reactivaciones' }],
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
      if (parseInt(get(this, 'resultPage')) < get(this, 'resultPages')) {
        return true;
      } else {
        return false;
      }
    }
  }),
  actions: {
  	buscar() {
  	  let objeto = {};
      let lista = Ember.A();
      let requestedPage = get(this, 'requestedPage');
      if (requestedPage) {
        objeto.page = get(this, 'requestedPage');
      }
  	  if (!isEmpty(get(this, 'selectedEtapa'))) {
  	  	objeto.etapa = get(this, 'selectedEtapa');
  	  }
  	  if (!isEmpty(get(this, 'selectedFiltro'))) {
  	    objeto.filtro = get(this, 'selectedFiltro');
  	  }
  	  let fCapturaInicial = get(this, 'fechaCapturaInicial');
      let fechaCapturainicial = !isEmpty(fCapturaInicial) ? fCapturaInicial.format('YYYY/MM/DD') : '';
      let fCapturaFinal = get(this, 'fechaCapturaFinal');
      let fechaCapturafinal = !isEmpty(fCapturaFinal) ? fCapturaFinal.format('YYYY/MM/DD') : '';
      if (fechaCapturainicial) {
        objeto.fechaofertaini = fechaCapturainicial;
      }
      if (fechaCapturafinal) {
        objeto.fechaofertafin = fechaCapturafinal;
      }
      let fProgramadaInicial = get(this, 'fechaProgramadaInicial');
      let fechaProgramadainicial = !isEmpty(fProgramadaInicial) ? fProgramadaInicial.format('YYYY/MM/DD') : '';
      let fProgramadaFinal = get(this, 'fechaProgramadaFinal');
      let fechaProgramadafinal = !isEmpty(fProgramadaFinal) ? fProgramadaFinal.format('YYYY/MM/DD') : '';
      if (fechaProgramadainicial) {
        objeto.fechaasignaini = fechaProgramadainicial;
      }
      if (fechaProgramadafinal) {
        objeto.fechaasignafin = fechaProgramadafinal;
      }
      //objeto.cuantos = 1;
      this.store.query('asignacionesreporte', objeto)
      .then((data)=> {
        let cuantos = get(data, 'meta.cuantos');
        info('valor de cuantos', cuantos);
        set(this, 'cuantosLen', cuantos);
        cuantos > 20 ? set(this, 'showNavigation', true) : set(this, 'showNavigation', false);
        info('valor de show', get(this, 'showNavigation'));
        delete objeto.cuantos;
        this.store.query('asignacionesreporte', objeto)
        .then((data)=> {
          lista = data;
          set(this, 'listaAsignaciones', lista);
          info('promesa');
        });
        set(this, 'resultPage', get(data, 'meta.page'));
        set(this, 'resultPages', get(data, 'meta.pages'));
        info(get(this, 'resultPage'), get(this, 'resultPages'));
        //set(this, 'hayPagSiguientes', true);
      });
  	},
    mostrarPagPrevia() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage - 1;
      set(this, 'requestedPage', nextPage);
      this.send('buscar');
    },
    mostrarPagSiguiente() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage + 1;
      set(this, 'requestedPage', nextPage);
      this.send('buscar');
    },
  }
});
