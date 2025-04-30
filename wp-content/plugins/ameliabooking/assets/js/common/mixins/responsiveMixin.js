export default {
  data () {
    return {
      xSmallMax: 479,
      xSmallMin: 481,
      smallMax: 767,
      smallMin: 768,
      mediumMax: 991,
      mediumMin: 992,
      largeMax: 1199,
      largeMin: 1200,
      xLargeMax: 1600,
      xLargeMin: 1601
    }
  },

  computed: {
    documentWidth () {
      return document.body.clientWidth
    }
  }
}
