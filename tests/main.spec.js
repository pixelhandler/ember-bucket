(function() {

module('Unit: main');

test('Components are registered on a container', function() {
  expect(3);
  var container = containerFactory.call(this);

  var initializer = Ember.Application.initializers['eb-bucket-components'];
  initializer.initialize(container);

  var label = 'component:eb-label';
  strictEqual(container.registry[label], EB.EBLabelComponent, label);

  var control = 'component:eb-control';
  strictEqual(container.registry[control], EB.EBControlComponent, control);

  var bucket = 'component:eb-bucket';
  strictEqual(container.registry[bucket], EB.EBBucketComponent, bucket);
});

test('Services are registered on a container', function() {
  expect(1);
  var container = containerFactory.call(this);

  var initializer = Ember.Application.initializers['bucket-service'];
  initializer.initialize(container);

  var key = 'service:bucket';
  strictEqual(container.registry[key], EB.BucketService, key);
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
