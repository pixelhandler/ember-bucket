import { Object, A, Map, Evented, RSVP, run, get, set } from 'ember';

var slice = Array.prototype.slice;

/**
@class BucketService
@namespace EB
*/
var BucketService = Object.extend(Evented, {

  /**
  @property queues
  */
  queues: null,

  /**
  @method addToBucket
  */
  addToBucket: function(name, target) {
    var bucket = this._bucket(name);
    return bucket.addObject(target);
  },

  /**
  @method removeFromBucket
  */
  removeFromBucket: function(name, target) {
    var bucket = this._bucket(name);
    return bucket.removeObject(target);
  },

  /**
  @method getBucket
  */
  getBucket: function(name) {
    var bucket;
    return bucket = this._bucket(name);
  },

  /**
  @method emptyBucket
  */
  emptyBucket: function(name) {
    var bucket;
    bucket = this._bucket(name);
    this._bucket(name).forEach(function(target) {
      bucket.removeObject(target);
    });
    this.trigger('didEmpty' + name.capitalize());
  },

  /**
  @method moveToBucket
  */
  moveToBucket: function(from, to) {
    var src = this._bucket(from);
    var dest = this._bucket(to);
    src.forEach(function(item) {
      dest.addObject(item);
    });
    dest.forEach(function(item) {
      src.removeObject(item);
    });
  },

  /**
  @method setOperation
  */
  setOperation: function(name, fn) {
    return this._operation(name, fn);
  },

  /**
  @method reset
  */
  reset: function() {
    var queues = get(this, 'queues');
    return queues.forEach((function(_this) {
      return function(key) {
        if (!key.match(/operation$/)) {
          _this.emptyBucket(key);
        }
        return queues.remove(key);
      };
    })(this));
  },

  /**
  @private
  @method _initQueues
  */
  _initQueues: (function() {
    set(this, 'queues', Map.create());
  }).on('init'),

  /**
  @private
  @method _bucket
  */
  _bucket: function(name) {
    var queues = get(this, 'queues');
    var bucket = queues.get(name);
    if (!bucket) {
      queues.set(name, A([]));
      this._operation(name, null);
      this._setupCommand(name);
    }
    return bucket || queues.get(name);
  },

  /**
  @private
  @method _operation
  */
  _operation: function(name, fn) {
    var fnKey = "%@:operation".fmt(name);
    var queues = get(this, 'queues');
    if (typeof fn === 'function') {
      return queues.set(fnKey, fn);
    } else if (fn === null) {
      var _name = name;
      queues.set(fnKey, function(target) {
        return target[_name].call(target);
      });
    } else {
      return queues.get(fnKey);
    }
  },

  /**
  @private
  @method _process
  */
  _process: function(name) {
    var bucket = this._bucket(name);
    var fn = this._operation(name);
    var results = A([]);
    var __process = this._processFactory(bucket, fn, results);
    var bucketItems = bucket.toArray();
    for (var i = 0, len = bucketItems.length; i < len; i++) {
      __process(bucketItems[i]);
    }
    this._processResults(results);
  },

  /**
  @private
  @method _processFactory - creates a function to process a bucket item
  */
  _processFactory: function(bucket, fn, results) {
    return function(item) {
      var result = null;
      run(function() {
        return result = fn(item);
      });
      if (result && typeof result.then === 'function') {
        results.pushObject(result);
        result.then(function() {
          bucket.removeObject(item);
        });
      } else {
        bucket.removeObject(item);
      }
      return result;
    };
  },

  /**
  @private
  @method _processResults
  */
  _processResults: function(results) {
    if (results.length) {
      var suffix = name.capitalize();
      var didProcess = 'did' + suffix;
      var didNotProcess = 'didNot' + suffix;
      return RSVP.Promise.all(results).then((function(_this) {
        return function() {
          return _this.trigger(didProcess);
        };
      })(this), (function(_this) {
        return function() {
          return _this.trigger(didNotProcess);
        };
      })(this));
    }
  },

  /**
  @private
  @method _setupCommand
  */
  _setupCommand: function(name) {
    var _name = name;
    var command = 'do' + name.capitalize();
    var processor = (function(_this) {
      return function() {
        return _this._process(_name);
      };
    })(this);
    this.on(command, processor);
    return this[command] = processor;
  }
});

var _singletonInstance = null;

BucketService.reopenClass({
  /**
  @method create
  */
  create: function() {
    if (_singletonInstance != null) {
      return _singletonInstance;
    }
    return _singletonInstance = Object.create.apply(this, slice.call(arguments));
  },

  /**
  @method getSingleton
  */
  getSingleton: function() {
    return BucketService.create.apply(this, slice.call(arguments));
  }
});

export default BucketService;
