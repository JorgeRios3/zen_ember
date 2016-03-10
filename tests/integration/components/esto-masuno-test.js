import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('esto-masuno', 'Integration | Component | esto masuno', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{esto-masuno}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#esto-masuno}}
      template block text
    {{/esto-masuno}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
