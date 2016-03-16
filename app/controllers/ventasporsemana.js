import Ember from 'ember';

const {
  get,
  set,
  observer,
  Logger : { info }
} = Ember;

export default Ember.Controller.extend({
  consulta: false,
  selectedEtapa: '',
  selectedSemana: '',

  init() {
    this._super(...arguments);
    set(this, 'semanas', Ember.ArrayProxy.create({ content: [{ id: 10, nombre: '10 Semanas' }, { id: 20, nombre: '20 Semanas' }] }));
  },

  actions: {
    consulta() {
      this.toggleProperty('consulta');
    },
    pedirDatos() {
      let datos = Ember.A();
      datos.push( ['Semana', 'Unidades', { role: 'style' }]);
      let objeto = {};
      if (get(this, 'selectedEtapa') !== '0') {
        objeto.etapa = get(this, 'selectedEtapa');
      }
      objeto.semanas = get(this, 'selectedSemana');
      this.store.query('ventasporsemana', objeto).then((data)=> {
        data.forEach((item)=> {
  		  datos.push([ get(item, 'intervaloReducido'), get(item, 'valor'), 'gold' ]);
        });
        set(this, 'model', datos);
        this.toggleProperty('consulta');
      });
    }
  },
  etapaSeleccionada: observer('selectedEtapa', function() {
    info('paso por aqui', get(this, 'selectedEtapa'));
  }),
  semanaSeleccionada: observer('selectedSemana', function() {
    info(' valor de selectedSemana', get(this, 'selectedSemana'));
  })
});
