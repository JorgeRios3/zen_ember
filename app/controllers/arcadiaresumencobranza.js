import Ember from 'ember';

const {
  get,
  set,
  observer,
  Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  selectedYear: '',
  reconstruir: false,
  currentYear: moment().year(),
  diffYear: '',
  datos: null,
  observaSelectedYear: observer('selectedYear', function() {
    let reconstruir = '';
    if (get(this, 'reconstruir')) {
      reconstruir = true;
    }
    let lista = Ember.A();
    set(this, 'diffYear', get(this, 'selectedYear.nombre'));
    this.store.query('resumencobranzaarcadia', { years: get(this, 'selectedYear.year'), reconstruir }).then((data)=> {
      data.forEach((item)=> {
        let { enganche, ocurrenciasenganche, ocurrenciaspagos, pagos, porcentajeenganche, porcentajepagos, rubro, total } = item.getProperties('enganche ocurrenciasenganche ocurrenciaspagos pagos porcentajeenganche porcentajepagos rubro total'.w());
        lista.pushObject({ rubro, enganche, ocurrenciasenganche, porcentajeenganche, pagos, ocurrenciaspagos, porcentajepagos, total });
      });
    });
    set(this, 'datos', lista);
  })
});
