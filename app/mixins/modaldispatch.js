import Ember from 'ember';
// import Bootstrap from 'bootstrap';

export default Ember.Mixin.create(Ember.Evented, {
  evento: "",
  launchModal( event, title, message, confirmButtonTitle, cancelButtonTitle) {
  	this.set("evento", event);
  	// Bootstrap.ModalManager.confirm(this, title, message, confirmButtonTitle, cancelButtonTitle);
  },
  actions: {
    modalConfirmed() {
      this.trigger(this.get("evento"));
    },
    modalCanceled() {
      Ember.Logger.info("modal canceled");
    },
  }
});
