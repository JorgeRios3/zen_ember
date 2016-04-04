import Ember from 'ember';
const {
	get,
	computed
} = Ember;
export default Ember.Component.extend({
  value: 0,
  masuno: computed('value', {
    get() {
      return get(this, 'value') + 1;
    }
  })
});
