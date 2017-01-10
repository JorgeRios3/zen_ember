import Ember from 'ember';
const {
  set,
  get,
  compued,
  Logger: { info },
  getProperties,
  setProperties,
  isEmpty
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
  actions: {
  	buscar() {
  	  let objeto = {};
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
      this.store.query('asignacionesreporte', objeto)
      .then((data)=> {
        let lista = Ember.A();
        lista = data;
        set(this, 'listaAsignaciones', lista);
      	info('promesa');
      });
      info('viendo elvalor deol obeo', objeto);

  	}
  }
});
