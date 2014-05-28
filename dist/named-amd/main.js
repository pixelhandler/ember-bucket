define("ember-bucket/components/eb-bucket-component",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;
    var A = __dependency1__.A;

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

    __exports__["default"] = Component.extend(EBBucketComponent);
  });
define("ember-bucket/components/eb-control-component",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;
    var get = __dependency1__.get;

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

    __exports__["default"] = Component.extend(EBControlComponent);
  });
define("ember-bucket/components/eb-label-component",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;

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

    __exports__["default"] = Component.extend(EBLabelComponent);
  });
define("ember-bucket",
  ["./components/eb-label-component","./components/eb-control-component","./components/eb-bucket-component","./templates/main-css","./services/bucket-service","./mixins/bucket-processable-mixin","./mixins/save-bucket-mixin","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __exports__) {
    "use strict";
    // Components
    var EBLabelComponent = __dependency1__["default"] || __dependency1__;
    var EBControlComponent = __dependency2__["default"] || __dependency2__;
    var EBBucketComponent = __dependency3__["default"] || __dependency3__;
    var EBStylesTemplate = __dependency4__["default"] || __dependency4__;

    // Services
    var BucketService = __dependency5__["default"] || __dependency5__;

    // Mixins
    var BucketProcessableMixin = __dependency6__["default"] || __dependency6__;
    var SaveBucketMixin = __dependency7__["default"] || __dependency7__;

    // Libraries
    var Application = __dependency8__.Application;

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

    __exports__.EBLabelComponent = EBLabelComponent;
    __exports__.EBControlComponent = EBControlComponent;
    __exports__.EBBucketComponent = EBBucketComponent;
    __exports__.EBStylesTemplate = EBStylesTemplate;
    __exports__.BucketService = BucketService;
    __exports__.BucketProcessableMixin = BucketProcessableMixin;
    __exports__.SaveBucketMixin = SaveBucketMixin;
  });
define("ember-bucket/mixins/bucket-processable-mixin",
  ["ember","../services/bucket-service","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Mixin = __dependency1__.Mixin;
    var Evented = __dependency1__.Evented;
    var get = __dependency1__.get;
    var BucketService = __dependency2__["default"] || __dependency2__;

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

    __exports__["default"] = BucketProcessableMixin;
  });
define("ember-bucket/mixins/save-bucket-mixin",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Mixin = __dependency1__.Mixin;
    var A = __dependency1__.A;
    var ArrayProxy = __dependency1__.ArrayProxy;
    var get = __dependency1__.get;
    var required = __dependency1__.required;
    var K = __dependency1__.K;

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

    __exports__["default"] = SaveBucketMixin;
  });
define("ember-bucket/services/bucket-service",
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

    __exports__["default"] = BucketService;
  });
define("ember-bucket/templates/main-css",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("eb-label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:700;line-height:1;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}eb-label.info,eb-label.success,eb-label.warn,eb-label.danger{color:#fff}eb-label.info{background-color:#5bc0de}eb-label.success{background-color:#5cb85c}eb-label.warn{background-color:#f0ad4e}eb-label.danger{background-color:#d9534f}eb-control{cursor:pointer;display:inline-block;color:#000;text-align:center;text-decoration:none;white-space:nowrap;vertical-align:baseline}eb-control.activated{opacity:1}eb-control.disabled{cursor:not-allowed;pointer-events:none;opacity:.65}eb-control:hover{text-decoration:underline}");
      
    });
  });