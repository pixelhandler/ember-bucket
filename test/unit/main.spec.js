(function() {

module('Unit: main');

test('Components are registered on a container', function() {
  expect(3);
  var container = containerFactory.call(this);

  var initializer = Ember.Application.initializers['ella-bucket-components'];
  initializer.initialize(container);

  var label = 'component:ella-label';
  strictEqual(container.registry[label], Emberella2.EllaLabelComponent, label);

  var control = 'component:ella-control';
  strictEqual(container.registry[control], Emberella2.EllaControlComponent, control);

  var bucket = 'component:ella-bucket';
  strictEqual(container.registry[bucket], Emberella2.EllaBucketComponent, bucket);
});

test('Services are registered on a container', function() {
  expect(1);
  var container = containerFactory.call(this);

  var initializer = Ember.Application.initializers['ella-bucket-service'];
  initializer.initialize(container);

  var key = 'service:ella-bucket';
  strictEqual(container.registry[key], Emberella2.EllaBucketService, key);

  //var mixin = 'mixin:ella-bucket-processable';
  //strictEqual(container.registry[mixin], Emberella2.EllaBucketProcessableMixin, mixin);
});

var containerFactory = function() {
  return {
    registry: {},
    register: function(name, definition) {
      this.registry[name] = definition;
    }
  };
}

}());
