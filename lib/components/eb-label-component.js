import { Component } from 'ember';

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

export default Component.extend(EBLabelComponent);
