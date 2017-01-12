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
  computed,
  observer
} = Ember;

export default Ember.Controller.extend(FormatterMixin,{
  fechaInicial: '',
  fechaFinal: '',
  nullFechaInicial: null,
  nullFechaFinal: null,
  selectedEtapa: '',
  resultPage: '',
  resultPages: '',
  selectedTipo: '1',
  mostrarResumen: false,
  resultRowCountFormatted: '',
  requestedPage: '',
  totalvendidosporetapa: '',
  requestedPage: '',
  filtroCobradas: [{'label': 'Vendidas sin Cobrar', 'value': ''}],
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
  observandoElTipo: observer('selectedTipo', function(){
    info('valor de selectedtipo', get(this, 'selectedTipo'));
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
    buscar2() {
      set(this, 'requestedPage', '');
      this.send('buscar');
    },
  	buscar() {
  	  let objeto = {};
  	  let etapa = get(this, 'selectedEtapa');
      objeto.etapa = etapa;
  	  let fInicial = get(this, 'fechaInicial');
  	  let fechainicial = !isEmpty(fInicial) ? fInicial.format('YYYY/MM/DD') : '';
  	  let fFinal = get(this, 'fechaFinal');
  	  let fechafinal = !isEmpty(fFinal) ? fFinal.format('YYYY/MM/DD') : '';
  	  objeto.fechainicial = fechainicial;
  	  objeto.fechafinal = fechafinal;
      objeto.cobradas = get(this, 'selectedTipo');
      let requestedPage = get(this, 'requestedPage');
      if (requestedPage) {
        objeto.page = requestedPage;
      }
  	  let totalneto = 0;
  	  let totalbase = 0;
  	  let totaldescuento = 0;
      let totalSubsidio = 0;
  	  let lista = Ember.A();
      objeto.cuantos = 1;
      this.store.unloadAll('inmueblesvendidosporetapa');
      this.store.query('inmueblesvendidosporetapa', {etapa})
      .then((data)=> {
        data.forEach((item)=>{
          let total = get(item, 'total');
          set(this, 'totalvendidosporetapa', total);
        });
      });
      this.store.query('inmueblesvendidosdescuento', objeto)
      .then((data)=> {
        info('qioerp ver este puto mentsaje');
        set(this, 'cuantos', data.meta.cuantos);
        set(this, 'totdescuentos', this.formatter(data.meta.totdescuentos));
        set(this, 'totprecios', this.formatter(data.meta.totprecios));
        set(this, 'totsubsidios', this.formatter(data.meta.totsubsidios));
      });
      if (get(this, 'cuantos') >100) {
        set(this, 'alert', true);
        set(this, 'alertmsg', 'La busqueda es mayor de 100');
      }
      delete(objeto["cuantos"]);
  	  this.store.query('inmueblesvendidosdescuento', objeto)
  	  .then((data)=> {
  	  	let cuantos = get(data, 'meta.cuantos');
  	  	if (cuantos > 20) {
          set(this, 'showNavigation', true);
        } else {
          set(this, 'showNavigation', false);
        }
  	  	info('bien');
  	  	let resultPage = get(data, 'meta.page');
  	  	let resultPages = get(data, 'meta.pages');
  	  	let resultRowCountFormatted = parseInt(get(data, 'meta.rowcountformatted'));
  	  	setProperties(this, { resultPage, resultPages, resultRowCountFormatted });
  	  	data.forEach((item)=> {
  	  	  let { descripcion, descuento, etapa, fecha, id ,lote, manzana, neto, preciobase, subsidio } = getProperties(item, `descripcion descuento 
  	  	  	etapa fecha id lote manzana neto preciobase subsidio`.w());
  	  	    totalneto += neto;
  	  	    totalbase += preciobase;
  	  	    totaldescuento += descuento;
            totalSubsidio += subsidio;
  	  	    lista.pushObject({ descripcion, descuento: this.formatter(descuento), 
  	  	    	etapa, fecha, id ,lote, manzana, 
  	  	    	neto: this.formatter(neto), 
  	  	    	preciobase: this.formatter(preciobase),
              subsidio: this.formatter(subsidio)});
  	  	});
  	  	info('valor de data', data.length);
  	  	//set(this, 'cuantos', get(data, 'length'));
  	    set(this, 'inmueblesLista', lista);
  	    set(this, 'totalneto', this.formatter(totalneto));
  	    set(this, 'totaldescuento', this.formatter(totaldescuento));
  	    set(this, 'totalbase', this.formatter(totalbase));
        set(this, 'totalSubsidio', this.formatter(totalSubsidio));
  	  },(error)=> {
  	  	info('trono');
  	  });
  	}
  }
});
