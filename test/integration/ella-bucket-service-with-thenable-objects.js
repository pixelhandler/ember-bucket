/**
  Integration: Emberella Bucket Service with Thenable Objects
**/

(function() {

var target, service;

module('Integration: ella-bucket with thenable objects', {
  setup: function() {
    target = App.PostProcessableObject.create();
    service = target._getBucketService();
  },
  teardown: function() {
    service.reset();
    App.reset();
  }
});

test('Objects insert themselves into a new queue using promises', function() {
  expect(3);

  Ember.run(function() {
    target.set('isDirty', true);
  });

  var bucket = service.getBucket('save');
  ok(bucket.length === 1, 'Save bucket exists and has one target');

  Ember.run(function() {
    service.doSave();
  });

  ok(service.getBucket('save').length === 0, 'Save bucket emptied after processing');
  ok(service.getBucket('postProcessing').length === 1, 'postProcessing bucket has 1 object');
});

test('Objects that fail to resolve a promise during processing remain in the bucket', function() {
  expect(2);

  target = App.ProcessFailingObject.create();

  Ember.run(function() {
    target.set('isDirty', true);
  });

  var bucket = service.getBucket('save');
  ok(bucket.length === 1, 'Save bucket exists and has one target');

  Ember.run(function() {
    service.doSave();
  });

  ok(bucket.length === 1, 'Save bucket still and has one target after doSave');
});

test('Objects that fail to save during processing can be rolledback', function() {
  expect(4);
  var count = 5;
  var failingCount = 3;
  var zero = 0;
  var save = 'save';
  var rollback = 'rollback';

  Ember.run(function() {
    var _target;
    for (var i = 0; i < count; i++) {
      if (i % 2 !== 0) {
        _target = App.ProcessableObject.create();
      } else {
        _target = App.ProcessFailingObject.create();
      }
      _target.set('isDirty', true);
    }
  });

  var saveBucket = service.getBucket(save);
  equal(saveBucket.length, count, "%@ bucket exists and has %@ targets".fmt(save, count));

  Ember.run(function() {
    service.doSave();
  });

  equal(saveBucket.length, failingCount, "%@ bucket still has %@ failing targets".fmt(save, failingCount));

  Ember.run(function() {
    service.moveToBucket(save, rollback);
  });

  var rollbackBucket = service.getBucket(rollback);
  equal(rollbackBucket.length, failingCount, "%@ bucket exists and has %@ targets".fmt(rollback, failingCount));

  Ember.run(function() {
    service.doRollback();
  });

  equal(rollbackBucket.length, zero, "%@ bucket exists and has %@ targets".fmt(rollback, zero));
});

var promiseSucceeds = function (resolve, reject) { resolve(); };
var promiseFails = function (resolve, reject) { reject(); };

App.ProcessableObject = Ember.Object.extend(Emberella2.EllaBucketProcessableMixin, {
  bucketMap: { 'save': { 'isDirty': [ true ] }},
  save: function() { return new Ember.RSVP.Promise(promiseSucceeds); }
});

App.PostProcessableObject = App.ProcessableObject.extend({
  bucketMap: { 'save': { 'isDirty': [ true ] }},
  save: function() {
    var _this = this;
    return new Ember.RSVP.Promise(promiseSucceeds).then(
      function() { _this.addToBucket('postProcessing'); }
    )
  }
});

App.ProcessFailingObject = App.ProcessableObject.extend({
  bucketMap: { 'save': { 'isDirty': [ true ] }},
  save: function() { return new Ember.RSVP.Promise(promiseFails); },
  rollback: function() { return new Ember.RSVP.Promise(promiseSucceeds); }
});

}());
