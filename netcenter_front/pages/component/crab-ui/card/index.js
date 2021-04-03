Component({
  externalClasses: ['i-class'],

  options: {
    multipleSlots: true
  },

  properties: {
    full: {
      type: Boolean,
      value: false
    },
    titlestyle: {
      type: String,
      value: ''
    },
    imgstyle: {
      type: String,
      value: ''
    },
    thumb: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    },
    extra: {
      type: String,
      value: ''
    }
  }
});