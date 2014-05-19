`import { Component, get } from 'ember'`

###
@class EBControlComponent
@extends Ember.Component
@namespace EB
###

EBControlComponent =
  tagName: 'eb-control'

  classNameBindings: ['activated', 'action', 'disabled']

  click: ->
    @sendAction() if get @, 'activated'

  activated: false

  disabled: (->
    !get @, 'activated'
  ).property 'activated'

`export default Component.extend(EBControlComponent)`
