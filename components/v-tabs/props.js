export default {
  value: {
    type: Number,
    default: 0
  },
  tabs: {
    type: Array,
    default() {
      return []
    }
  },
  bgColor: {
    type: String,
    default: '#FCFCFC'
  },
  padding: {
    type: String,
    default: '0'
  },
  color: {
    type: String,
    default: '#333'
  },
  activeColor: {
    type: String,
    default: '#000'
  },
  fontSize: {
    type: String,
    default: '30rpx'
  },
  activeFontSize: {
    type: String,
    default: '35rpx'
  },
  bold: {
    type:Number,
    default: 700
  },
  scroll: {
    type: Boolean,
    default: true
  },
  height: {
    type: String,
    default: '70rpx'
  },
  lineColor: {
    type: String,
    default: 'hotpink'
  },
  lineHeight: {
    type: [String, Number],
    default: '10rpx'
  },
  lineScale: {
    type: Number,
    default: 0.5
  },
  lineRadius: {
    type: String,
    default: '10rpx'
  },
  pills: {
    type: Boolean,
    default: false
  },
  pillsColor: {
    type: String,
    default: 'hotpink'
  },
  pillsBorderRadius: {
    type: String,
    default: '50rpx'
  },
  field: {
    type: String,
    default: ''
  },
  fixed: {
    type: Boolean,
    default: false
  },
  paddingItem: {
    type: String,
    default: '0 23rpx'
  },
  lineAnimation: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: 1993
  }
}
