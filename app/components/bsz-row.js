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
      // info('valor de desktopOrJumbo', get(this, 'desktopOrJumbo'));
      let br = get(this, 'br');
      let ap = Ember.ArrayProxy.create({ content: [] });
      if (get(this, 'record') !== null) {
        let record = get(this, 'record');
        let i = 0;
        let titleCols = get(this, 'titleCols');
        // info('valor de titleCols', titleCols);
        let alignments = get(this, 'alignments');
        // info('luego de asginar tengo', alignments);
        if (alignments === []) {
          for (let j = 0; j < titleCols.length; j++) {
            // info(`j = ${j}`);
            alignments.push('left');
          }
        } else {
          // info('else alignments', alignments);
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
