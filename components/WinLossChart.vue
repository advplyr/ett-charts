<template>
  <apexchart height="100%" type="line" :options="options" :series="series"></apexchart>
</template>

<script>
export default {
  props: {
    eloHistoryByDate: {
      type: Object,
      default: () => {}
    },
    lowestElo: Number
  },
  data() {
    return {
      series: [
        {
          name: 'elo',
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }
      ],
      options: {
        colors: ['#39d353', '#D7263D', '#F9CE1D'],
        stroke: {
          curve: 'straight'
        },
        chart: {
          type: 'line',
          stacked: true,
          foreColor: '#FEFEFE'
        },
        xaxis: {},
        tooltip: {
          theme: 'dark'
        }
      }
    }
  },
  computed: {},
  methods: {},
  beforeMount() {
    var groupByDay = Object.values(this.eloHistoryByDate)
    this.series = []
    this.series.push({
      name: 'Wins',
      type: 'column',
      data: groupByDay.map((day) => day.wins)
    })
    this.series.push({
      name: 'Losses',
      type: 'column',
      data: groupByDay.map((day) => day.losses)
    })
    this.series.push({
      name: 'ELO',
      type: 'line',
      data: groupByDay.map((day) => day.lastelo)
    })
    this.options.yaxis = [
      {
        seriesName: 'Wins',
        title: 'Matches',
        title: {
          text: 'Matches',
          style: {
            fontSize: '14px'
          }
        }
      },
      {
        seriesName: 'Wins',
        show: false
      },
      {
        seriesName: 'ELO',
        opposite: true,
        min: Math.floor(this.lowestElo / 50) * 50,
        title: {
          text: 'ELO',
          style: {
            fontSize: '14px'
          }
        }
      }
    ]
    this.options.xaxis.categories = groupByDay.map((d) => d.date)
  }
}
</script>