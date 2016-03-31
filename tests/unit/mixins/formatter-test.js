import Ember from 'ember';
import FormatterMixin from 'zeniclar/mixins/formatter';
import { module, test } from 'qunit';

module('Unit | Mixin | formatter');

// Replace this with your real tests.
test('it works', function(assert) {
  let FormatterObject = Ember.Object.extend(FormatterMixin);
  let subject = FormatterObject.create();
  assert.ok(subject);
});
