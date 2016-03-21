import Ember from 'ember';

const {
  get,
  set,
  observer,
  Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  selectedEtapa: '',
  catalogoTramites: null,
  tramitesTotales: Ember.A(),
  noHayTramites: Ember.computed.gt('tramitesTotales.length', 0),

  etapaSeleccionada: observer('selectedEtapa', function() {
  	get(this, 'tramitesTotales').clear();
    this.store.unloadAll('matriztramite');
    this.store.query('matriztramite', { etapa: get(this, 'selectedEtapa') }).then((data)=> {
      data.forEach((item)=> {
        let a = get(item, 'tramite');
        let tramite = get(this, 'catalogoTramites').findBy('id', `${a}`);
        let descripcion = get(tramite, 'descripcion');
        let objeto = { tramite:  descripcion, total: get(item, 'total') };
        get(this, 'tramitesTotales').pushObject(objeto);
      });
    });
  })
});
