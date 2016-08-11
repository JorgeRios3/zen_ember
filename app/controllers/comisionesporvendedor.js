import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  Logger: { info },
  inject: { service },
  setProperties,
  getProperties
} = Ember;

export default Ember.Controller.extend(FormatterMixin, {
  selectedGerente: null,
  selectedVendedor: null,
  orden:'A',
  listaPagosComision: null,
  titleCols: 'id solicitudcheque estatussolicitud pagoimporte pagoimpuesto pagoreferencia pagotipo fechareconocimiento'.w(),
  alignments: ['left', 'left', 'left', 'right', 'right', 'left', 'left', 'left'],
  esVendedor: observer('auxselectedVendedor', function() {
  	let lista = Ember.A();
    info('si entro en auxselectedVendedor');
    let vendedor = get(this, 'auxselectedVendedor');
    let orden = get(this, 'orden')
    this.store.unloadAll('pagocomision');
    this.store.query('pagocomision', { vendedor, orden })
    .then((data)=> {
      data.forEach((item)=> {
        let { id, solicitudcheque, estatussolicitud, pagoimporte, 
        pagoimpuesto, pagoreferencia, 
        pagotipo, fechareconocimiento } = getProperties(item,  'id solicitudcheque estatussolicitud pagoimporte pagoimpuesto pagoreferencia pagotipo fechareconocimiento'.w());
        lista.pushObject({ id, solicitudcheque, estatussolicitud, 
        pagoimporte: this.formatter(pagoimporte), 
        pagoimpuesto: this.formatter(pagoimpuesto), 
        pagoreferencia, 
        pagotipo, fechareconocimiento });
      });
      set(this, 'listaPagosComision', lista);
      info('entro');
    },(error)=> {
      info('fallo');
    });
  }),
  misvendedores: computed('selectedGerente', {
    get() {
      if (get(this, 'selectedGerente') !== null) {
      	set(this, 'listaDocumentosComision', null);
      	set(this, 'totalSaldo', this.formatter(0));
        set(this, 'totalCargo', this.formatter(0));
        set(this, 'totalAbono', this.formatter(0));
        info('paso por selectedGerente cuando entro por vendedor puesto');
        return this.store.query('vendedorcomision', {gerente: get(this, 'selectedGerente')});
      }
    }
  }),
  observaSelectedVendedor: observer('selectedVendedor', function() {
  	let lista = Ember.A();
    info('si entro en auxselectedVendedor');
    let vendedor = get(this, 'selectedVendedor');
    let orden = get(this, 'orden')
    this.store.unloadAll('pagocomision');
    this.store.query('pagocomision', { vendedor, orden })
    .then((data)=> {
      data.forEach((item)=> {
        let { id, solicitudcheque, estatussolicitud, pagoimporte, 
        pagoimpuesto, pagoreferencia, 
        pagotipo, fechareconocimiento } = getProperties(item,  'id solicitudcheque estatussolicitud pagoimporte pagoimpuesto pagoreferencia pagotipo fechareconocimiento'.w());
        lista.pushObject({ id, solicitudcheque, estatussolicitud, 
        pagoimporte: this.formatter(pagoimporte), 
        pagoimpuesto: this.formatter(pagoimpuesto), 
        pagoreferencia, 
        pagotipo, fechareconocimiento });
      });
      set(this, 'listaPagosComision', lista);
      info('entro');
    info('entro en selected vendedor', get(this, 'selectedVendedor'));
  })
})
});
