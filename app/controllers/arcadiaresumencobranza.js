import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
const {
  get,
  set,
  observer,
  Logger: { info }
} = Ember;

export default Ember.Controller.extend(FormatterMixin, {
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
        if (parseInt(get(item, 'rubro')) < 2000) {
          let { enganche, ocurrenciasenganche, ocurrenciaspagos, pagos, porcentajeenganche, porcentajepagos, rubro, total, suma } = item.getProperties('enganche ocurrenciasenganche ocurrenciaspagos pagos porcentajeenganche porcentajepagos rubro total suma'.w());
          lista.pushObject({ rubro, enganche, ocurrenciasenganche, porcentajeenganche, pagos, ocurrenciaspagos, porcentajepagos, suma });

        } else {
          let { enganche, ocurrenciasenganche, ocurrenciaspagos, pagos, porcentajeenganche, porcentajepagos, rubro, total } = item.getProperties('enganche ocurrenciasenganche ocurrenciaspagos pagos porcentajeenganche porcentajepagos rubro total'.w());
          lista.pushObject({ rubro, enganche, ocurrenciasenganche, porcentajeenganche, pagos, ocurrenciaspagos, porcentajepagos, total });
        }
      });
    });
    set(this, 'datos', lista);
  })
});
