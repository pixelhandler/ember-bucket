!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.EB=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Component = window.Ember.Component;
var A = window.Ember.A;

/**
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

/**:
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

/**
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
// Components
var EBLabelComponent = _dereq_("./components/eb-label-component")["default"] || _dereq_("./components/eb-label-component");
var EBControlComponent = _dereq_("./components/eb-control-component")["default"] || _dereq_("./components/eb-control-component");
var EBBucketComponent = _dereq_("./components/eb-bucket-component")["default"] || _dereq_("./components/eb-bucket-component");
var EBStylesTemplate = _dereq_("./templates/main-css")["default"] || _dereq_("./templates/main-css");

// Services
var BucketService = _dereq_("./services/bucket-service")["default"] || _dereq_("./services/bucket-service");

// Mixins
var BucketProcessableMixin = _dereq_("./mixins/bucket-processable-mixin")["default"] || _dereq_("./mixins/bucket-processable-mixin");
var SaveBucketMixin = _dereq_("./mixins/save-bucket-mixin")["default"] || _dereq_("./mixins/save-bucket-mixin");

// Libraries
var Application = window.Ember.Application;

Application.initializer({
  name: 'eb-bucket-components',
  initialize: function(container) {
    container.register('component:eb-label', EBLabelComponent);
    container.register('component:eb-control', EBControlComponent);
    container.register('component:eb-bucket', EBBucketComponent);
    return container.register('template:components/eb-bucket-css', EBStylesTemplate);
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
exports.SaveBucketMixin = SaveBucketMixin;
},{"./components/eb-bucket-component":1,"./components/eb-control-component":2,"./components/eb-label-component":3,"./mixins/bucket-processable-mixin":5,"./mixins/save-bucket-mixin":6,"./services/bucket-service":7,"./templates/main-css":8}],5:[function(_dereq_,module,exports){
"use strict";
var Mixin = window.Ember.Mixin;
var Evented = window.Ember.Evented;
var get = window.Ember.get;
var BucketService = _dereq_("../services/bucket-service")["default"] || _dereq_("../services/bucket-service");

/**
@class BucketProcessableMixin
@namespace EB
*/
var BucketProcessableMixin, bucketObserverFactory,
  __hasProp = {}.hasOwnProperty;

var BucketProcessableMixin = Mixin.create({

  /**
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

  /**
  @method addToBucket
  @param {String} name - the bucket name to add this object to
  */
  addToBucket: function(name) {
    this._getBucketService().addToBucket(name, this);
  },

  /**
  @method removeFromBucket
  @param {String} name - the bucket name to remove this object from
  */
  removeFromBucket: function(name) {
    this._getBucketService().removeFromBucket(name, this);
  },

  /**
  @method makeProcessable - is fired on init, checks for service
  */
  makeProcessable: (function() {
    if (!this._getBucketService()) {
      throw new Error('Error: makeProcessable requires ' + service);
    }
    this._setupBucketMapObservers();
  }).on('init'),

  /**
  @private
  @method _setupBucketMapObservers
  */
  _setupBucketMapObservers: function() {
    var bucketName, config, prop, values;
    var map = get(this, 'bucketMap');
    for (bucketName in map) {
      if (!map.hasOwnProperty(bucketName)) continue;
      config = map[bucketName];
      for (prop in config) {
        if (!config.hasOwnProperty(prop)) continue;
        values = config[prop];
        bucketObserverFactory.call(this, bucketName, prop, values);
      }
    }
  },

  /**
  @private
  @method _getBucketService
  */
  _getBucketService: function() {
    return BucketService.getSingleton();
  }
});

