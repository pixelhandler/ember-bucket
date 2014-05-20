"use strict";
var Mixin = require("ember").Mixin;
var A = require("ember").A;
var get = require("ember").get;
var required = require("ember").required;
var K = require("ember").K;


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
  notices: Ember.ArrayProxy.create({
    content: A([])
  }),
  _isSavingBucket: false
});

exports["default"] = SaveBucketMixin;;