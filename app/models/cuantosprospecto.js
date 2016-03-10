import DS from 'ember-data';

export default DS.Model.extend({
	cuantos : DS.attr('number'),
	cuantosformateado : DS.attr('string')
});
