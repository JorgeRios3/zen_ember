import Ember from 'ember';
import moment from 'moment';

const {
  get,
  set,
  Logger: { info },
  setProperies,
  isEmpty
} = Ember;

export default Ember.Controller.extend({
  fechaInicial: '',
  fechaFinal: '',
  nullFechaInicial: null,
  nullFechaFinal: null,
  selectedEtapa: '',
  actions: {
  	buscar() {
  	  let objeto = {};
  	  objeto.etapa = get(this, 'selectedEtapa');
  	  let fInicial = get(this, 'fechaInicial');
  	  let fechainicial = !isEmpty(fInicial) ? fInicial.format('YYYY/MM/DD') : '';
  	  let fFinal = get(this, 'fechaFinal');
  	  let fechafinal = !isEmpty(fFinal) ? fFinal.format('YYYY/MM/DD') : '';
  	  objeto.fechainicial = fechainicial;
  	  objeto.fechafinal = fechafinal;
  	  this.store.query('inmueblesvendidosdescuento', objeto)
  	  .then((data)=> {
  	  	info('valor de data', data.length);
  	  	set(this, 'cuantos', get(data, 'length'));
  	    set(this, 'inmueblesLista', data);
  	  info('si llego');
  	  }, (error)=> {
  	  	info('trono');
  	  });
  	}
  }
});
