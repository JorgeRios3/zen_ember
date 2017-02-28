import Ember from 'ember';
import config from '../config/environment';
const {
  computed,
  get,
  isEmpty
} = Ember;
// import Bootstrap from 'bootstrap';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  githash: !isEmpty($("#versiongit").attr("class")) ? $("#versiongit").attr("class") : 'no se encontro githash'
});
