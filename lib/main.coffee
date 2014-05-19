# Components
`import EllaLabelComponent from './components/ella-label-component';`
`import EllaControlComponent from './components/ella-control-component';`
`import EllaBucketComponent from './components/ella-bucket-component';`
#`import EllaStylesTemplate from './templates/main-css';`

# Services
`import EllaBucketService from './services/ella-bucket-service';`

# Mixins
`import EllaBucketProcessableMixin from './mixins/ella-bucket-processable-mixin';`

# Libraries
`import { Application } from 'ember';`

Application.initializer
  name: 'ella-bucket-components',
  initialize: (container) ->
    container.register 'component:ella-label', EllaLabelComponent
    container.register 'component:ella-control', EllaControlComponent
    container.register 'component:ella-bucket', EllaBucketComponent
    #container.register 'template:components/ella-bucket-css', EllaStylesTemplate, {singleton: true}

Application.initializer
  name: 'ella-bucket-service',
  initialize: (container) ->
    container.register 'service:ella-bucket', EllaBucketService, {singleton: true}
    #container.register 'mixin:ella-bucket-processable', EllaBucketProcessableMixin, {singleton: true}

`export {
  EllaLabelComponent,
  EllaControlComponent,
  EllaBucketComponent,
  EllaBucketService,
  EllaBucketProcessableMixin
}`
