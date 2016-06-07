import Ember from 'ember';
const {
	set,
	Logger: { info }
} = Ember;

export default Ember.Route.extend({
	beforeModel() {
	  let c = this.controllerFor('login');
	  set(c, 'logoEffect', false );
	},
	setupController(controller) {
	  controller.setProperties({errorMessage: null});
	  Ember.run.later(()=> {
	  	info('entrando en run');
        set(controller, 'logoEffect', true);
      }, 1000);
	},
	actions: {
		sessionAuthenticationFailed(error) {
			set(this.controller,'errorMessage', error.error);
		}
    }
});
