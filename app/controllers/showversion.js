import Ember from 'ember';
import config from '../config/environment';
const {
  computed,
  get
} = Ember;
// import Bootstrap from 'bootstrap';

export default Ember.Controller.extend({
  session: Ember.inject.service()
});
