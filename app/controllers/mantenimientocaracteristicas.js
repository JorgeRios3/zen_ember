import Ember from 'ember';

const {
  get,
  set,
  getProperties,
  setPRoperties,
  Logger: { info }
} = Ember;
export default Ember.Controller.extend({
  actions: {
    seleccionarItem(item) {
      this.store.find('caracteristica', item.id)
      .then((data)=> {
      	info('si llego', data);
      })
    }
  }
});
