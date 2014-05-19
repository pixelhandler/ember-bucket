# Components
`import EBLabelComponent from './components/eb-label-component';`
`import EBControlComponent from './components/eb-control-component';`
`import EBBucketComponent from './components/eb-bucket-component';`
`import EBStylesTemplate from './templates/main-css';`

# Services
`import BucketService from './services/bucket-service';`

# Mixins
`import BucketProcessableMixin from './mixins/bucket-processable-mixin';`

# Libraries
`import { Application } from 'ember';`

Application.initializer
  name: 'eb-bucket-components',
  initialize: (container) ->
    container.register 'component:eb-label', EBLabelComponent
    container.register 'component:eb-control', EBControlComponent
    container.register 'component:eb-bucket', EBBucketComponent

Application.initializer
  name: 'bucket-service',
  initialize: (container) ->
    container.register 'service:bucket', BucketService, {singleton: true}

`export {
  EBLabelComponent,
  EBControlComponent,
  EBBucketComponent,
  EBStylesTemplate,
  BucketService,
  BucketProcessableMixin
}`
