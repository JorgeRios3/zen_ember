import Transform from 'ember-data/transform';
import FormatterMixin from '../mixins/formatter';

export default Transform.extend(FormatterMixin, {
  deserialize(serialized) {
    return this.formatter(serialized);
  },

  serialize(deserialized) {
    return deserialized;
  }
});
