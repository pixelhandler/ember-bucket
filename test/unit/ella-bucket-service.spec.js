/**
  EllaBucketService Spec
**/

(function() {

var service = 'ella-bucket';
var process = 'process';

moduleFor("service:%@".fmt(service), "Unit: service:%@".fmt(service));

test('service uses queues for processing', function() {
  var service = this.subject();
  ok(service.get('queues'), 'service object uses queues');

  service.reset();
});

test('service uses `addToBucket` and `getBucket` for bucket processing', function() {
  expect(2);
  var service = this.subject();
  var target = { process: Ember.K };

  service.addToBucket(process, target);

  var bucket = service.getBucket(process);
  ok(bucket.length > 0, "%@ bucket exists".fmt(process));
  var bucketTarget = bucket.objectAt(0);
  strictEqual(bucketTarget, target, "%@ bucket has the added target object".fmt(process));

  service.reset();
});

test('service has a bucket with an default process', function() {
  expect(2);
  var service = this.subject();
  var bucket = service.getBucket(process);
  ok(bucket, "%@ bucket exists".fmt(process));

  var operation = "%@:operation".fmt(process);
  equal(typeof service.get('queues').get(operation), 'function', "%@ exists".fmt(operation));

  service.reset();
});

test('service has a bucket with an assigned process', function() {
  expect(3);
  var service = this.subject();
  var bucket = service.getBucket(process);
  ok(bucket, "%@ bucket exists".fmt(process));
  var processor = function(target){ return target[process].call(target); };
  service.setOperation(process, processor);

  var operation = "%@:operation".fmt(process);
  var queueProcessorFn = service.get('queues').get(operation);
  equal(typeof queueProcessorFn, 'function', "%@ exists".fmt(operation));
  strictEqual(queueProcessorFn, processor, "%@ has assigned processor fn".fmt(operation));

  service.reset();
});

test('service processes a queue executing method on each object', function() {
  expect(3);
  var service = this.subject();
  var processedCount = 0;
  var _process = 'batch';
  var proccessor = function(target) {
    processedCount ++;
    return target[_process].call(target);
  };
  var count = 50;
  Ember.run(function() {
    for (var i = 0; i < count; i++) {
      service.addToBucket(_process, objectFactory(_process));
    }
  });
  ok(service.getBucket(_process).length === count, "%@ bucket exists with %@ targets".fmt(_process, count));

  Ember.run(function() {
    service.setOperation(_process, proccessor);
    service['do' + _process.capitalize()]();
  });

  equal(processedCount, count, "processed %@ targets".fmt(count));
  ok(service.getBucket(_process).length === 0, "%@ bucket emptied after processing".fmt(_process));

  service.reset();
});

test('Objects can send themselves to a bucket for processing', function() {
  expect(1);
  var target = objectFactory(bucketName);
  var service = target._getBucketService();
  var bucketName = 'eatLunch';

  target.addToBucket(bucketName);

  var bucket = service.getBucket(bucketName);
  ok(bucket.length === 1, "%@ bucket exists and has one target".fmt(bucketName));

  service.reset()
});

test('Objects are added to bucket by observing properties, e.g. isDirty', function() {
  expect(1);
  var bucketName = 'save';
  var proto = { bucketMap: {} };
  proto.bucketMap[bucketName] = { 'isDirty': [ true ] };
  var target = objectFactory(bucketName, proto);
  var service = target._getBucketService();

  Ember.run(function() {
    target.set('isDirty', true);
  });

  var bucket = service.getBucket(bucketName);
  ok(bucket.length === 1, "%@ bucket exists and has one target".fmt(bucketName));

  service.reset()
});

test('Object using property observer with boolean value can be removed automatically', function() {
  expect(2);
  var bucketName = 'save';
  var proto = { bucketMap: {} };
  proto.bucketMap[bucketName] = { 'isDirty': [ true ] };
  var target = objectFactory(bucketName, proto);
  var service = target._getBucketService();

  Ember.run(function() {
    target.set('isDirty', true);
  });

  var bucket = service.getBucket(bucketName);
  ok(bucket.length === 1, "%@ bucket exists and has one target after property become true".fmt(bucketName));

  Ember.run(function() {
    target.set('isDirty', false);
  });
  ok(bucket.length === 0, "target removed from %@ bucket after property became false".fmt(bucketName));

  service.reset()
});

test('Bucket target objects can be moved to another (process) bucket', function() {
  expect(6);
  var service = this.subject();
  var processedCount = 0;
  var save = 'save';
  var rollback = 'rollback';

  var count = 10;
  var zero = 0;
  var target;
  var proccessor = function(target) {
    processedCount ++;
    return target.rollback.call(target);
  };

  Ember.run(function() {
    for (var i = 0; i < count; i++) {
      target = objectFactory(save);
      target.rollback = Ember.K;
      service.addToBucket(save, target);
    }
  });

  equal(service.getBucket(save).length, count, "%@ bucket exists with %@ targets".fmt(save, count));
  equal(service.getBucket(rollback).length, zero, "%@ bucket exists with %@ targets".fmt(rollback, zero));

  Ember.run(function() {
    service.moveToBucket(save, rollback);
    service.setOperation(rollback, proccessor);
  });

  equal(service.getBucket(save).length, zero, "%@ bucket has %@ targets after move".fmt(save, zero));
  equal(service.getBucket(rollback).length, count, "%@ bucket has %@ targets after move".fmt(rollback, count));

  Ember.run(function() {
    service.doRollback();
  });

  equal(processedCount, count, "processed %@ targets".fmt(count));
  equal(service.getBucket(rollback).length, zero, "%@ bucket emptied after processing".fmt(rollback));

  service.reset();
});

App.ProcessableObject = Ember.Object.extend(Emberella2.EllaBucketProcessableMixin);

var objectFactory = function (processName, proto) {
  var proto = proto || {};
  proto[processName] = Ember.K;
  proto.bucketMap = proto.bucketMap || {};
  return App.ProcessableObject.create(proto);
};

}());
