document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

App = Ember.Application.create({});

App.rootElement = '#ember-testing';

emq.globalize();
App.setupForTesting();
App.injectTestHelpers();


setResolver(Ember.DefaultResolver.extend({
  testSubjects: {
    'component:ella-label': Emberella2.EllaLabelComponent,
    'component:ella-control': Emberella2.EllaControlComponent,
    'component:ella-bucket': Emberella2.EllaBucketComponent,
    'service:ella-bucket': Emberella2.EllaBucketService
    //'mixin:ella-bucket-processable': Emberella.EllaBucketProcessableMixin
  },
  resolve: function(fullName) {
    return this.testSubjects[fullName] || this._super.apply(this, arguments);
  }
}).create());


Function.prototype.compile = function() {
  var template = this.toString().split('\n').slice(1,-1).join('\n') + '\n';
  return Ember.Handlebars.compile(template);
}

function lookupComponent(id) {
  return Ember.View.views[id];
}

function buildComponent(type, test, props) {
  props = props || {};
  var component = test.subject(Ember.merge({
    template: window.TEST_TEMPLATES[type]
  }, props));
  test.append();
  return component;
}

window.TEST_TEMPLATES = {}; 
