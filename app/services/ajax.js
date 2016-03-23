import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';
const {
  Logger: { info },
  inject: { service },
  computed,
  get
} = Ember;
export default AjaxService.extend({
  session: service(),
  headers: computed('session.session.content', {
    get() {
      let headers = {};
      let sess = get(this, 'session.session.content');
      let token = get(sess, 'authenticated.access_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      return headers;
    }
  })
});
