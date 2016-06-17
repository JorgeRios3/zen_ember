import Ember from 'ember';

const {
	get,
	set,
	Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  titleCols: ['Conteo', 'Descripcion'],
  alignments: ['right', 'left'],
  tablaConteo: null,
  actions: {
    suma(record) {
      let { store } = this;
      let lista = Ember.A();
      let id = get(record, 'id');
      let descripcion = get(record, 'descripcion');
      let conteo = get(record, 'conteo');
      conteo = conteo + 1;
      store.findRecord('conteomedio', id).then((record)=> {
        set(record, 'conteo', conteo);
        record.save().then((record)=> {
          store.findAll('conteomedio', { reload: true }).then((datos)=> {
            datos.forEach((item)=> {
              lista.pushObject(item.getProperties('id descripcion conteo'.w()));
            });
          });
          set(this, 'tablaConteo', lista);
        });
      }, (error)=> {
        info('trono');
      });

    }
  }
});
