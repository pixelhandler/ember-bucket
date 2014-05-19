"use strict";
var Component = require("ember").Component;
var A = require("ember").A;

/*
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

exports["default"] = Component.extend(EBBucketComponent);