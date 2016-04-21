import Ember from 'ember';
import FormatterMixin from '../mixins/formatter';
import RouteAuthMixin from '../mixins/routeauth';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const {
	get,
	set,
	Logger: { info },
	setProperties
} = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, RouteAuthMixin, FormatterMixin, {
  beforeModel(transition) {
    this._super(...arguments);
  },
  setupController(ctrl, model) {
    ctrl.setProperties({
      datos: Ember.A(),
      fileName: get(model, 'meta.filename')
    });
    model.forEach((item)=> {
      let objeto = {};
      objeto = { contrato: get(item, 'contrato'),
        obra: get(item, 'obra'),
        fecha: get(item, 'fecha'),
        valorcontrato: get(item, 'valorcontrato'),
        facturado: get(item, 'facturado'),
        porfacturar: get(item, 'porfacturar'),
        pagado: get(item, 'pagado'),
        porpagar: get(item, 'porpagar'),
        porcentajeavanceobra: `%${get(item, 'porcentajeavanceobra')}`,
        porcentajeavancepagado: `%${get(item, 'porcentajeavancepagado')}`,
        estimado: get(item, 'estimado'),
        estimadoporfacturar: get(item, 'estimadoporfacturar') };
      	get(ctrl, 'datos').pushObject(objeto);
    });
    let objeto = {
    	contrato: '***',
        obra: 'Totales',
        fecha: '',
        valorcontrato: this.formatter(get(model, 'meta.totalvalorcontrato')),
        facturado: this.formatter(get(model, 'meta.totalfacturado')),
        porfacturar: '',
        pagado: this.formatter(get(model, 'meta.totalpagado')),
        porpagar:  this.formatter(get(model, 'meta.totalporpagar')),
        porcentajeavanceobra: '',
        porcentajeavancepagado: '',
        estimado: this.formatter(get(model, 'meta.totalestimado')),
        estimadoporfacturar: this.formatter(get(model, 'meta.totalestimadoporfacturar')) };
    get(ctrl, 'datos').pushObject(objeto);
    get(ctrl, 'datos').forEach((item)=> {
    });

  },
  model() {
    return this.store.query('situacionfinancieraobra', { excel: '1' });
  },
  actions: {
    error(error) {
      info(error);
    }
  }
});
