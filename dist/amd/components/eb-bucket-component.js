define(
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Component = __dependency1__.Component;
    var A = __dependency1__.A;

    /*
    Composite component of controls and labels for sending commands to a service

    @class EBBucketComponent
    @extends Ember.Component
    @namespace EB
     */
    var EBBucketComponent;

    EBBucketComponent = {
      tagName: 'eb-bucket',
      notices: A()
    };

    __exports__["default"] = Component.extend(EBBucketComponent);
  });