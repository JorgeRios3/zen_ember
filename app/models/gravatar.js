import DS from 'ember-data';
export default DS.Model.extend({
	gravatar : DS.attr('string'),
	gravataremail : DS.attr('string')
	});

