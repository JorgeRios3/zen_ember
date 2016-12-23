import Ember from 'ember';
import moment from 'moment';
import FormatterMixin from '../mixins/formatter';

const {
  get,
  set,
  Logger: { info },
  setProperties,
  isEmpty,
  getProperties,
  computed
} = Ember;

export default Ember.Controller.extend(FormatterMixin,{
  fechaInicial: '',
  fechaFinal: '',
  nullFechaInicial: null,
  nullFechaFinal: null,
  selectedEtapa: '',
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
  actions: {
  	mostrarPagPrevia() {
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage - 1;
      set(this, 'requestedPage', nextPage);
      // info(get(this, 'requestedPage'));
      this.send('buscar');
    },
    mostrarPagSiguiente() {
      info('valor de resultPage antes', get(this, 'resultPage'));
      let nextPage = parseInt(get(this, 'resultPage'));
      nextPage = nextPage + 1;
      // info('valor de resultPage despues de sumar', get(this, 'resultPage'));
      set(this, 'requestedPage', nextPage);
      // info(get(this, 'requestedPage'));
      this.send('buscar');
    },
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
  	  	let cuantos = get(data, 'length');
  	  	set(this, 'showNavigation', cuantos > 20);
  	  	info('bien');
  	  	let resultPage = get(data, 'meta.page');
  	  	let resultPages = get(data, 'meta.pages');
  	  	let resultRowCountFormatted = get(data, 'meta.rowcountformatted');
  	  	setProperties(this, { resultPage, resultPages, resultRowCountFormatted });
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
  	  },(error)=> {
  	  	info('trono');
  	  });
  	}
  }
});
