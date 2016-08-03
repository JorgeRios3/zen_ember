import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
const {
  get,
  set,
  getProperties,
  observer,
  computed,
  Logger: { info }
} = Ember;

export default Ember.Controller.extend(FormatterMixin, {
  pago: '',
  pagoComision: null,
  comisionesLista:null,
  actions: {
    buscarPago() {

      let pago = get(this, 'pago');
      // this.store.find('pagocomision', recibo)
      let lista = Ember.A();
      this.store.find('pagocomision', pago)
      .then((data)=> {
        set(this, 'pagoComision', data);
        return this.store.query('pagocomisiondetalle', { pago })
  	      .then((data)=> {
  	  	    data.forEach((item)=> {
  	  	      info('entrando en la segunda promesa');
  	  	      let etapaFind = get(item, 'etapa');
              let etapaObjecto = get(this, 'listaEtapas').findBy('id', `${etapaFind}`);
              let etapaNombre = get(etapaObjecto, 'nombre');
  	  	      let { id, documento, inmueble, cuenta, manzana, lote, importe, nombrevendedor, esgerente }  = getProperties(item, 'id documento inmueble cuenta manzana lote importe nombrevendedor esgerente'.w());
  	  	      lista.pushObject({
  	  	        id,
  	  	        documento,
  	  	        inmueble,
  	  	        cuenta,
  	  	        etapaNombre,
  	  	        manzana,
  	  	        lote,
  	  	        importe: this.formatter(importe),
  	  	        nombrevendedor,
  	  	        esgerente
  	  	      });
  	  	    });
  	  	    info('entro valor de lista', lista);
  	  		set(this, 'comisionesLista', lista);
  	  	});

        info('si lo eoncontro', data);
      }, (error)=> {
      	info('error no lo encontro');
      })
    }
  }
});
