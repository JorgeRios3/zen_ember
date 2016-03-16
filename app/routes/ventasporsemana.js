import Ember from 'ember';

const {
	get,
	set,
	RSVP: { hash },
	Logger: { info },
	computed
} = Ember;

export default Ember.Route.extend({
  desktopOrJumbo: computed('media.isJumbo', 'media.isDesktop', {
    get() {
      return get(this, 'media.isJumbo') || get(this, 'media.isDesktop');
    }
  }),
  setupController( controller, model) {
  	let width = 400;
  	if (get(this, 'desktopOrJumbo')){
  		width = 700;
  	}
  	let datos = Ember.A();
  	datos.push( ['Semana', 'Unidades', { role: 'style' }])
  	model.forEach((item)=> {
  		datos.push([ get(item, 'intervaloReducido'), get(item, 'valor'), 'gold' ]);
  	});
  	info("viendo dados",datos);
  	controller.setProperties( { options : {
  		title: 'Ventas por Semana',
  		height: 400,
  		width,
  		bars: 'horizontal'
  	}, model: datos });
  },
  
  model() {
    const { store } = this;
    return store.findAll('ventasporsemana');
  },
});
