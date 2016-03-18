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
  options: {
    annotations: {
      alwaysOutside: true,
      textStyle: {
        fontSize: 13,
        auraColor: 'none',
        color: '#555'
      },
      boxStyle: {
        stroke: '#ccc',
        strokeWidth: 1,
        gradient: {
          color1: '#f3e5f5',
          color2: '#f3e5f5',
          x1: '0%', y1: '0%',
          x2: '100%', y2: '100%'
        }
      }
    },
    title: '',
    height: 400,
    width: 700,
    bars: 'horizontal',
    hAxis: {
      title: 'Total de unidades',
      minValue: 0
    }
  },

  init() {
    this._super(...arguments);
    set(this, 'semanas', Ember.ArrayProxy.create({ content: [{ id: 10, nombre: '10 Semanas' }, { id: 20, nombre: '20 Semanas' }] }));
  },

  actions: {
    consulta() {
      this.toggleProperty('consulta');
    },
    pedirDatos() {
      this.store.unloadAll('cobradasporsemana');
      let datos = Ember.A();
      datos.push(['Semana', 'Unidades', { role: 'never' }]);
      let objeto = {};
      if (get(this, 'selectedEtapa') !== '1') {
        objeto.etapa = get(this, 'selectedEtapa');
      }
      objeto.semanas = get(this, 'selectedSemana');
      this.store.query('cobradasporsemana', objeto).then((data)=> {
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
