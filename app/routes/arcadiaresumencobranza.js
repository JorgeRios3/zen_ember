import Ember from 'ember';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import FormatterMixin from '../mixins/formatter';
const {
	set,
	get,
	Logger: { info }
} = Ember;
export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, FormatterMixin, {
  setupController(controller, model) {
    let r = get(model, 'resumen');
    let fecha = get(r, 'meta.fecha');
    set(controller, 'fecha', fecha);
    let yearsList = Ember.A();
    let today = moment().year();
    for (let i = 0; i < 10; i++) {
      let years = parseInt(today) - i;
      let year = i + 1;
      yearsList.pushObject({ 'nombre': years, year });
    }
    set(controller, 'yearsList', yearsList);
    let lista = Ember.A();
    let promesaResumen = get(model, 'resumen');
    set(controller, 'titleCols', ['Rubro', 'Enganche', 'OE', 'Porcentaje Enganche', 'Pagos', 'OP', 'Porcentaje Pagos', 'Total']);
    set(controller, 'alignments', ['right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right']);
    promesaResumen.forEach((item)=> {
      if (parseInt(get(item, 'rubro')) < 2000) {
        let { enganche, ocurrenciasenganche, ocurrenciaspagos, pagos, porcentajeenganche, porcentajepagos, rubro, total, suma } = item.getProperties('enganche ocurrenciasenganche ocurrenciaspagos pagos porcentajeenganche porcentajepagos rubro total suma'.w());
        lista.pushObject({ rubro, enganche, ocurrenciasenganche, porcentajeenganche, pagos, ocurrenciaspagos, porcentajepagos, suma });

      } else {
        let { enganche, ocurrenciasenganche, ocurrenciaspagos, pagos, porcentajeenganche, porcentajepagos, rubro, total } = item.getProperties('enganche ocurrenciasenganche ocurrenciaspagos pagos porcentajeenganche porcentajepagos rubro total'.w());
        lista.pushObject({ rubro, enganche, ocurrenciasenganche, porcentajeenganche, pagos, ocurrenciaspagos, porcentajepagos, total });
      }
    });
    set(controller, 'datos', lista);
  },
  model() {
    return Ember.RSVP.hash({
      resumen: this.store.query('resumencobranzaarcadia', { reconstruir: '' })
    });
  }
});
