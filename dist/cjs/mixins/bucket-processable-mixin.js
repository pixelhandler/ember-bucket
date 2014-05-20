"use strict";
var Mixin = require("ember").Mixin;
var Evented = require("ember").Evented;
var get = require("ember").get;

var BucketService = require("../services/bucket-service")["default"] || require("../services/bucket-service");


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

exports["default"] = BucketProcessableMixin;;