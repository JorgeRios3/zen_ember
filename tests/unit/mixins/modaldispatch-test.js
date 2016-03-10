import Ember from 'ember';
import ModaldispatchMixin from 'zeniclar/mixins/modaldispatch';
import { module, test } from 'qunit';

module('Unit | Mixin | modaldispatch');

// Replace this with your real tests.
test('it works', function(assert) {
  let ModaldispatchObject = Ember.Object.extend(ModaldispatchMixin);
  let subject = ModaldispatchObject.create();
  assert.ok(subject);
});
