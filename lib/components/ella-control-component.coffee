`import { Component, get } from 'ember'`

###
@module emberella
@submodule emberella-components
###

###
@class EllaControlComponent
@extends Ember.Component
###

EllaControlComponent =
  tagName: 'ella-control'

  classNameBindings: ['activated', 'action', 'disabled']

  click: ->
    @sendAction() if get @, 'activated'

  activated: false

  disabled: (->
    !get @, 'activated'
  ).property 'activated'

`export default Component.extend(EllaControlComponent)`
