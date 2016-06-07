import DS from 'ember-data';

export default DS.Model.extend({
  prospecto: DS.attr('number'),
  gerente: DS.attr('number'),
  vendedor: DS.attr('number')
});
