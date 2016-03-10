import Ember from 'ember';
const {
	set
} = Ember;

export default Ember.Route.extend({
	setupController(controller) {
		controller.setProperties({errorMessage: null});
	},
	actions: {
		sessionAuthenticationFailed(error) {
			set(this.controller,'errorMessage', error.error);
		}
    }
});
