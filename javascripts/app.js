// Sample EB Bucket Service App

Ember.Application.initializer({
  name: 'buckets-injection',

  initialize: function (container, application) {
    application.inject('controller:items', 'bucket', 'service:bucket');
  }
});

App = Ember.Application.create({
  rootElement: '#example-app'
});

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

//App.ItemsView = Ember.View.extend();

App.ItemsController = Ember.ArrayController.extend(EB.SaveBucketMixin, {

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

var topTen = [
  'Uncaught Error: Attempted to handle event `willCommit` on … while in state WAT.',
  'We already do a bad enough job with blog-post vs. blog_post vs. blogPost vs. BlogPost vs. blog.post',
  'ryanflorence has been double timing ember with react #tattletale',
  'But how are actually doing it in the code?',
  "'foo/abc', ['./bar'] -> 'foo/bar', but 'foo', ['./bar'] -> 'foo/bar' so ./foo -> foo seems logical in this case",
  'I declared a hasMany relation. I am having trouble using it to obtain a list of associated object',
  'this ng-embereño esta confundido',
  'ViewHole: Ember.computed.alias("translusion")',
  'Error: Assertion Failed: Error: Assertion Failed: The URL "/links" did not match any routes in your application',
  'ebryn trying to join the angular core team. like a phablet, he will be the best of both worlds'
];

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('items');
  }
});

App.ItemsRoute = Ember.Route.extend({
  model: function() {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var items = [];
      for (var i = 1; i <= topTen.length; i++) {
        items.push(App.ItemModel.create({
          item: topTen[i - 1],
          order: i
        }));
      }
      resolve(items);
    });
  }
});

App.ItemModel = Ember.Object.extend(EB.BucketProcessableMixin, {
  bucketMap: { 'save': { 'isDirty': [ true ] }},
  save: function() {
    var _this = this;
    return new Ember.RSVP.Promise(function (resolve, reject) {
      Ember.run.later(null, function() {
        _this._ogItem = _this._item;
        _this._ogOrder = _this._order;
        _this.set('isDirty', false);
        resolve(_this);
      }, 500);
    });
  },
  rollback: function() {
    this.setProperties({item: this._ogItem, order: this._ogOrder});
  },

  item: function(key, value) {
    // setter
    if (arguments.length > 1) {
      this._item = value;
      if (this._ogItem === null) this._ogItem = this._item;
    }
    // getter
    return this._item;
  }.property(),
  _item: null,
  _ogItem: null,

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
    return this.getProperties('item', 'order');
  },

  _propertyChanged: function() {
    props = this.serialize();
    ogProps = { item: this._ogItem, order: this._ogOrder };
    isDirty = (props.item !== ogProps.item || props.order !== ogProps.order);
    this.set('isDirty', isDirty);
    return { current: props, original: ogProps };
  }.observes('item', 'order'),
  isDirty: false
});

App.Router.map(function() {
  this.route('items', { path: "/items" });
});

App.Router.reopen({
  rootURL: '/examples/index.html/'
});
