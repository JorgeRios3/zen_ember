import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ofertas-recientes', 'Integration | Component | ofertas recientes', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ofertas-recientes}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ofertas-recientes}}
      template block text
    {{/ofertas-recientes}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
