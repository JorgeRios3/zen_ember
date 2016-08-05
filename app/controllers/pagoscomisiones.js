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
  pagoImporte: null,
  pagoImpuesto: null,
  solicitudCheque: null,
  nuevaSolicitud: null,
  editable: false,
  nombreVendedor: '',
  esGerente: false,
  actions: {
  	toggleEditable() {
  	  this.toggleProperty('editable');
  	},
  	editarSolicitud(solicitud) {
      set(this, 'nuevaSolicitud', null);
      let r = get(this, 'pagoComision');
      set(r, 'solicitudcheque', solicitud);
      r.save()
      .then((data)=> {
      	this.toggleProperty('editable');
      	this.send('buscarPago');
      });
  	},
    buscarPago() {

      let pago = get(this, 'pago');
      // this.store.find('pagocomision', recibo)
      let lista = Ember.A();
      //this.store.unloadAll('pagocomision');
      this.store.find('pagocomision', pago)
      .then((data)=> {
        set(this, 'pagoComision', data);

        set(this, 'pagoImporte', this.formatter(get(data, 'pagoimporte')));
        set(this, 'pagoImpuesto', this.formatter(get(data, 'pagoimpuesto')));
        let solicitud = get(data, 'solicitudcheque');
        if (solicitud !== 0) {
        	this.store.find('solicitudcheque', solicitud)
        	.then((soli)=> {
        		set(this, 'solicitudCheque', soli);
        	});
        } else {
        	set(this,'solicitudCheque', null);
        }
        return this.store.query('pagocomisiondetalle', { pago })
  	      .then((data)=> {
  	  	    data.forEach((item)=> {
  	  	      let etapaFind = get(item, 'etapa');
              let etapaObjecto = get(this, 'listaEtapas').findBy('id', `${etapaFind}`);
              let etapaNombre = get(etapaObjecto, 'nombre');
  	  	      let { id, documento, inmueble, cuenta, manzana, lote, importe, nombrevendedor, esgerente }  = getProperties(item, 'id documento inmueble cuenta manzana lote importe nombrevendedor esgerente'.w());
  	  	      set(this, 'nombreVendedor', nombrevendedor);
  	  	      set(this, 'esGerente', esgerente);
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
  	  		set(this, 'comisionesLista', lista);
  	  	});

      }, (error)=> {
      	info('error no lo encontro');
      });
    }
  }
});
