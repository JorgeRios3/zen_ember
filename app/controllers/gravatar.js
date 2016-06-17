import Ember from 'ember';
const {
  get,
  set,
  inject: { service }
} = Ember;

export default Ember.Controller.extend({
  session: service(),
  gravatarEmail: '',
  actions: {
    actualizaGravatar() {
      let gv = get(this, 'content');
      set(gv, 'gravataremail', get(this, 'gravatarEmail'));
      let that = this;
      gv.save().then(()=> {
        that.transitionToRoute('index');
      }, (error)=> {
        that.transitionToRoute('index');
      });
    }
  }
});

