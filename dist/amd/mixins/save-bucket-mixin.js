define(
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