// Sample EB Bucket Service App

Ember.Application.initializer({
  name: 'buckets-injection',

  initialize: function (container, application) {
    application.inject('controller:buckets', 'bucket', 'service:bucket');
  }
});

App = Ember.Application.create();

App.XBucketComponent = EB.EBBucketComponent.extend({
  layoutName: 'components/x-bucket'
});

App.ApplicationController = Ember.ObjectController.extend({
  notices: Em.A([
    {name: 'Info',    status: 'info'},
    {name: 'Success', status: 'success'},
    {name: 'Warning', status: 'warn'},
    {name: 'Danger',  status: 'danger'}
  ])
});

App.BucketsView = Ember.View.extend();

App.SaveBucketMixin = Ember.Mixin.create({
  // Set to true for init to listen for bucket events
  enableSaveBucketEvents: Ember.required,

  // Action handler should call `this.doSave()`
  doSave: function() {
    if (this.enableSaveBucketEvents) this._isSavingBucket = true;
    return this.bucket.doSave();
  },

  // Template methods: mixin consumer can implement, requires flag `enableSaveBucketEvents`
  saveBucketDidSave: function () { this._isSavingBucket = false; },
  saveBucketDidNotSave: function () { this._isSavingBucket = false; },
  saveBucketDidEmpty: Em.K,

  // Default notice settings
  bucketNotEmptyNotice: {
    name: 'Unsaved Changes',
    status: 'info'
  },

  saveBucketInit: function () {
    if (!this.enableSaveBucketEvents) return;
    this.bucket.on('didSave', this.saveBucketDidSave.bind(this));
    this.bucket.on('didNotSave', this.saveBucketDidNotSave.bind(this));
    this.bucket.on('didEmptySave', this.saveBucketDidEmpty.bind(this));
  }.on('init'),

  saveBucket: function () {
    return this.bucket.getBucket('save');
  }.property(),

  saveBucketActivated: function () {
    activated = this.get('saveBucketNotEmpty');
    if (this.enableSaveBucketEvents) {
      activated = activated && !this._isSavingBucket;
    }
    return activated;
  }.property('saveBucketNotEmpty'),

  saveBucketNotEmpty: function () {
    return this.get('saveBucket.length') > 0;
  }.property('saveBucket.[]'),

  saveBucketNotEmptyChanged: function () {
    var notices = this.get('notices');
    if (this.get('saveBucketNotEmpty')) {
      notices.addObject(this.bucketNotEmptyNotice);
    } else {
      notices.removeObject(this.bucketNotEmptyNotice);
    }
  }.observes('saveBucketNotEmpty'),

  // `notices` list needs to be passed to a bucket component for display
  notices: Ember.ArrayProxy.create({content: Em.A([])}),

  _isSavingBucket: false
});

App.BucketsController = Ember.ArrayController.extend(App.SaveBucketMixin, {

  enableSaveBucketEvents: true,

  //sortProperties: ['order'],

  actions: {
    save: function () {
      this.doSave();
    },
    cancel: function () {
      this.doRollback();
    }
  },

  doSave: function() {
    this._super().then(function() {
      this.set('content', this.sortBy('order'));
    }.bind(this));
  },

  doRollback: function() {
    this.bucket.moveToBucket('save', 'rollback');
    this.bucket.doRollback();
  },

  didSaveNotice: {name: 'Saved All', status: 'success'},
  didNotSaveNotice: {name: 'Saving Failed', status: 'warn'},
  didEmptySaveNotice: {name: 'Emptied', status: 'warn'},

  saveBucketDidSave: function() {
    this.get('notices').addObject(this.didSaveNotice);
    this._super();
  },

  saveBucketDidNotSave: function() {
    this.get('notices').addObject(this.didNotSaveNotice);
    this._super();
  },

  saveBucketDidEmpty: function() {
    this.get('notices').addObject(this.didEmptySaveNotice);
    this.get('notices').removeObject(this.bucketNotEmptyNotice);
  },

  saveBucketNotEmptyNotices: function() {
    if (!this.get('saveBucketNotEmpty')) return;
    var notices = this.get('notices');
    notices.removeObject(this.didSaveNotice);
    notices.removeObject(this.didEmptySaveNotice);
  }.observes('saveBucketNotEmpty')
});


App.BucketsRoute = Ember.Route.extend({
  model: function() {
    var teams = 'Kings Blackhawks Rangers Canadiens Ducks Bruins Islanders Sharks Penguins Oilers'.w();
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var items = [];
      for (var i = 1; i <= teams.length; i++) {
        items.push(App.BucketModel.create({
          name: teams[i - 1],
          order: i
        }));
      }
      resolve(items);
    })
  }
});

App.BucketModel = Ember.Object.extend(EB.BucketProcessableMixin, {
  bucketMap: { 'save': { 'isDirty': [ true ] }},
  save: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.run.later(null, function() {
        _this._ogName = _this._name;
        _this._ogOrder = _this._order;
        _this.set('isDirty', false);
        resolve(_this);
      }, 500);
    })
  },
  rollback: function() {
    this.setProperties({name: this._ogName, order: this._ogOrder});
  },

  name: function(key, value) {
    // setter
    if (arguments.length > 1) {
      this._name = value;
      if (this._ogName === null) this._ogName = this._name;
    }
    // getter
    return this._name;
  }.property(),
  _name: null,
  _ogName: null,

  order: function(key, value) {
    // setter
    if (arguments.length > 1) {
      this._order = parseInt(value, 10);
      if (this._ogOrder === null) this._ogOrder = this._order ;
    }
    // getter
    return this._order;
  }.property(),
  _order: null,
  _ogOrder: null,

  serialize: function() {
    return this.getProperties('name', 'order');
  },

  _propertyChanged: function() {
    props = this.serialize();
    ogProps = { name: this._ogName, order: this._ogOrder };
    isDirty = (props.name !== ogProps.name || props.order !== ogProps.order);
    this.set('isDirty', isDirty);
    return { current: props, original: ogProps }
  }.observes('name', 'order'),
  isDirty: false
});

App.Router.map(function() {
  this.route('buckets', { path: "/buckets" });
});

App.Router.reopen({
  rootURL: '/examples/index.html/'
});
