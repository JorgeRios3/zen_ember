import Ember from 'ember';

const {
	get,
	set,
	observer,
	getProperties,
	Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  observaItem: observer('selectedItem', function() {
  	info('valor de selectedItem', get(this, 'selectedItem'));
    let cual = get(this, 'model').findBy('item', get(this, 'selectedItem'));
    let { title, intro, item ,fecha, consulta } = getProperties(cual, 'title intro item fecha consulta'.w());
    set(this, 'title', title);
    set(this, 'intro', intro);
    set(this, 'item', item);
    set(this, 'fecha', fecha);
    set(this, 'consulta', consulta);
  }),
  actions: {
    grabar() {
      let a = this.store.createRecord('xmenu', {
        title: get(this, 'title'),
        intro: get(this, 'intro'),
        item: get(this, 'item'),
        fecha: get(this, 'fecha'),
        consulta: get(this, 'consulta')
      });
      a.save().then(()=> {
      	info('se grabo');
      	this.transitionToRoute('index');
      }, (error)=> {
      	info('no se grabo');
      })
    }
  }
});
