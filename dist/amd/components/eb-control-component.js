define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;
    var get = __dependency1__.get;

    /**:
    @class EBControlComponent
    @extends Ember.Component
    @namespace EB
    */
    var EBControlComponent;

    EBControlComponent = {
      tagName: 'eb-control',
      
      classNameBindings: ['activated', 'action', 'disabled'],

      click: function() {
        if (get(this, 'activated')) {
          return this.sendAction();
        }
      },

      activated: false,

      disabled: (function() {
        return !get(this, 'activated');
      }).property('activated')
    };

    __exports__["default"] = Component.extend(EBControlComponent);
  });