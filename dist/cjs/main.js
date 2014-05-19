"use strict";
var EBLabelComponent = require("./components/eb-label-component")["default"] || require("./components/eb-label-component");

var EBControlComponent = require("./components/eb-control-component")["default"] || require("./components/eb-control-component");

var EBBucketComponent = require("./components/eb-bucket-component")["default"] || require("./components/eb-bucket-component");

var EBStylesTemplate = require("./templates/main-css")["default"] || require("./templates/main-css");

var BucketService = require("./services/bucket-service")["default"] || require("./services/bucket-service");

var BucketProcessableMixin = require("./mixins/bucket-processable-mixin")["default"] || require("./mixins/bucket-processable-mixin");

var Application = require("ember").Application;

Application.initializer({
  name: 'eb-bucket-components',
  initialize: function(container) {
    container.register('component:eb-label', EBLabelComponent);
    container.register('component:eb-control', EBControlComponent);
    return container.register('component:eb-bucket', EBBucketComponent);
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

exports.EBLabelComponent = EBLabelComponent;
exports.EBControlComponent = EBControlComponent;
exports.EBBucketComponent = EBBucketComponent;
exports.EBStylesTemplate = EBStylesTemplate;
exports.BucketService = BucketService;
exports.BucketProcessableMixin = BucketProcessableMixin;