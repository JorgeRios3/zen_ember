import DS from 'ember-data';
import Ember from 'ember';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
export default DS.RESTAdapter.extend(DataAdapterMixin, {
  namespace: 'api',
  authorizer: 'authorizer:oauth2'
});
const many = 'etapas prospectos clientes clientessin'.w();
many.forEach((one)=> {
  Ember.Inflector.inflector.irregular(`${one}oferta`, `${one}ofertas`);
});
Ember.Inflector.inflector.irregular('oferta', 'ofertas');
Ember.Inflector.inflector.irregular('comisionventa', 'comisionventas');
Ember.Inflector.inflector.irregular('parametrosetapa', 'parametrosetapas');
Ember.Inflector.inflector.irregular('chilpayate', 'hijos');
Ember.Inflector.inflector.irregular('referenciasrapconclientesincuenta', 'referenciasrapconclientesincuentas');