var bucketObserverFactory = function(bucketName, prop, values) {
  if (!Array.isArray(values)) { return; }
  var _this = this, _bucketName = bucketName, _prop = prop, _values = values;
  var observer = function() {
    var val = get(_this, _prop);
    if (_values.contains(val)) {
      _this.addToBucket(_bucketName);
    } else {
      _this.removeFromBucket(_bucketName);
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

exports["default"] = BucketProcessableMixin;
},{"../services/bucket-service":7}],6:[function(_dereq_,module,exports){
"use strict";
var Mixin = window.Ember.Mixin;
var A = window.Ember.A;
var ArrayProxy = window.Ember.ArrayProxy;
var get = window.Ember.get;
var required = window.Ember.required;
var K = window.Ember.K;

/**
@class SaveBucketMixin
@namespace EB
*/
var SaveBucketMixin;

SaveBucketMixin = Mixin.create({
  /**
  Set to true for init to listen for bucket events
  @property enableSaveBucketEvents
  */
  enableSaveBucketEvents: required,

  /**
  Action handler should call `this.doSave()`
  @method doSave
  */
  doSave: function() {
    if (this.enableSaveBucketEvents) {
      this._isSavingBucket = true;
    }
    return this.bucket.doSave();
  },

  /**
  @method saveBucketDidSave
  */
  saveBucketDidSave: function() {
    this._isSavingBucket = false;
  },

  /**
  @method saveBucketDidNotSave
  */
  saveBucketDidNotSave: function() {
    this._isSavingBucket = false;
  },

  /**
  @method saveBucketDidEmpty - no-op
  */
  saveBucketDidEmpty: K,

  /**
  Default notice settings
  @property bucketNotEmptyNotice
  */
  bucketNotEmptyNotice: {
    name: 'Unsaved Changes',
    status: 'info'
  },

  /**
  @method saveBucketInit
  */
  saveBucketInit: (function() {
    if (!this.enableSaveBucketEvents) {
      return;
    }
    this.bucket.on('didSave', this, this.saveBucketDidSave);
    this.bucket.on('didNotSave', this, this.saveBucketDidNotSave);
    return this.bucket.on('didEmptySave', this, this.saveBucketDidEmpty);
  }).on('init'),

  /**
  @property saveBucket
  */
  saveBucket: (function() {
    return this.bucket.getBucket('save');
  }).property(),

  /**
  @property saveBucketActivated
  */
  saveBucketActivated: (function() {
    var activated = get(this, 'saveBucketNotEmpty');
    if (this.enableSaveBucketEvents) {
      activated = activated && !this._isSavingBucket;
    }
    return activated;
  }).property('saveBucketNotEmpty'),

  /**
  @property saveBucketNotEmpty
  */
  saveBucketNotEmpty: (function() {
    return get(this, 'saveBucket.length') > 0;
  }).property('saveBucket.[]'),

  /**
  @method saveBucketNotEmptyChanged
  */
  saveBucketNotEmptyChanged: (function() {
    var notices = this.get('notices');
    if (get(this, 'saveBucketNotEmpty')) {
      notices.addObject(this.bucketNotEmptyNotice);
    } else {
      notices.removeObject(this.bucketNotEmptyNotice);
    }
  }).observes('saveBucketNotEmpty'),

  /**
  `notices` list needs to be passed to a bucket component for display
  @property notices
  */
  notices: ArrayProxy.create({
    content: A([])
  }),

  /**
  @private
  @property _isSavingBucket
  */
  _isSavingBucket: false
});

exports["default"] = SaveBucketMixin;
},{}],7:[function(_dereq_,module,exports){
"use strict";
var Object = window.Ember.Object;
var A = window.Ember.A;
var Map = window.Ember.Map;
var Evented = window.Ember.Evented;
var RSVP = window.Ember.RSVP;
var run = window.Ember.run;
var get = window.Ember.get;
var set = window.Ember.set;

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
    var __process = function(item) {
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
    var bucketItems = bucket.toArray();
    for (var i = 0, len = bucketItems.length; i < len; i++) {
      __process(bucketItems[i]);
    }
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

exports["default"] = BucketService;
},{}],8:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
exports["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  


  data.buffer.push("eb-label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:700;line-height:1;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}eb-label.info,eb-label.success,eb-label.warn,eb-label.danger{color:#fff}eb-label.info{background-color:#5bc0de}eb-label.success{background-color:#5cb85c}eb-label.warn{background-color:#f0ad4e}eb-label.danger{background-color:#d9534f}eb-control{cursor:pointer;display:inline-block;color:#000;text-align:center;text-decoration:none;white-space:nowrap;vertical-align:baseline}eb-control.activated{opacity:1}eb-control.disabled{cursor:not-allowed;pointer-events:none;opacity:.65}eb-control:hover{text-decoration:underline}");
  
});
},{}]},{},[4])
(4)
});