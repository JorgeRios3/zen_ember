import Ember from 'ember';

const {
  get,
  set,
  Logger: { info },
  RSVP: { hash }
} = Ember;
export default Ember.Route.extend({
  beforeModel(transition) {
    let c = this.controllerFor(this.routeName);
    c.setProperties({
      sortableObjectList: Ember.A()
    });
  },
  setupController(controller, model) {
    let i = 0;
    info( 'setupController ordenarmenu');
    // info('hay ', get(model.menu, 'length'), 'menu items');
    get(model.zenusuario, 'menuitems').w().forEach((item)=> {
      info('entrando en loop', item);
      let menu = model.menu.findBy('item', item );
      info('menu', menu);
      get(controller, 'sortableObjectList').pushObject({
        id: ++i,
        title: item,
        bigTitle: get(menu, 'title'),
        intro: get(menu, 'intro')
      });
    });
  },
  model() {
    let {
    	store
    } = this;
    return hash({
      zenusuario: store.find('zenusuario', 1),
      menu: store.findAll('menu')
    });
  }
});
