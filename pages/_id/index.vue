<template>
  <div id="dashboard" class="w-full h-full overflow-y-auto p-4 md:p-6">
    <template v-if="!loading">
      <div class="flex items-center">
        <nuxt-link to="/">
          <span class="material-icons text-3xl sm:text-4xl lg:text-5xl text-gray-200 hover:text-white transform hover:scale-125 transition-transform duration-300 cursor-pointer">chevron_left</span>
        </nuxt-link>
        <p class="ml-2 md:ml-4 text-2xl sm:text-3xl lg:text-4xl font-coda font-extrabold">{{ username }}</p>

        <p class="ml-4 text-xs sm:text-sm text-white text-opacity-40 font-oswald font-light italic">Online {{ lastOnlineDistance }} ago</p>
        <div class="flex-grow" />
      </div>

      <div v-if="user" class="mt-4 mb-12 max-w-4xl mx-auto flex flex-wrap items-center justify-between">
        <div class="p-2 py-4 sm:p-4 md:p-6 w-1/2 sm:w-auto text-center sm:text-left">
          <p class="font-oswald text-xs md:text-sm font-semibold text-white text-opacity-40 uppercase">Rank</p>
          <p class="font-oswald font-black text-4xl md:text-5xl tracking-tighter text-white">#{{ user.rank }}</p>
        </div>
        <div class="p-2 py-4 sm:p-4 md:p-6 w-1/2 sm:w-auto text-center sm:text-left">
          <p class="font-oswald text-xs md:text-sm font-semibold text-white text-opacity-40 uppercase">ELO</p>
          <p class="font-oswald font-black text-4xl md:text-5xl tracking-tighter text-white">{{ user.elo }}</p>
        </div>
        <div class="p-2 py-4 sm:p-4 md:p-6 w-1/3 sm:w-auto text-center sm:text-left">
          <p class="font-oswald text-xs md:text-sm font-semibold text-white text-opacity-40 uppercase">Wins</p>
          <p class="font-oswald font-black text-4xl md:text-5xl tracking-tighter text-white">{{ user.wins }}</p>
        </div>
        <div class="p-2 py-4 sm:p-4 md:p-6 w-1/3 sm:w-auto text-center sm:text-left">
          <p class="font-oswald text-xs md:text-sm font-semibold text-white text-opacity-40 uppercase">Losses</p>
          <p class="font-oswald font-black text-4xl md:text-5xl tracking-tighter text-white">{{ user.losses }}</p>
        </div>
        <div class="p-2 py-4 sm:p-4 md:p-6 w-1/3 sm:w-auto text-center sm:text-left">
          <p class="font-oswald text-xs md:text-sm font-semibold text-white text-opacity-40 uppercase">Win Rate</p>
          <p v-if="user.wins + user.losses" class="font-oswald font-black text-4xl md:text-5xl tracking-tighter text-white">{{ Math.round((100 * user.wins) / (user.wins + user.losses)) }}%</p>
          <p v-else class="font-oswald font-black text-4xl md:text-5xl tracking-tighter text-white">N/A</p>
        </div>
      </div>

      <div v-if="userMatches.length && !isMdAndBelow" class="w-full max-w-4xl mx-auto" style="height: 250px">
        <p class="font-oswald text-sm font-semibold text-white text-opacity-40 uppercase px-6">Ranked Matches {{ currentYear - 1 }} - {{ currentYear }}</p>

        <match-heatmap :elo-history-by-date="eloHistoryByDate" class="-mt-2" @selectDate="selectDate" />
      </div>

      <div class="relative">
        <matches-table v-if="!loadingMatches" :title="matchesTableTitle" :matches="matchesTableMatches" :use-relative-date="!selectedDate" />
        <div v-else class="h-56 flex items-center justify-center">
          <loading-indicator class="w-32 h-32" />
        </div>
      </div>

      <div v-if="userMatches.length && !isMdAndBelow" class="w-full max-w-4xl mx-auto" style="height: 400px">
        <win-loss-chart :elo-history-by-date="eloHistoryByDate" :lowest-elo="lowestELO" />
      </div>
    </template>
    <div v-else class="h-full flex items-center justify-center">
      <loading-indicator class="w-32 h-32" />
    </div>
  </div>
</template>

<script>
import apiMixin from '@/mixins/api'

export default {
  mixins: [apiMixin],
  asyncData({ params }) {
    return {
      userIdParam: params.id,
      selectedDate: null,
      selectedJsDate: null,
      matchesForDate: []
    }
  },
  data() {
    return {
      user: null,
      loading: true,
      isMdAndBelow: false,
      loadingMatches: false
    }
  },
  computed: {
    userId() {
      return this.user ? this.user.id : null
    },
    username() {
      return this.user ? this.user['user-name'] : ''
    },
    lastOnline() {
      return this.user ? this.user['last-online'] : null
    },
    lastOnlineDistance() {
      if (!this.lastOnline) return ''
      var lod = new Date(this.lastOnline)
      return this.$formatDateDistance(lod)
    },
    currentYear() {
      return new Date().getFullYear()
    },
    matchesTableTitle() {
      if (!this.selectedDate) return 'Latest Ranked Matches'
      var datePretty = this.$formatDate(this.selectedJsDate, 'MMM d yyyy')
      return `Matches on ${datePretty}`
    },
    matchesTableMatches() {
      if (!this.selectedDate) return this.userMatches.slice(0, 10)
      return this.matchesForDate || []
    }
  },
  methods: {
    selectDate(jsdate) {
      if (this.loadingMatches) {
        console.warn('Already loading matches')
        return
      }
      this.selectedDate = null
      this.selectedJsDate = jsdate
      this.loadMatchesForDate(this.$formatDate(jsdate))
    },
    async loadMatchesForDate(date) {
      var latestUserMatch = this.userMatches[this.userMatches.length - 1]
      if (latestUserMatch) {
        this.loadingMatches = true
        if (latestUserMatch.date < date) {
          this.selectedDate = date
          this.matchesForDate = this.userMatches.filter((m) => m.date === date)
          this.loadingMatches = false
        } else if (this.nextUserMatchUrl) {
          await this.loadNextMatches()
          this.loadMatchesForDate(date)
        } else {
          console.error('Cannot load more matches')
          this.loadingMatches = false
        }
      }
    },
    async checkUser() {
      var user = await this.getUserData(this.userIdParam)
      if (!user) {
        console.error('Invalid user', user)
        this.user = null
        this.$router.replace('/')
      } else {
        this.user = user
        await this.loadAll()
      }
      this.loading = false
    },
    setSize() {
      this.isMdAndBelow = window.innerWidth < 768
    },
    resize() {
      this.setSize()
    }
  },
  mounted() {
    this.setSize()
    this.checkUser()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }
}
</script>
