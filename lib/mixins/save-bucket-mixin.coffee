`import { Mixin, A, ArrayProxy, get, required, K } from 'ember';`

###
@class SaveBucketMixin
@namespace EB
###

SaveBucketMixin = Mixin.create
  # Set to true for init to listen for bucket events
  enableSaveBucketEvents: required

  # Action handler should call `this.doSave()`
  doSave: ->
    @_isSavingBucket = true if @enableSaveBucketEvents
    @bucket.doSave()

  # Template methods: mixin consumer can implement,
  # requires flag `enableSaveBucketEvents`
  saveBucketDidSave: -> @_isSavingBucket = false
  saveBucketDidNotSave: -> @_isSavingBucket = false
  saveBucketDidEmpty: K

  # Default notice settings
  bucketNotEmptyNotice:
    name: 'Unsaved Changes'
    status: 'info'

  saveBucketInit: (->
    return if !@enableSaveBucketEvents
    @bucket.on 'didSave', @, @saveBucketDidSave
    @bucket.on 'didNotSave', @, @saveBucketDidNotSave
    @bucket.on 'didEmptySave', @, @saveBucketDidEmpty
  ).on 'init'

  saveBucket: (->
    @bucket.getBucket 'save'
  ).property()

  saveBucketActivated: (->
    activated = get @, 'saveBucketNotEmpty'
    if @enableSaveBucketEvents
      activated = activated && !@_isSavingBucket
    activated
  ).property 'saveBucketNotEmpty'

  saveBucketNotEmpty: (->
    get(@, 'saveBucket.length') > 0
  ).property 'saveBucket.[]'

  saveBucketNotEmptyChanged: (->
    notices = @get 'notices'
    if get @, 'saveBucketNotEmpty'
      notices.addObject @bucketNotEmptyNotice
    else
      notices.removeObject @bucketNotEmptyNotice
  ).observes 'saveBucketNotEmpty'

  # `notices` list needs to be passed to a bucket component for display
  notices: ArrayProxy.create content: A []

  _isSavingBucket: false

`export default SaveBucketMixin;`
