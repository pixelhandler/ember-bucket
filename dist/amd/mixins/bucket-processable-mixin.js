define(
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