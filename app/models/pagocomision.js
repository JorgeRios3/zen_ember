import Model from 'ember-data/model';
const {
  get,
  set,
  computed,
  Logger: { info }
} = Ember;
export default Model.extend({
  pagotipo: DS.attr('string'),
  pagoreferencia: DS.attr('string'),
  pagoimporte: DS.attr('number'),
  pagoimpuesto: DS.attr('number'),
  fechareconocimiento: DS.attr('string'),
  solicitudcheque: DS.attr('number'),
  estatussolicitud: DS.attr('string'),
  estatusDesc: computed('estatussolicitud', {
  	get() {
  		let otro = '';
  		let estatus = get(this, 'estatussolicitud');
  		let estatusLista = [{ 'id': 1, 'label': 'Todo', 'estatus': 'H' },
    { 'id': 2, 'label': 'Solicitud', 'estatus': 'S' },
    { 'id': 3, 'label': 'Revisado', 'estatus': 'R' },
    { 'id': 4, 'label': 'Autorizado', 'estatus': 'A' },
    { 'id': 5, 'label': 'Elaborado', 'estatus': 'E' },
    { 'id': 6, 'label': 'Fondeado', 'estatus': 'F' },
    { 'id': 7, 'label': 'Cobrado', 'estatus': 'B' },
    { 'id': 8, 'label': 'Retenido', 'estatus': 'T' },
    { 'id': 9, 'label': 'Cancelado', 'estatus': 'C' },
    { 'id': 10, 'label': 'Comisionable', 'estatus': 'Y' },
    { 'id': 11, 'label': 'Comisionado', 'estatus': 'Z' }];
    estatusLista.forEach((item)=> {
      if (get(item, 'estatus') === estatus) {
      	info('si concidio', get(item, 'label'));
      	otro = get(item, 'label');
      }
    });
    return otro;
  	}
  })
});
