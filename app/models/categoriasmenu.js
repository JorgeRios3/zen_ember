import DS from 'ember-data';

const {
	Model,
	attr
} = DS;

export default Model.extend({
	categoria: attr("string"),
	menu: attr('string')
  
});
