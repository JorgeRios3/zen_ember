import Ember from 'ember';
const {
  get,
  set,
  getProperties,
  setProperties,
  observer,
  computed,
  Logger: { info }
} = Ember;
export default Ember.Controller.extend({
  listaComisiones: null,
  observaSelectedEtapa: observer('selectedEtapa', function() {
    let etapa = get(this, 'selectedEtapa');
    let lista = [];
    if (etapa !== '0') {
      this.store.unloadAll('distribucioncomision');
      this.store.query('distribucioncomision', { etapa })
      .then((data)=> {
        data.forEach((item)=> {
          let {inmueble, manzana, lote, nombrevendedor, nombregerente, porcentaje} = getProperties(item, 'inmueble manzana lote nombrevendedor nombregerente porcentaje'.w());
          lista.pushObject({
            inmueble, manzana, lote, nombrevendedor, nombregerente, porcentaje
          });
        });
        set(this, 'listaComisiones', lista);
        info('si se cumpli promesa distribucioncomision');
      }, (error)=> {
        info('hubo error en proseme de distribucioncomision');
      });
    }
  })
});
