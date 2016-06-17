import Ember from 'ember';

const {
	set,
	get,
	observer,
	Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  selectedEtapa: '0',
  etapaSeleccionada: observer('selectedEtapa', function() {
    let datos = Ember.A();
    datos.push(['Rubro', 'Unidades', { role: 'never' }]);
    let objeto = {};
    if (get(this, 'selectedEtapa') !== '0') {
      objeto.etapa = get(this, 'selectedEtapa');
    }
    this.store.query('panorama', objeto).then((data)=> {
      data.forEach((item)=> {
        datos.push([get(item, 'rubroReducido'), get(item, 'valor'), 'gold' ]);
      });
      set(this, 'model', datos);
    });
  })
});
