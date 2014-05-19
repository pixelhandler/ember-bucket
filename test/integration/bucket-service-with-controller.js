/**
  Integration: Bucket Service with a Controller
**/

(function() {

var doSaveCalled, doEmptyCalled;

/**
  Integration Test App
**/

Ember.Application.initializer({
  name: 'buckets-injection',

  initialize: function (container, application) {
    application.inject('controller:buckets', 'bucket', 'service:bucket');
  }
});

var bucketTemplate = function(){/*
  {{#each notice in notices}}
    {{#eb-label status=notice.status}}
      <span>{{notice.name}}</span>
    {{/eb-label}}
  {{/each}}
  {{#eb-control action='doSave' activated=bucketNotEmpty}}Save Bucket{{/eb-control}}
  {{#eb-control action='doEmpty' activated=bucketNotEmpty}}Empty Bucket{{/eb-control}}
  <br>
  {{#each model}}
    {{input value=name}}
  {{/each}}
*/}.compile();

App.BucketsView = Ember.View.extend({
  template: bucketTemplate
});

App.BucketsController = Ember.Controller.extend({
  notices: Ember.ArrayProxy.create({content: Em.A([])}),

  saveBucket: function() {
    return this.bucket.getBucket('save');
  }.property(),

  bucketNotEmpty: function() {
    return (this.get('saveBucket.length')) ? 1 : 0;
  }.property('saveBucket.[]'),

  actions: {
    doSave: function () {
      // FOR TEST Purposes
      doSaveCalled = true;
      return false;
    },
    doEmpty: function () {
      // FOR TEST Purposes
      doEmptyCalled = true
      return false;
    }
  },
});

App.BucketsRoute = Ember.Route.extend({
  model: function() {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var items = [];
      for (var i = 0; i < 10; i++) {
        items.push(App.BucketModel.create({
          name: "model-%@".fmt(i)
        }));
      }
      resolve(items);
    })
  }
});

App.BucketModel = Ember.Object.extend(EB.BucketProcessableMixin, {
  bucketMap: { 'save': { 'isDirty': [ true ] }},
  save: function() {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      resolve();
    })
  },
  isDirty: false,
  name: null,
  nameChanged: function(model, prop) {
    this.set('isDirty', true);
  }.observes('name')
});

App.Router.map(function() {
  this.route('buckets', { path: "/buckets" });
});

/**
  TESTS
**/

var target, service;

module('Integration: eb-bucket with a Controller', {
  setup: function() {
    doSaveCalled = doEmptyCalled = false;
    Ember.run(function() {
      target = App.BucketModel.create();
      service = target._getBucketService();
    });
  },
  teardown: function() {
    Ember.run(function() {
      service.reset();
    });
    App.reset();
  }
});

test('Controller responds to bucket controls (commands)', function() {
  expect(4);
  visit('/buckets');
  andThen(function() {
    var inputs = $('input', '#ember-testing');
    equal(inputs.length, 10, 'Ten inputs rendered');

    Ember.run(function() {
      for (var i = 0; i < inputs.length; i++) {
        fillIn(inputs[i], "changed-%@".fmt(i));
      }
    });
    andThen(function() {
      var bucket = service.getBucket('save');
      ok(bucket.length === 10, 'Save bucket has ten models');

      click('eb-control.doEmpty').then(function() {
        ok(doEmptyCalled, 'Action doEmpty called');
      });

      click('eb-control.doSave').then(function() {
        ok(doSaveCalled, 'Action doSave called');
      });
    });
  })
});

}());
