`import { Mixin, Evented, get } from 'ember';`
`import BucketService from '../services/bucket-service';`

###
@class BucketProcessableMixin
@namespace EB
###

BucketProcessableMixin = Mixin.create

  ###
  Map of properties and associated buckets (processes)

  The map is a list of properties with an object mapping the property
  value to the associated bucket. When a property changes to the mapped
  value this object is added to the bucket assigned to property value

  For example observing a model's `isDirty` property becoming `true`
  would add the object to the `save` bucket

  ```
  bucketMap:
    save:
      isDirty: [true]
  ```

  @property bucketMap
  @type {Object}
  ###
  bucketMap: Em.required

  ###
  @method addToBucket
  @param {String} name - the bucket name to add this object to
  ###
  addToBucket: (name) ->
    @_getBucketService().addToBucket name, @

  ###
  @method removeFromBucket
  @param {String} name - the bucket name to remove this object from
  ###
  removeFromBucket: (name) ->
    @_getBucketService().removeFromBucket name, @

  ###
  @method makeProcessable - is fired on init, checks for service
  ###
  makeProcessable: (->
    unless @_getBucketService()
      throw new Error 'Error: makeProcessable requires ' + service
    @_setupBucketMapObservers()
  ).on 'init'

  ###
  @private
  @method _setupBucketMapObservers
  ###
  _setupBucketMapObservers: ->
    map = get @, 'bucketMap'
    for own bucketName, config of map
      for own prop, values of config
        bucketObserverFactory.call @, bucketName, prop, values

  ###
  @private
  @method _getBucketService
  ###
  _getBucketService: ->
    BucketService.getSingleton()

bucketObserverFactory = (bucketName, prop, values) ->
  return unless Array.isArray values
  [_prop, _values, _bucketName] = [prop, values, bucketName]
  _this = @
  observer = ->
    val = get _this, _prop
    if _values.contains val
      _this.addToBucket bucketName
    else
      _this.removeFromBucket bucketName
  @addObserver prop, @, observer
  # Important! calling get prop primes the observer otherwise fires later
  get @, prop

if !Array.isArray
  Array.isArray = (arg) ->
    Object.prototype.toString.call(arg) == '[object Array]'

BucketProcessableMixin.reopen Evented

`export default BucketProcessableMixin;`
