"use strict";
var Component = require("ember").Component;

/**
@class EBLabelComponent
@extends Ember.Component
@namespace EB
*/
var EBLabelComponent;

EBLabelComponent = {
  tagName: 'eb-label',
  classNameBindings: ['status'],
  status: 'info'
};

exports["default"] = Component.extend(EBLabelComponent);