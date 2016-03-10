import Ember from 'ember';

const {
  get,
  set,
  computed,
  inject: { service },
  Logger: { info }
} = Ember;

export default Ember.Controller.extend({
  session: service(),
  twoFactorToken: '',
  actions: {
    twoFactorCheck() {
      this.store.query('twofactorcheck', { twoFactorToken: get(this, 'twoFactorToken') }).then(
      	()=> {
        this.transitionToRoute('index');
      },
        (error)=> {
          info('esto trono');
        }
      );
    }
  }
});
