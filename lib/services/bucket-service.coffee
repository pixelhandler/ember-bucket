`import { Object, A, Map, Evented, RSVP, run, get, set } from 'ember';`

slice = Array.prototype.slice

###
@class EBBucketService
@namespace EB
###

EBBucketService = Object.extend Evented,
  queues: null

  addToBucket: (name, target) ->
    bucket = @_bucket name
    bucket.addObject target

  removeFromBucket: (name, target) ->
    bucket = @_bucket name
    bucket.removeObject target

  getBucket: (name) ->
    bucket = @_bucket name

  emptyBucket: (name) ->
    bucket = @_bucket name
    @_bucket(name).forEach (target) ->
      bucket.removeObject target
    @trigger 'didEmpty' + name.capitalize()

  moveToBucket: (from, to) ->
    src = @_bucket from
    dest = @_bucket to
    src.forEach (item) -> dest.addObject item
    dest.forEach (item) -> src.removeObject item

  setOperation: (name, fn) ->
    @_operation name, fn

  reset: ->
    queues = get @, 'queues'
    queues.forEach (key) =>
      @emptyBucket key unless key.match /operation$/
      queues.remove key

  _initQueues: (->
    set @, 'queues', Map.create()
  ).on 'init'

  _bucket: (name) ->
    queues = get @, 'queues'
    bucket = queues.get name
    if !bucket
      queues.set name, A([])
      @_operation name, null
      @_setupCommand name
    bucket || queues.get name

  _operation: (name, fn) ->
    fnKey = "%@:operation".fmt name
    queues = get @, 'queues'
    if typeof fn is 'function'
      queues.set fnKey, fn
    else if fn is null
      _name = name
      queues.set fnKey, (target) -> target[_name].call(target)
    else
      queues.get fnKey

  _process: (name) ->
    bucket = @_bucket name
    fn = @_operation name
    results = A([])
    __process = (item) ->
      result = null
      run -> result = fn item
      if result and typeof result.then is 'function'
        results.pushObject result
        result.then -> bucket.removeObject item
      else
        bucket.removeObject item
      result
    __process item for item in bucket.toArray()
    if results.length
      suffix = name.capitalize()
      didProcess = 'did' + suffix
      didNotProcess = 'didNot' + suffix
      RSVP.Promise.all(results).then(
        => @trigger didProcess,
        => @trigger didNotProcess
      )

  _setupCommand: (name) ->
    _name = name
    command = 'do' + name.capitalize()
    processor = () => @_process _name
    @on(command, processor)
    @[command] = processor #@trigger command


_singletonInstance = null

EBBucketService.reopenClass
  create: ->
    return _singletonInstance if _singletonInstance?
    _singletonInstance = Object.create.apply @, slice.call arguments

  getSingleton: ->
    EBBucketService.create.apply @, slice.call arguments

`export default EBBucketService;`
