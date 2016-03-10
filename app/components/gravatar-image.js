import Ember from 'ember';
const {
	get,
	computed
} = Ember;
export default Ember.Component.extend({
  size: 50,
  emailhashed: '',
  gravatarUrl: computed('emailhashed', 'size', {
    get() {
      let emailhashed = get(this, 'emailhashed');
      let size = get(this, 'size');
      return emailhashed === '' ? '' : `http://www.gravatar.com/avatar/${emailhashed}?s=${size}`;
    }
  })
});
