import DS from 'ember-data';
import Ember from 'ember';

const {
	computed,
	get,
} = Ember;

export default DS.Model.extend({
	fecha:DS.attr("string"),
	fechavencimiento:DS.attr("string"),
	saldo:DS.attr("string"),
	cargo:DS.attr("string"),
	abono:DS.attr("string"),
	diasvencidos:DS.attr("number"),
	estavencido:computed.gt("diasvencidos",0),
	fechavencimientocompleto:computed("fechavencimiento", "diasvencidos", {
		get(){
			let fechavencimiento=get(this, "fechavencimiento");
			let diasvencidos=get(this, "diasvencidos");
			let fecha;
			if(get(this, "diasvencidos")>0){
				fecha=`${fechavencimiento} (${diasvencidos})`;
			}else{
				fecha=fechavencimiento;
			}
			return fecha;
		}
	})
});
