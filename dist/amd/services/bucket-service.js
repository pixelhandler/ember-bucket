define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Object = __dependency1__.Object;
    var A = __dependency1__.A;
    var Map = __dependency1__.Map;
    var Evented = __dependency1__.Evented;
    var RSVP = __dependency1__.RSVP;
    var run = __dependency1__.run;
    var get = __dependency1__.get;
    var set = __dependency1__.set;

    var BucketService, slice, _singletonInstance;

    slice = Array.prototype.slice;


    /*
    @class BucketService
    @namespace EB
     */

    BucketService = Object.extend(Evented, {
      queues: null,
      addToBucket: function(name, target) {
        var bucket;
        bucket = this._bucket(name);
        return bucket.addObject(target);
      },
      removeFromBucket: function(name, target) {
        var bucket;
        bucket = this._bucket(name);
        return bucket.removeObject(target);
      },
      getBucket: function(name) {
        var bucket;
        return bucket = this._bucket(name);
      },
      emptyBucket: function(name) {
        var bucket;
        bucket = this._bucket(name);
        this._bucket(name).forEach(function(target) {
          return bucket.removeObject(target);
        });
        return this.trigger('didEmpty' + name.capitalize());
      },
      moveToBucket: function(from, to) {
        var dest, src;
        src = this._bucket(from);
        dest = this._bucket(to);
        src.forEach(function(item) {
          return dest.addObject(item);
        });
        return dest.forEach(function(item) {
          return src.removeObject(item);
        });
      },
      setOperation: function(name, fn) {
        return this._operation(name, fn);
      },
      reset: function() {
        var queues;
        queues = get(this, 'queues');
        return queues.forEach((function(_this) {
          return function(key) {
            if (!key.match(/operation$/)) {
              _this.emptyBucket(key);
            }
            return queues.remove(key);
          };
        })(this));
      },
      _initQueues: (function() {
        return set(this, 'queues', Map.create());
      }).on('init'),
      _bucket: function(name) {
        var bucket, queues;
        queues = get(this, 'queues');
        bucket = queues.get(name);
        if (!bucket) {
          queues.set(name, A([]));
          this._operation(name, null);
          this._setupCommand(name);
        }
        return bucket || queues.get(name);
      },
      _operation: function(name, fn) {
        var fnKey, queues, _name;
        fnKey = "%@:operation".fmt(name);
        queues = get(this, 'queues');
        if (typeof fn === 'function') {
          return queues.set(fnKey, fn);
        } else if (fn === null) {
          _name = name;
          return queues.set(fnKey, function(target) {
            return target[_name].call(target);
          });
        } else {
          return queues.get(fnKey);
        }
      },
      _process: function(name) {
        var bucket, didNotProcess, didProcess, fn, item, results, suffix, __process, _i, _len, _ref;
        bucket = this._bucket(name);
        fn = this._operation(name);
        results = A([]);
        __process = function(item) {
          var result;
          result = null;
          run(function() {
            return result = fn(item);
          });
          if (result && typeof result.then === 'function') {
            results.pushObject(result);
            result.then(function() {
              return bucket.removeObject(item);
            });
          } else {
            bucket.removeObject(item);
          }
          return result;
        };
        _ref = bucket.toArray();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          __process(item);
        }
        if (results.length) {
          suffix = name.capitalize();
          didProcess = 'did' + suffix;
          didNotProcess = 'didNot' + suffix;
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
      _setupCommand: function(name) {
        var command, processor, _name;
        _name = name;
        command = 'do' + name.capitalize();
        processor = (function(_this) {
          return function() {
            return _this._process(_name);
          };
        })(this);
        this.on(command, processor);
        return this[command] = processor;
      }
    });

    _singletonInstance = null;

    BucketService.reopenClass({
      create: function() {
        if (_singletonInstance != null) {
          return _singletonInstance;
        }
        return _singletonInstance = Object.create.apply(this, slice.call(arguments));
      },
      getSingleton: function() {
        return BucketService.create.apply(this, slice.call(arguments));
      }
    });

    __exports__["default"] = BucketService;;
  });