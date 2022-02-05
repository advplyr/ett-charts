<template>
  <apexchart id="heatmap" height="190px" type="heatmap" :options="options" :series="series"></apexchart>
</template>

<script>
export default {
  props: {
    eloHistoryByDate: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      series: [],
      options: {
        chart: {
          toolbar: {
            show: false
          },
          type: 'heatmap',
          background: '0',
          foreColor: '#fff'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          colors: ['#151515'],
          width: 3
        },
        plotOptions: {
          heatmap: {
            radius: 2,
            enableShades: false,
            useFillColorAsStroke: false,
            colorScale: {
              ranges: []
            }
          }
        },
        theme: {
          mode: 'dark'
        },
        legend: {
          show: false
        },
        tooltip: {
          theme: 'dark',
          followCursor: true
        },
        xaxis: {
          position: 'top',
          labels: {
            style: {
              fontSize: '10px',
              cssClass: 'fill-gray'
            },
            offsetY: 15
          },
          tooltip: {
            enabled: false
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          },
          crosshairs: {
            show: false
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: ['#ccc'],
              fontSize: '10px'
            }
          }
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          }
        }
      }
    }
  },
  computed: {},
  methods: {},
  beforeMount() {
    var daysMap = {}
    var dayOfWeekToday = Number(this.$formatDate(new Date(), 'e'))
    var daysToAddForStartTime = 7 - dayOfWeekToday

    var startDate = daysToAddForStartTime > 0 ? this.$addDaysToDate(new Date(), daysToAddForStartTime) : new Date()
    for (let i = 365; i >= 0; i--) {
      var date = this.$addDaysToDate(startDate, -i)
      var dayobj = {
        date,
        index: 365 - i,
        dateFormat: this.$formatDate(date),
        dayOfWeek: this.$formatDate(date, 'eee'),
        dayOfMonth: Number(this.$formatDate(date, 'd')),
        month: this.$formatDate(date, 'MMM'),
        dayOfWeekISO: Number(this.$formatDate(date, 'e')),
        matches: 0
      }
      daysMap[dayobj.dateFormat] = dayobj
    }

    var biggestDay = 0
    for (const date in this.eloHistoryByDate) {
      if (daysMap[date]) {
        daysMap[date].matches = this.eloHistoryByDate[date].wins + this.eloHistoryByDate[date].losses
        if (daysMap[date].matches > biggestDay) biggestDay = daysMap[date].matches
      }
    }

    var shades = ['#39d353', '#37c451', '#34b54e', '#32a74c', '#309849', '#2e8947', '#2b7a44', '#296c42', '#275d40', '#254e3d']
    var ranges = [
      {
        from: 0,
        to: 0,
        color: '#161d27'
      }
    ]
    var chunkBiggestDay = Math.ceil(biggestDay / shades.length)
    var currChunkStart = 1
    for (let i = 0; i < shades.length; i++) {
      ranges.push({
        from: currChunkStart,
        to: currChunkStart + chunkBiggestDay,
        color: shades[9 - i]
      })
      currChunkStart = currChunkStart + chunkBiggestDay + 1
    }
    this.options.plotOptions.heatmap.colorScale.ranges = ranges

    var seriesMap = {
      Sun: {},
      Mon: {},
      Tue: {},
      Wed: {},
      Thu: {},
      Fri: {},
      Sat: {}
    }

    var daysArr = Object.values(daysMap)
    var firstDay = daysArr[0]
    var firstDayISOIndex = firstDay.dayOfWeekISO - 1

    var daysOfWeek = Object.keys(seriesMap)
    var currDayToSubtract = 1
    for (let i = firstDayISOIndex - 1; i >= 0; i--) {
      var dow = daysOfWeek[i]
      var doy = this.$addDaysToDate(new Date(), -currDayToSubtract)
      currDayToSubtract++
      seriesMap[dow] = {
        name: dow,
        dates: [doy],
        data: [0]
      }
    }

    var xaxisLabels = []
    var currXIndex = 0

    Object.values(daysMap).forEach((dayobj) => {
      if (!seriesMap[dayobj.dayOfWeek].name) {
        seriesMap[dayobj.dayOfWeek].name = dayobj.dayOfWeek
        seriesMap[dayobj.dayOfWeek].dates = []
        seriesMap[dayobj.dayOfWeek].data = []
      }
      seriesMap[dayobj.dayOfWeek].dates.push(dayobj.date)
      seriesMap[dayobj.dayOfWeek].data.push(dayobj.matches)

      // Set X axis month labels
      var xindex = seriesMap[dayobj.dayOfWeek].data.length - 1
      if (xindex > currXIndex) {
        currXIndex++
        xaxisLabels.push('')
      }
      if (dayobj.dayOfMonth == 1) {
        xaxisLabels[currXIndex] = dayobj.month
      }
    })
    this.series = Object.values(seriesMap)

    this.options.xaxis.categories = xaxisLabels

    this.options.tooltip.custom = ({ series, seriesIndex, dataPointIndex, w }) => {
      var date = this.series[seriesIndex].dates[dataPointIndex]
      var value = series[seriesIndex][dataPointIndex]
      var prettyDate = this.$formatDate(date, 'MMM d yyyy')
      return '<div class="arrow_box bg-gray-700 text-sm px-4 py-1">' + `${value} matches on ${prettyDate}` + '</div>'
    }
  }
}
</script>

<style>
.fill-gray {
  fill: #ccc;
}
</style>