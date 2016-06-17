import Ember from 'ember';
const {
  get,
  set,
  observer,
  getProperties,
  computed,
  Logger: { info }
} = Ember;
export default Ember.Controller.extend({
  referenciaRap: '',
  nombre: '',
  cuenta: '',
  referencia: '',
  cliente: '',
  etapa: '',
  manzana: '',
  lote: '',
  saldo: '',
  lista: Ember.A(),
  init() {
    this._super(...arguments);
    set(this, 'clientesLista', Ember.ArrayProxy.create({ content: [] }));
  },
  observaReferenciaRap: observer('referenciaRap', function() {
    let referenciaRap = get(this, 'referenciaRap');
    info('observando', referenciaRap);
    let lista = get(this, 'lista');
    if (referenciaRap.length > 3) {
      this.store.find('referenciasrapcuenta', referenciaRap)
      .then((data)=> {
        let { nombre, cuenta, referencia, cliente, etapa, manzana, lote, saldo } = getProperties(data, 'nombre cuenta referencia cliente etapa manzana lote saldo'.w());
        this.setProperties({
          nombre, cuenta, referencia, cliente, etapa, manzana, lote, saldo
        });
        lista.insertAt(0, {
          nombre, cuenta, referencia, cliente, etapa, manzana, lote, saldo
        });
        set(this, 'clientesLista', lista);
      }, (error)=> {
        info('no existe');
      });
    }
  }),
  actions: {
    limpiarLista() {
      info('entro');
      get(this, 'lista').clear();
    }
  }
});
