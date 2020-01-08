import Ember from 'ember';
const {
  get,
  set,
  Logger: { info }
} = Ember;
export default Ember.Controller.extend({
  usuario: '',
  vendedor: '',
  actions: {
    usuario(usuario) {
      info('usuario', get(usuario, 'vendedor'));
      info("lo nuevo controller")
      set(this, 'vendedor', get(usuario, 'vendedor'));
      set(this, 'usuario', get(usuario, 'usuario'));
    },
    agrega() {
      let a = this.store.createRecord('xvendedor');
      a.setProperties({
        usuario: get(this, 'usuario'),
        vendedor: get(this, 'vendedor')
      });
      a.save().then(()=> {
        this.store.unloadAll('gixanip');
        set(this, 'model', this.store.findAll('gixanip'));
      }, (error)=> {
        info('error');
      });
    }
  }
});
