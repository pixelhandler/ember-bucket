/**
  Integration: Bucket Service with a Controller
**/

(function() {

var doSaveCalled, doRollbackCalled;

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
  {{#eb-control action='save' activated=saveBucketNotEmpty}}Save Bucket{{/eb-control}}
  {{#eb-control action='cancel' activated=saveBucketNotEmpty}}Empty Bucket{{/eb-control}}
  <br>
  {{#each model}}
    {{input value=name}}
  {{/each}}
*/}.compile();

App.BucketsView = Ember.View.extend({
  template: bucketTemplate
});

App.BucketsController = Ember.Controller.extend(EB.SaveBucketMixin, {
  doSave: function() {
    this._super();
    // FOR TEST Purposes
    doSaveCalled = true;
  },
  doRollback: function() {
    this.bucket.moveToBucket('save', 'rollback');
    this.bucket.doRollback();
    // FOR TEST Purposes
    doRollbackCalled = true;
  },
  actions: {
    save: function () {
      this.doSave();
      return false;
    },
    cancel: function () {
      this.doRollback();
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
  rollback: function() {
    // no need to reset `name` this is only to test calling rollback
    this.set('isDirty', false);
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
    doSaveCalled = doRollbackCalled = false;
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
  expect(7);
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

      click('eb-control.cancel');

      andThen(function() {
        ok(doRollbackCalled, 'Action doRollback called');
        equal(bucket.length, 0, 'Save bucket has zero models');

        fillIn(inputs[3], "changed after rollback");
        andThen(function() {
          equal(bucket.length, 1, 'Save bucket has one models');
          click('eb-control.save');
          andThen(function() {
            equal(bucket.length, 0, 'Save bucket has zero model');
            ok(doSaveCalled, 'Action doSave called');
          });
        });
      });
    });
  });
});

}());
