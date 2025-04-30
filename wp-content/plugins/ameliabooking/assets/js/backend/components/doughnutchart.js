import { Doughnut } from 'vue-chartjs'

export default {

  extends: Doughnut,

  props: ['data'],

  data () {
    return {
      options: {
        cutoutPercentage: 80,
        legend: {
          labels: {
            usePointStyle: true,
            padding: 40,
            filter: function (tooltipItem) {
              return tooltipItem.index !== 2
            }
          },
          position: 'bottom'
        },
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
          mode: 'label',
          filter: function (tooltipItem) {
            return tooltipItem.index !== 2
          }
        }
      }
    }
  },

  methods: {
    update (reRender) {
      if (reRender) {
        this.renderChart(this.data, this.options)
      }

      this.$data._chart.update()
    }
  },

  mounted () {
    this.renderChart(this.data, this.options)
  }
}
