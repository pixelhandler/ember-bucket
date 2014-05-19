/**
  EllaBucketComponent Spec
**/

(function() {

var type = 'bucket', notices;

window.TEST_TEMPLATES[type] = function(){/*
  {{#each notice in notices}}
    {{#ella-label status=notice.status}}
      <span>{{notice.name}}</span>
    {{/ella-label}}
  {{/each}}
*/}.compile();

var element = "ella-%@".fmt(type);

moduleForComponent(element, 'Unit: component:' + element, {
  needs: ['component:ella-label', 'component:ella-control']
});

test('component can have no notices', function() {
  expect(2);
  var component = this.subject({
    layout: window.TEST_TEMPLATES[type]
  });
  this.append();

  ok(find(element).text().trim() === '', 'No notice renders');

  equal(find('ella-label', element).length, 0, 'Has no labels');
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
  ok(find('ella-label', element).hasClass('info'), 'Notice has "info" status, as CSS class');
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

  var infoNotice = find('ella-label.info', element)
  equal(infoNotice.text().trim(), 'Info', 'A notice renders with text: "Info"');
  equal(infoNotice.length, 1, 'Info Has "info" status as a CSS class');

  Ember.run(function() {
    component.get('notices').pushObject({ name: 'Warning', status: 'warn' });
  });

  var warningNotice = find('ella-label.warn', element);
  equal(warningNotice.text().trim(), 'Warning', 'A notice renders with text: "Warning"');
  equal(warningNotice.length, 1, 'Warning Notice has "warn" status, as CSS class');

  Ember.run(function() { component.destroy(); });
});

test('component layout can use controls to send actions for managing a bucket', function() {
  expect(2);

  var og = window.TEST_TEMPLATES[type];
  window.TEST_TEMPLATES[type] = function(){/*
    {{#each notice in notices}}
      {{#ella-label status=notice.status}}
        <span>{{notice.name}}</span>
      {{/ella-label}}
    {{/each}}
    {{#ella-control action='processQueue'}}Process{{/ella-control}}
    {{#ella-control action='emptyQueue'}}Empty{{/ella-control}}
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
