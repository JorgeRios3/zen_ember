import Ember from 'ember';

const {
  computed,
  get,
  set,
  Logger: { info }
} = Ember;

export default Ember.Component.extend({
  record: null,
  row: null,
  titleCols: null,
  alignments: [],
  tagName: 'tr',
  useBr: false,
  desktopOrJumbo: computed('media.isJumbo', 'media.isDesktop', {
    get() {
      return get(this, 'media.isJumbo') || get(this, 'media.isDesktop');
    }
  }),
  columns: computed('record', {
    get() {
      let br = get(this, 'br');
      let ap = Ember.ArrayProxy.create({ content: [] });
      if (get(this, 'record') !== null) {
        let record = get(this, 'record');
        let i = 0;
        let titleCols = get(this, 'titleCols');
        let alignments = get(this, 'alignments');
        if (alignments.length === 0) {
          for (let j = 0; j < titleCols.length; j++) {
            alignments.push('left');
          }
        }
        Object.keys(record).forEach((key)=> {
          let field = get(record, key);
          let dataTitle = titleCols[i];
          let alignment = alignments[i++];
          ap.pushObject(Ember.Object.create({
            value: field,
            dataTitle,
            alignment
          }));
        });
        return ap;
      }
    }
  })
});
