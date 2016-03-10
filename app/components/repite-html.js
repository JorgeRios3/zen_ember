import Ember from 'ember';

export default Ember.Component.extend({
	vueltas : 0,
	didReceiveAttrs(){
		var vueltas = [];
		for( let vuelta = 0; vuelta < this.attrs.value; vuelta++ ){
			vueltas.push(vuelta + 1);
		}
		this.set("vueltas", vueltas);
	}
});
