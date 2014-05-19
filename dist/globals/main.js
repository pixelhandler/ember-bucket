!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.EB=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Component = window.Ember.Component;
var A = window.Ember.A;

/*
Composite component of controls and labels for sending commands to a service

@class EBBucketComponent
@extends Ember.Component
@namespace EB
 */
var EBBucketComponent;

EBBucketComponent = {
  tagName: 'eb-bucket',
  notices: A()
};

exports["default"] = Component.extend(EBBucketComponent);
},{}],2:[function(_dereq_,module,exports){
"use strict";
var Component = window.Ember.Component;
var get = window.Ember.get;

/*
@class EBControlComponent
@extends Ember.Component
@namespace EB
 */
var EBControlComponent;

EBControlComponent = {
  tagName: 'eb-control',
  classNameBindings: ['activated', 'action', 'disabled'],
  click: function() {
    if (get(this, 'activated')) {
      return this.sendAction();
    }
  },
  activated: false,
  disabled: (function() {
    return !get(this, 'activated');
  }).property('activated')
};

exports["default"] = Component.extend(EBControlComponent);
},{}],3:[function(_dereq_,module,exports){
"use strict";
var Component = window.Ember.Component;

/*
@class EBLabelComponent
@extends Ember.Component
@namespace EB
 */
var EBLabelComponent;

EBLabelComponent = {
  tagName: 'eb-label',
  classNameBindings: ['status'],
  status: 'info'
};

exports["default"] = Component.extend(EBLabelComponent);
},{}],4:[function(_dereq_,module,exports){
"use strict";
var EBLabelComponent = _dereq_("./components/eb-label-component")["default"] || _dereq_("./components/eb-label-component");

var EBControlComponent = _dereq_("./components/eb-control-component")["default"] || _dereq_("./components/eb-control-component");

var EBBucketComponent = _dereq_("./components/eb-bucket-component")["default"] || _dereq_("./components/eb-bucket-component");

var EBStylesTemplate = _dereq_("./templates/main-css")["default"] || _dereq_("./templates/main-css");

var BucketService = _dereq_("./services/bucket-service")["default"] || _dereq_("./services/bucket-service");

var BucketProcessableMixin = _dereq_("./mixins/bucket-processable-mixin")["default"] || _dereq_("./mixins/bucket-processable-mixin");

var Application = window.Ember.Application;

Application.initializer({
  name: 'eb-bucket-components',
  initialize: function(container) {
    container.register('component:eb-label', EBLabelComponent);
    container.register('component:eb-control', EBControlComponent);
    return container.register('component:eb-bucket', EBBucketComponent);
  }
});

Application.initializer({
  name: 'bucket-service',
  initialize: function(container) {
    return container.register('service:bucket', BucketService, {
      singleton: true
    });
  }
});

exports.EBLabelComponent = EBLabelComponent;
exports.EBControlComponent = EBControlComponent;
exports.EBBucketComponent = EBBucketComponent;
exports.EBStylesTemplate = EBStylesTemplate;
exports.BucketService = BucketService;
exports.BucketProcessableMixin = BucketProcessableMixin;
},{"./components/eb-bucket-component":1,"./components/eb-control-component":2,"./components/eb-label-component":3,"./mixins/bucket-processable-mixin":5,"./services/bucket-service":6,"./templates/main-css":7}],5:[function(_dereq_,module,exports){
"use strict";
var Mixin = window.Ember.Mixin;
var Evented = window.Ember.Evented;
var get = window.Ember.get;


/*
@class BucketProcessableMixin
@namespace EB
 */
var BucketProcessableMixin, bucketObserverFactory,
  __hasProp = {}.hasOwnProperty;

BucketProcessableMixin = Mixin.create({

  /*
  Map of properties and associated buckets (processes)
  
  The map is a list of properties with an object mapping the property
  value to the associated bucket. When a property changes to the mapped
  value this object is added to the bucket assigned to property value
  
  For example observing a model's `isDirty` property becoming `true`
  would add the object to the `save` bucket
  
  ```
  bucketMap:
    save:
      isDirty: [true]
  
  ```
  
  @property bucketMap
  @type {Object}
   */
  bucketMap: Em.required,

  /*
  @method addToBucket
  @param {String} name - the bucket name to add this object to
   */
  addToBucket: function(name) {
    return this._getBucketService().addToBucket(name, this);
  },

  /*
  @method removeFromBucket
  @param {String} name - the bucket name to remove this object from
   */
  removeFromBucket: function(name) {
    return this._getBucketService().removeFromBucket(name, this);
  },

  /*
  @method makeProcessable - is fired on init, checks for service
   */
  makeProcessable: (function() {
    if (!this._getBucketService()) {
      throw new Error('Error: makeProcessable requires ' + service);
    }
    return this._setupBucketMapObservers();
  }).on('init'),

  /*
  @private
  @method _setupBucketMapObservers
   */
  _setupBucketMapObservers: function() {
    var bucketName, config, map, prop, values, _results;
    map = get(this, 'bucketMap');
    _results = [];
    for (bucketName in map) {
      if (!__hasProp.call(map, bucketName)) continue;
      config = map[bucketName];
      _results.push((function() {
        var _results1;
        _results1 = [];
        for (prop in config) {
          if (!__hasProp.call(config, prop)) continue;
          values = config[prop];
          _results1.push(bucketObserverFactory.call(this, bucketName, prop, values));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  },

  /*
  @private
  @method _getBucketService
   */
  _getBucketService: function() {
    return EB.BucketService.getSingleton();
  }
});

bucketObserverFactory = function(bucketName, prop, values) {
  var observer, _bucketName, _prop, _ref, _this, _values;
  if (!Array.isArray(values)) {
    return;
  }
  _ref = [prop, values, bucketName], _prop = _ref[0], _values = _ref[1], _bucketName = _ref[2];
  _this = this;
  observer = function() {
    var val;
    val = get(_this, _prop);
    if (_values.contains(val)) {
      return _this.addToBucket(bucketName);
    } else {
      return _this.removeFromBucket(bucketName);
    }
  };
  this.addObserver(prop, this, observer);
  return get(this, prop);
};

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

BucketProcessableMixin.reopen(Evented);

exports["default"] = BucketProcessableMixin;;
},{}],6:[function(_dereq_,module,exports){
"use strict";
var Object = window.Ember.Object;
var A = window.Ember.A;
var Map = window.Ember.Map;
var Evented = window.Ember.Evented;
var RSVP = window.Ember.RSVP;
var run = window.Ember.run;
var get = window.Ember.get;
var set = window.Ember.set;

var EBBucketService, slice, _singletonInstance;

slice = Array.prototype.slice;


/*
@class EBBucketService
@namespace EB
 */

EBBucketService = Object.extend(Evented, {
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

EBBucketService.reopenClass({
  create: function() {
    if (_singletonInstance != null) {
      return _singletonInstance;
    }
    return _singletonInstance = Object.create.apply(this, slice.call(arguments));
  },
  getSingleton: function() {
    return EBBucketService.create.apply(this, slice.call(arguments));
  }
});

exports["default"] = EBBucketService;;
},{}],7:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
exports["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("ella-label {\n  display: inline;\n  padding: 0.2em 0.6em 0.3em;\n  font-size: 75%;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.25em; }\n  ella-label.info, ella-label.success, ella-label.warn, ella-label.danger {\n    color: #ffffff; }\n  ella-label.info {\n    background-color: #5bc0de; }\n  ella-label.success {\n    background-color: #5cb85c; }\n  ella-label.warn {\n    background-color: #f0ad4e; }\n  ella-label.danger {\n    background-color: #d9534f; }\n\nella-control {\n  cursor: pointer;\n  display: inline-block;\n  color: #000000;\n  text-align: center;\n  text-decoration: none;\n  white-space: nowrap;\n  vertical-align: baseline; }\n  ella-control.activated {\n    opacity: 1; }\n  ella-control.disabled {\n    cursor: not-allowed;\n    pointer-events: none;\n    opacity: 0.65; }\n  ella-control:hover {\n    text-decoration: underline; }\n");
  
});
},{}]},{},[4])
(4)
});