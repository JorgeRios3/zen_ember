import Ember from 'ember';

const {
  get,
  set,
  computed,
  observer,
  isEmpty,
  Logger: { info },
  inject: { service },
  setProperties
} = Ember;

export default Ember.Controller.extend({
  listaDocumentosComision: null,
  listaMovimientosComision: null,
  muestraDocumentos: true,
  labelDocumento: '',
  session: service(),
  selectedGerente: null,
  selectedVendedor: null,
  observaSelectedVendedor: observer('selectedVendedor', function() {
    if (get(this, 'selectedVendedor') !== null) {
      let lista = Ember.A();
      this.store.unloadAll('documentocomision');
      this.store.query('documentocomision', {vendedor: get(this, 'selectedVendedor')})
      .then((data)=> {
        data.forEach((item)=> {
          lista.pushObject(item);
        });
        set(this, 'listaDocumentosComision', lista);
      });
    }
  }),
  nombrevendedor: observer('gtevdor', function() {
  	  let idVendedorCatalogo = null;
  	  let lista = Ember.A();
  	  let nombre = '';
      let que = get(this, 'gtevdor');
      if (get(que, 'idvendedor') !== 0 && get(que, 'idgerente') !== 0) {
      	info('pidiendo vendedorcomision');
        this.store.query('vendedorcomision', { gerente: get(que, 'idgerente') })
        .then((data)=> {
          data.forEach((item)=> {
            if(get(que, 'idvendedor') === get(item, 'vendedor')) {
              info(get(item, 'id'));
              idVendedorCatalogo = get(item, 'id');
            }
          });
          this.store.query('documentocomision', { vendedor: idVendedorCatalogo})
          .then((data)=> {
            data.forEach((item)=> {
              lista.pushObject(item);
            });
            set(this, 'listaDocumentosComision', lista);
          });
        });
      } else {
      	info('no es gerente ni vendedor');
      }
  }),
  misvendedores: computed('selectedGerente', {
    get() {
      if( get(this, 'selectedGerente') !== null){
        info('paso por selectedGerente cuando entro por vendedor puesto');
        return this.store.query('vendedorcomision', {gerente: get(this, 'selectedGerente')});
      }
    }
  }),
  actions: {
    selectedDocumento(documento) {
      set(this, 'labelDocumento', get(documento, 'id'));
      this.toggleProperty('muestraDocumentos');
      let lista = Ember.A();
      this.store.query('movimientocomision', { documento: get(documento, 'id') })
      .then((data)=> {
      	data.forEach((item)=> {
      	  lista.pushObject(item);
      	});
      });
      set(this, 'listaMovimientosComision', lista);
    },
    cerrarMovimientos() {
      set(this, 'listaMovimientosComision', null);
      this.toggleProperty('muestraDocumentos');
    }
  }
});
