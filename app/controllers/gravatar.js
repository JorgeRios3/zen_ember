import Ember from 'ember';
const {
	get,
	set,
	computed,
	observer,
	isEmpty
}= Ember;

export default Ember.Controller.extend({
	session:Ember.inject.service(),
	gravatar_email : '',
	actions: {
		actualizaGravatar(){
			var gv = get(this,"content");
			set(gv,"gravataremail", get(this,"gravatar_email"));
			var that = this;
			gv.save().then( () => {
				that.transitionToRoute("index");
			} , (error) => {
				that.transitionToRoute("index");
			});
		}
	}
});

