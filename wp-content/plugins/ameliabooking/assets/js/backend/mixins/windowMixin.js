export default {
  data () {
    return {
      screenWidth: window.innerWidth
    }
  },

  mounted () {
    window.onresize = () => {
      this.screenWidth = window.innerWidth
    }
  }
}
