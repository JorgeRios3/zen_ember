import DS from 'ember-data';
import Ember from 'ember';
const {
	get,
	computed,
} = Ember;

export default DS.Model.extend({
	apellidopaterno : DS.attr("string"),
	apellidomaterno : DS.attr("string"),
	nombre : DS.attr("string"),
	afiliacion : DS.attr("string"),
	fecha : DS.attr("string"),
	gerente : DS.attr("string"),
	vendedor : DS.attr("string"),
	afiliacionvalida : DS.attr("boolean"),
	cuenta:DS.attr("number"),
	vendido:computed("cuenta", {
		get(){
			return get(this, "cuenta")>0;
		}
	})
});
