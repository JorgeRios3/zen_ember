import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('valores-iguales', 'Integration | Component | valores iguales', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{valores-iguales}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#valores-iguales}}
      template block text
    {{/valores-iguales}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
