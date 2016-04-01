import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  record: null,
  row: null,
  titleCols: null,
  tagName: 'tr',
  columns: computed('record', {
    get() {
      let ap = Ember.ArrayProxy.create({ content: [] });
      if (get(this, 'record') !== null) {
        let record = get(this, 'record');
        let i = 0;
        let titleCols = get(this, 'titleCols');
        Object.keys(record).forEach((key)=> {
          let field = get(record, key);
          let dataTitle = titleCols[i++];
          ap.pushObject(Ember.Object.create({
            value: field,
            dataTitle
          }));
        });
        return ap;
      }
    }
  })
});
