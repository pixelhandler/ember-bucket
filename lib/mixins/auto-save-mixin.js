/**
Auto Save Mixin works with BucketProcessableMixin, using a set time interval to
call a model's `save` method only when the model property for `isDirty` is true.

@class AutoSaveMixin
@namespace EB
@requires BucketProcessableMixin
*/
var AutoSaveMixin = Mixin.create({
  /**
  @method autoSave
  */
  autoSave: function() {
    if (get(this, 'autoSaveEnabled') && get(this, 'canAutoSave') && isReallyDirty(this)) {
      Ember.run.debounce(this, '_doAutoSave', get(this, 'autoSaveInterval'));
    }
  }.observes('autoSaveEnabled', 'canAutoSave', 'isDirty'),

  /**
  Set the criteria for ability to auto save
  @property canAutoSave
  */
  canAutoSave: function() {
    return !get(this, 'isNew');
  }.property('isNew'),

  /**
  @property autoSaveEnabled
  @type Boolean
  */
  autoSaveEnabled: false,

  /**
  @property autoSaveInterval
  @type Number
  */
  autoSaveInterval: 1200,

  /**
  @private
  @method _doAutoSave
  */
  _doAutoSave: function() {
    if (get(this, 'isDirty')) {
      var _this = this;
      // remove from the bucket to save independently
      this.removeFromBucket('save')
      this.save().then(null, function() {
        // when save is not successful, put model back into the save bucket
        _this.addToBucket('save');
      });
    }
  }
});

var isReallyDirty = function (model) {
  hasChangingAttr = false;
  attrs = [];
  model.eachAttribute(function (name) { attrs.push(name); });
  changedAttrs = model.changedAttributes();
  for (var attr in changedAttrs) {
    if (changedAttrs.hasOwnProperty(attr) && attrs.contains(attr)) {
      hasChangingAttr = true;
      break;
    }
  }
  return hasChangingAttr;
};

export default AutoSaveMixin;
