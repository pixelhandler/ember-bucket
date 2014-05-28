// Components
import EBLabelComponent from './components/eb-label-component';
import EBControlComponent from './components/eb-control-component';
import EBBucketComponent from './components/eb-bucket-component';
import EBStylesTemplate from './templates/main-css';

// Services
import BucketService from './services/bucket-service';

// Mixins
import BucketProcessableMixin from './mixins/bucket-processable-mixin';
import SaveBucketMixin from './mixins/save-bucket-mixin';

// Libraries
import { Application } from 'ember';

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

export {
  EBLabelComponent,
  EBControlComponent,
  EBBucketComponent,
  EBStylesTemplate,
  BucketService,
  BucketProcessableMixin,
  SaveBucketMixin
};
