import DS from 'ember-data';

export default DS.Model.extend({
	usuario : DS.attr('string'),
	perfil : DS.attr('string'),
	menuitems : DS.attr('string')
});
