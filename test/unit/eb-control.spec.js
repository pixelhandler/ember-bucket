/**
  EBControlComponent Spec
**/

(function() {

var type = 'control';

window.TEST_TEMPLATES[type] = function(){/*
  <span>Save</span>
*/}.compile();

var element = "eb-%@".fmt(type);
var activated = 'activated', disabled = 'disabled';

moduleForComponent(element, "Unit: component: " + element);

test('component is not activated, by default', function() {
  expect(1);
  var component = buildComponent(type, this);

  ok(!component.get(activated));
});

test('when not activated, component has disabled class', function() {
  expect(3);
  var component = buildComponent(type, this);

  ok(component.get(disabled));
  ok(find(element).hasClass(disabled), "has '%@' class".fmt(disabled));
  equal(find(element).hasClass(activated), false, "does not have '%@' class".fmt(activated));
});

test('component does not trigger an action when not activated', function() {
  expect(1);
  var component = buildComponent(type, this, {action: 'externalAction'});

  var wasCalled = false;
  var targetObject = {
    externalAction: function(){
      wasCalled = true;
    }
  };
  component.set('targetObject', targetObject);

  click(element);
  notEqual(wasCalled, true, 'external Action was not called!');
});

test('component is activated when given a truthy value', function() {
  expect(3);
  var component = buildComponent(type, this, {activated: true});

  ok(component.get(activated));
  ok(find(element).hasClass(activated), "has '%@' class".fmt(activated));
  equal(find(element).hasClass(disabled), false, "does not have '%@' class".fmt(disabled));
});

test('component does trigger an action when activated', function() {
  expect(1);
  var component = buildComponent(type, this, {
    action: 'externalAction',
    activated: true
  });

  var wasCalled = false;
  var targetObject = {
    externalAction: function(){
      wasCalled = true;
    }
  };
  component.set('targetObject', targetObject);

  click(element);
  ok(wasCalled, 'external Action was called!');
});

test("component uses the action name as a css class", function() {
  expect(1);
  var component = buildComponent(type, this, {action: 'externalAction'});
  var action = component.get('action');

  ok(find(element).hasClass(action), "has '%@' class".fmt(action));
});

test('component template has "Save" text', function() {
  expect(1);
  var component = buildComponent(type, this);

  ok(find(element).text().trim() === 'Save');
});

}());
