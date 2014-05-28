import { Component, A } from 'ember';

/**
Composite component of controls and labels for sending commands to a service

@class EBBucketComponent
@extends Ember.Component
@namespace EB
*/
var EBBucketComponent;

EBBucketComponent = {
  tagName: 'eb-bucket',
  notices: A()
};

export default Component.extend(EBBucketComponent);
