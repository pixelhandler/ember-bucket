define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;

    /**
    @class EBLabelComponent
    @extends Ember.Component
    @namespace EB
    */
    var EBLabelComponent;

    EBLabelComponent = {
      tagName: 'eb-label',
      classNameBindings: ['status'],
      status: 'info'
    };

    __exports__["default"] = Component.extend(EBLabelComponent);
  });