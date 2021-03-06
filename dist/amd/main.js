define(
  ["./components/eb-label-component","./components/eb-control-component","./components/eb-bucket-component","./templates/main-css","./services/bucket-service","./mixins/bucket-processable-mixin","./mixins/save-bucket-mixin","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __exports__) {
    "use strict";
    // Components
    var EBLabelComponent = __dependency1__["default"] || __dependency1__;
    var EBControlComponent = __dependency2__["default"] || __dependency2__;
    var EBBucketComponent = __dependency3__["default"] || __dependency3__;
    var EBStylesTemplate = __dependency4__["default"] || __dependency4__;

    // Services
    var BucketService = __dependency5__["default"] || __dependency5__;

    // Mixins
    var BucketProcessableMixin = __dependency6__["default"] || __dependency6__;
    var SaveBucketMixin = __dependency7__["default"] || __dependency7__;

    // Libraries
    var Application = __dependency8__.Application;

    Application.initializer({
      name: 'eb-bucket-components',
      initialize: function(container) {
        container.register('component:eb-label', EBLabelComponent);
        container.register('component:eb-control', EBControlComponent);
        container.register('component:eb-bucket', EBBucketComponent);
        return container.register('template:components/eb-bucket-css', EBStylesTemplate);
      }
    });

    Application.initializer({
      name: 'bucket-service',
      initialize: function(container) {
        return container.register('service:bucket', BucketService, {
          singleton: true
        });
      }
    });

    __exports__.EBLabelComponent = EBLabelComponent;
    __exports__.EBControlComponent = EBControlComponent;
    __exports__.EBBucketComponent = EBBucketComponent;
    __exports__.EBStylesTemplate = EBStylesTemplate;
    __exports__.BucketService = BucketService;
    __exports__.BucketProcessableMixin = BucketProcessableMixin;
    __exports__.SaveBucketMixin = SaveBucketMixin;
  });