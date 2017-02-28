import DS from 'ember-data';

export default DS.Model.extend({
  inmueble: DS.attr('number', {default: ''})
});
