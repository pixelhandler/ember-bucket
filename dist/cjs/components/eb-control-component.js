"use strict";
var Component = require("ember").Component;
var get = require("ember").get;

/*
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

exports["default"] = Component.extend(EBControlComponent);