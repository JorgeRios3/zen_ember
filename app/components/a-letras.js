
import Ember from 'ember';
import ajax from "ember-ajax";
const {
	get,
	set,
	observer,
	inject:{service}
	
} = Ember;
export default Ember.Component.extend({
	ajax:service(),
	attributeBindings: ['valor'],
	resultado : "",
	init(){
		this._super(...arguments);
		this.cambio();
	},
	cambio: observer("valor", function(){
		var valor = get(this,"valor");
		valor = valor.replace(/\,/g,'');
		valor = parseInt(valor);
		valor = valor * 100;
		
		if (valor === 0){
			set(this,"resultado","");
			return;
		}
		var that = this;
		var url = "/api/pesos/" + valor;
		get(this, "ajax").request(url)
		.then(
			function(data){
				set(that,"resultado", data.texto2);
				Ember.run.later(function(){
					set(that,"resultado", "");
				}, 2000);
			}, 
			function(error){
				set(that,"resultado", "**");
				Ember.run.later(function(){
					set(that,"resultado", "");
				}, 2000);
			}
		);
	}),

});

