`import { Component } from 'ember'`

###
@module emberella
@submodule emberella-components
###

###
@class EllaLabelComponent
@extends Ember.Component
###

EllaLabelComponent =
  tagName: 'ella-label'

  classNameBindings: ['status']

  status: 'info'

`export default Component.extend(EllaLabelComponent)`
