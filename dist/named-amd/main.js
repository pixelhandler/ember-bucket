define("ember-bucket/components/eb-bucket-component",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;
    var A = __dependency1__.A;

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

    __exports__["default"] = Component.extend(EBBucketComponent);
  });
define("ember-bucket/components/eb-control-component",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;
    var get = __dependency1__.get;

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

    __exports__["default"] = Component.extend(EBControlComponent);
  });
define("ember-bucket/components/eb-label-component",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;

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

    __exports__["default"] = Component.extend(EBLabelComponent);
  });
define("ember-bucket/components/ella-sample-component",
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;
    var get = __dependency1__.get;
    var set = __dependency1__.set;
    var computed = __dependency1__.computed;

    /*
    @module emberella
    @submodule emberella-components
    */

    /**
      The `EllaSampleComponent` illustrates how to get started with Emberella
      Component Blueprint.

      To use this component in your app, add this to a template:

      ```handlebars
      {{#ella-sample}}
        <h1>{{view.tests}}</h1>
        <p>Click Me</p>
      {{/ella-sample}}
      ```

      @class EllaSampleComponent
      @namespace Emberella
      @extends Ember.Component
    */

    var EllaSampleComponent;

    EllaSampleComponent = {
      /**
        The type of element to render this view into. By default, samples will appear
        as `<ella-sample/>` elements.

        @property tagName
        @type String
        @default 'ella-sample'
      */
      tagName: 'ella-sample',

      /**
        HTML attributes that should be bound to this object's properties.

        @property attributeBindings
        @type Array
        @default ['_activated:activated']
      */
      attributeBindings: ['_activated:activated'],

      /**
        Activation state for this component instance.

        @property activated
        @type Boolean
        @default false
      */
      activated: false,

      /**
        A number for the click event to increment.

        @property tests
        @type Integer
        @default 0
      */
      tests: 0,

      /**
        @private

        Computed value for "activated" HTML attribute.

        @property _activated
        @type {Boolean|Null}
        @default null
        @readOnly
      */
      _activated: computed(function() {
        return get(this, 'activated') ? 'true' : null;
      }).property('activated').readOnly(),

      /**
        Handle the click event.

        @event click
      */
      click: function() {
        set(this, 'activated', !get(this, 'activated'));
        this.incrementProperty('tests');
      }
    };

    __exports__["default"] = Component.extend(EllaSampleComponent);
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
        return BucketService.getSingleton();
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

    __exports__["default"] = BucketProcessableMixin;;
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


    /*
    @class SaveBucketMixin
    @namespace EB
     */
    var SaveBucketMixin;

    SaveBucketMixin = Mixin.create({
      enableSaveBucketEvents: required,
      doSave: function() {
        if (this.enableSaveBucketEvents) {
          this._isSavingBucket = true;
        }
        return this.bucket.doSave();
      },
      saveBucketDidSave: function() {
        return this._isSavingBucket = false;
      },
      saveBucketDidNotSave: function() {
        return this._isSavingBucket = false;
      },
      saveBucketDidEmpty: K,
      bucketNotEmptyNotice: {
        name: 'Unsaved Changes',
        status: 'info'
      },
      saveBucketInit: (function() {
        if (!this.enableSaveBucketEvents) {
          return;
        }
        this.bucket.on('didSave', this, this.saveBucketDidSave);
        this.bucket.on('didNotSave', this, this.saveBucketDidNotSave);
        return this.bucket.on('didEmptySave', this, this.saveBucketDidEmpty);
      }).on('init'),
      saveBucket: (function() {
        return this.bucket.getBucket('save');
      }).property(),
      saveBucketActivated: (function() {
        var activated;
        activated = get(this, 'saveBucketNotEmpty');
        if (this.enableSaveBucketEvents) {
          activated = activated && !this._isSavingBucket;
        }
        return activated;
      }).property('saveBucketNotEmpty'),
      saveBucketNotEmpty: (function() {
        return get(this, 'saveBucket.length') > 0;
      }).property('saveBucket.[]'),
      saveBucketNotEmptyChanged: (function() {
        var notices;
        notices = this.get('notices');
        if (get(this, 'saveBucketNotEmpty')) {
          return notices.addObject(this.bucketNotEmptyNotice);
        } else {
          return notices.removeObject(this.bucketNotEmptyNotice);
        }
      }).observes('saveBucketNotEmpty'),
      notices: ArrayProxy.create({
        content: A([])
      }),
      _isSavingBucket: false
    });

    __exports__["default"] = SaveBucketMixin;;
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