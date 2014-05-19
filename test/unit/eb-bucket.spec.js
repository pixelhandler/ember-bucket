/**
  EBBucketComponent Spec
**/

(function() {

var type = 'bucket', notices;

window.TEST_TEMPLATES[type] = function(){/*
  {{#each notice in notices}}
    {{#eb-label status=notice.status}}
      <span>{{notice.name}}</span>
    {{/eb-label}}
  {{/each}}
*/}.compile();

var element = "eb-%@".fmt(type);

moduleForComponent(element, 'Unit: component:' + element, {
  needs: ['component:eb-label', 'component:eb-control']
});

test('component can have no notices', function() {
  expect(2);
  var component = this.subject({
    layout: window.TEST_TEMPLATES[type]
  });
  this.append();

  ok(find(element).text().trim() === '', 'No notice renders');

  equal(find('eb-label', element).length, 0, 'Has no labels');
  Ember.run(function() { component.destroy(); });
});

test('component can have one "Info" notice', function() {
  expect(2);
  var component = this.subject({
    layout: window.TEST_TEMPLATES[type]
  });
  this.append();

  Ember.run(function() {
    component.set('notices', [{ name: 'Info', status: 'info' }]);
  });

  equal(find(element).text().trim(), 'Info', 'A notice renders with text: "Info"');
  ok(find('eb-label', element).hasClass('info'), 'Notice has "info" status, as CSS class');
  Ember.run(function() { component.destroy(); });
});

test('component can have multiple notices', function() {
  expect(4);
  var component = this.subject({
    layout: window.TEST_TEMPLATES[type]
  });
  this.append();

  Ember.run(function() {
    component.get('notices').pushObject({ name: 'Info', status: 'info' });
  });

  var infoNotice = find('eb-label.info', element)
  equal(infoNotice.text().trim(), 'Info', 'A notice renders with text: "Info"');
  equal(infoNotice.length, 1, 'Info Has "info" status as a CSS class');

  Ember.run(function() {
    component.get('notices').pushObject({ name: 'Warning', status: 'warn' });
  });

  var warningNotice = find('eb-label.warn', element);
  equal(warningNotice.text().trim(), 'Warning', 'A notice renders with text: "Warning"');
  equal(warningNotice.length, 1, 'Warning Notice has "warn" status, as CSS class');

  Ember.run(function() { component.destroy(); });
});

test('component layout can use controls to send actions for managing a bucket', function() {
  expect(2);

  var og = window.TEST_TEMPLATES[type];
  window.TEST_TEMPLATES[type] = function(){/*
    {{#each notice in notices}}
      {{#eb-label status=notice.status}}
        <span>{{notice.name}}</span>
      {{/eb-label}}
    {{/each}}
    {{#eb-control action='processQueue'}}Process{{/eb-control}}
    {{#eb-control action='emptyQueue'}}Empty{{/eb-control}}
  */}.compile();

  var component = this.subject({
    layout: window.TEST_TEMPLATES[type]
  });
  this.append();

  var control = find('.processQueue', element);
  equal(control.text().trim(), 'Process', 'Control for processQueue action has text "Process"');

  var control = find('.emptyQueue', element);
  equal(control.text().trim(), 'Empty', 'Control for emptyQueue action has text "Empty"');

  Ember.run(function() { component.destroy(); });
  window.TEST_TEMPLATES[type] = og;
});

}());
