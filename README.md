# Ember Bucket

Bucket object for batch processing, singleton to be used as a service for buckets; with components for controls

See the example app code for usage. [View Demo](http://pixelhandler.github.io/ember-bucket/)

## Overview

The bucket object is intended to be used as a service object and injected as a dependency where needed, e.g. controllers.

The `eb-control` and `eb-label` components are simple elements for interaction with the a bucket. the `eb-bucket` component is a layout of labels and controls.

A `bucket` is a collection of objects to be processed (batch).

The `bucket service` is a singleton and generates buckets for batch processing of objects.

A `BucketProcessableMixin` is used with objects that will be processed in a bucket. For example an object with a `save` method can use this property `bucketMap: { 'save': { 'isDirty': [ true ] }}` to insert itself into a 'save' bucket when it's `isDirty` property becomes `true`. Alternatively it will remove itself from the 'save' bucket when `isDirty` is not `true`.

Each object in the bucket has a method with the same name as the bucket, e.g. 'save'. A 'save' bucket processes objects by calling each object's `save` method.

Objects that are processed successfully are moved from the bucket. And objects that fail remain in the bucket.

Objects in a bucket may use 'thenable' syntax (promises), and perhaps can move into another bucket depending whether the promise is rejected or resolved.

Control elements (eb-control component) can send an action to the object with the injected bucket service, e.g. a controller. For a `save` bucket the command to process is `doSave`; the convention is to prefix the name of the bucket with 'do' then camelize.

A bucket service can manage many buckets. For example a controller with actions for `save` and `cancel` may call `this.service.doSave()` and `this.service.doRollback()` to process the `save` and `rollback` buckets.

When the bucket's contents use promises the call to `doAction` returns a promise that is resolved when all the promies are resolved.

Contents of a bucket may be moved to another bucket, for example move items in the 'save' bucket to the 'rollback' bucket then calling `doRollback` to 'cancel' edits that should not be saved.

The bucket's events can be listened to for responding to processing actions. The events are prefixed with: 'did', 'didNot' and 'didEmpty'. So for a 'save' bucket the events are `didSave`, `didNotSave` and `didEmptySave`. These events are intended to be used for notifications.

In the examples you will see each component listed and a simple list of models that are members of a 'save' bucket.

## Development Notes

After cloning this repo...

1) Install all dependencies with [NPM]

    $ npm install

2) Start your test and development server using [testem]

    $ ./testem

* The [example application][example] runs on same port as testem.

Build distribution files:

    $ ./grunt dist


### Command `./testem`

* A Broccoli server will start and rebuild when it detects code changes
* Test'em will run tests and automatically re-run the tests each time Broccoli builds
* The component becomes available at <http://localhost:7357/examples/index.html> and will automatically reload each time Broccoli builds

### Command `./grunt`

* Broccoli will build the component for testing
* Test'em will run tests in multiple browsers
* Broccoli will build the component for distribution in AMD, Named AMD, CJS, and Global module formats (thanks to [Ryan Florence's broccoli-dist-es6-module][es6-dist])

### Thanks (and Links)

* [broccoli] - (speedy) build tool by Jo Liss
* [es6-dist] - Ryan Florence's broccoli-dist-es6-module
* [emberella-component-blueprint] - Blueprint for building components by Dana Franklin

[emberella-component-blueprint]: https://github.com/realityendshere/emberella-component-blueprint "blueprint"
[emberella]: https://github.com/realityendshere/emberella "Emberella"
[example]: http://localhost:7357/examples/index.html "Example Components and App"
[es6-dist]: https://github.com/rpflorence/broccoli-dist-es6-module "broccoli-dist-es6-module"
[broccoli]: https://github.com/joliss/broccoli "Broccoli"
[testem]: https://github.com/airportyh/testem "Test'em 'Scripts!"
[NPM]: https://www.npmjs.org "NPM"
