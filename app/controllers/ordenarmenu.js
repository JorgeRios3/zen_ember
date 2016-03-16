import Ember from 'ember';

const {
	get,
	set,
	Logger: { info },
  inject: { service }
} = Ember;

export default Ember.Controller.extend({
  session: service(),
  sortFinishText: null,
  nuevoAcomodo: '',
  menuOriginal: null,
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
          this.get('session').invalidate();
        }, (error)=> {
          info('hay error');
        });
      });
    },

    restaurar() {
      let nuevoMenu = Ember.A();
      let i = 0;
      this.store.findAll('menuperfil').then((data)=> {
        data.forEach((item) => {
          let menu = get(this, 'menuOriginal').findBy('item', get(item, 'item'));
          nuevoMenu.pushObject({
            id: ++i,
            title: get(menu, 'item'),
            bigTitle: get(menu, 'title'),
            intro: get(menu, 'intro')
          });
        });
      });
      set(this, 'sortableObjectList', nuevoMenu);
    }
  }
});
