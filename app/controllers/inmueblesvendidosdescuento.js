import Ember from 'ember';
import moment from 'moment';
import FormatterMixin from '../mixins/formatter';

const {
  get,
  set,
  Logger: { info },
  setProperties,
  isEmpty,
  getProperties
} = Ember;

export default Ember.Controller.extend(FormatterMixin,{
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
  	  let totalneto = 0;
  	  let totalbase = 0;
  	  let totaldescuento = 0;
  	  let lista = Ember.A();
  	  this.store.query('inmueblesvendidosdescuento', objeto)
  	  .then((data)=> {
  	  	data.forEach((item)=> {
  	  	  let { descripcion, descuento, etapa, fecha, id ,lote, manzana, neto, preciobase } = getProperties(item, `descripcion descuento 
  	  	  	etapa fecha id lote manzana neto preciobase`.w());
  	  	    totalneto += neto;
  	  	    totalbase += preciobase;
  	  	    totaldescuento += descuento;
  	  	    lista.pushObject({ descripcion, descuento: this.formatter(descuento), 
  	  	    	etapa, fecha, id ,lote, manzana, 
  	  	    	neto: this.formatter(neto), 
  	  	    	preciobase: this.formatter(preciobase) });
  	  	});
  	  	info('valor de data', data.length);
  	  	set(this, 'cuantos', get(data, 'length'));
  	    set(this, 'inmueblesLista', lista);
  	    set(this, 'totalneto', this.formatter(totalneto));
  	    set(this, 'totaldescuento', this.formatter(totaldescuento));
  	    set(this, 'totalbase', this.formatter(totalbase));
  	  info('si llego');
  	  }, (error)=> {
  	  	info('trono');
  	  });
  	}
  }
});
