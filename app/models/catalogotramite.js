import DS from 'ember-data';
import Ember from 'ember';

const {
	get,
	computed
}= Ember;

export default DS.Model.extend({

	//tramite : DS.attr("number"),

	descripcion: DS.attr("string", {default: "descripcion"}),
    responsable: DS.attr("string",  {default: "tramite"}),
    origen: DS.attr("string"),
    catDescrip: computed("id","descripcion","responsable", {
    	get : function(){
    		return get(this,"id")+' - '+get(this,"descripcion")+' - '+get(this,"responsable");
    	}
    })
  
});
