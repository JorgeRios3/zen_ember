import Ember from 'ember';

const {
  computed
}= Ember;
 var info=Ember.Logger.info;
export default Ember.Component.extend({
	opcion:null,
	consulta: false,
	isOferta: computed.equal("opcion", "oferta"),
	isCliente: computed.equal("opcion", "cliente")

});
