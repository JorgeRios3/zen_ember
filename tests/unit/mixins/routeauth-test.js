import Ember from 'ember';
import RouteauthMixin from 'zeniclar/mixins/routeauth';
import { module, test } from 'qunit';

module('Unit | Mixin | routeauth');

// Replace this with your real tests.
test('it works', function(assert) {
  let RouteauthObject = Ember.Object.extend(RouteauthMixin);
  let subject = RouteauthObject.create();
  assert.ok(subject);
});
