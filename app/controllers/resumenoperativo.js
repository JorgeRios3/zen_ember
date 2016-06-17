import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  actions: {
    togglePrinterComponent() {
      this.toggleProperty('showComponent');
    }
  }
});
