import Ember from 'ember';

const {
	get,
	set,
	Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  sortFinishText: null,
  nuevoAcomodo: '',
  actions: {
    dragStart(obj) {},
    sortEndAction() {},
    guardar() {
      let a = [];
      get(this, 'sortableObjectList').forEach((item)=> {
        a.push(get(item, 'title'));
      });
      this.store.findRecord('zenusuario', 1).then((usuario)=> {
        usuario.set('menuitems', a.join(' '));
        usuario.save().then(()=> {
          this.transitionToRoute('index');
        }, (error)=> {
          info('hay error');
        });
      });
    }
  }

});
