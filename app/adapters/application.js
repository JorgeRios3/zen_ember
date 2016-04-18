import DS from 'ember-data';
import Ember from 'ember';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

const {
  Inflector: { inflector }
} = Ember;

export default DS.RESTAdapter.extend(DataAdapterMixin, {
  namespace: 'api',
  authorizer: 'authorizer:oauth2'
});
const many = 'etapas prospectos clientes clientessin'.w();
many.forEach((one)=> {
  inflector.irregular(`${one}oferta`, `${one}ofertas`);
});
inflector.irregular('oferta', 'ofertas');
inflector.irregular('comisionventa', 'comisionventas');
inflector.irregular('parametrosetapa', 'parametrosetapas');
inflector.irregular('chilpayate', 'hijos');
inflector.irregular('referenciasrapconclientesincuenta', 'referenciasrapconclientesincuentas');
inflector.irregular('ventaspordia', 'ventaspordias');
inflector.irregular('panorama', 'panoramas');
inflector.irregular('lotesdisponiblesarcadia', 'lotesdisponiblesarcadias');
inflector.irregular('ventascuadroarcadia', 'ventascuadroarcadias');
inflector.irregular('cuentabancaria', 'cuentabancarias');
inflector.irregular('solicitud', 'solicitudes');
inflector.irregular('situacionfinacieraobra', 'situacionfinacieraobras');