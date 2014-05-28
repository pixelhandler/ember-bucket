import { Component, get } from 'ember';

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

export default Component.extend(EBControlComponent);
