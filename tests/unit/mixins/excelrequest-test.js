import Ember from 'ember';
import ExcelrequestMixin from 'zeniclar/mixins/excelrequest';
import { module, test } from 'qunit';

module('Unit | Mixin | excelrequest');

// Replace this with your real tests.
test('it works', function(assert) {
  let ExcelrequestObject = Ember.Object.extend(ExcelrequestMixin);
  let subject = ExcelrequestObject.create();
  assert.ok(subject);
});
