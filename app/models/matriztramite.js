import DS from 'ember-data';
const {
  attr
} = DS;
export default DS.Model.extend({
   tramite: attr("number"),
   total: attr("number")
});
