
import Ember from 'ember';

const { computed, get } = Ember;
export default Ember.Component.extend({
  valor1: null,
  valor2: null,
  iguales: computed('valor1', 'valor2', {
    get() {
      return Object.is(parseInt(get(this, 'valor1')), get(this, 'valor2'));
    }
  })
});
