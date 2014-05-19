/**
  EllaLabelComponent Spec
**/

(function() {

var type = 'label';

window.TEST_TEMPLATES[type] = function(){/*
  <span>Notice</span>
*/}.compile();

var element = "ella-%@".fmt(type);

moduleForComponent(element, "Unit: component: " + element);

test('component template has "Notice" text', function() {
  expect(1);
  var component = buildComponent(type, this);

  ok(find(element).text().trim() === 'Notice');
});

test("component has 'info' status class name by default", function() {
  expect(1);
  var component = buildComponent(type, this);
  var status = component.get('status');

  ok(find(element).hasClass(status), "has '%@' class".fmt(status));
});

"success warn danger".w().forEach(function(status){

  test("component accepts a '%@' value for class name".fmt(status), function() {
    expect(1);
    var value = status;
    var component = buildComponent(type, this, {status: value});

    ok(find(element).hasClass(value), "has '%@' class".fmt(value));
  });
});

}());
