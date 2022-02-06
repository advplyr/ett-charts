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

      <div v-if="user" class="mt-4 max-w-4xl mx-auto flex flex-wrap items-center justify-between">
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

      <matches-table :matches="matches" />

      <div v-if="matches.length && !isMdAndBelow" class="w-full max-w-4xl mx-auto" style="height: 250px">
        <p class="font-oswald text-sm font-semibold text-white text-opacity-40 uppercase px-6">Ranked Matches {{ currentYear - 1 }} - {{ currentYear }}</p>

        <match-heatmap :elo-history-by-date="eloHistoryByDate" class="-mt-2" />
      </div>
      <div v-if="matches.length && !isMdAndBelow" class="w-full max-w-4xl mx-auto" style="height: 400px">
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
      userIdParam: params.id
    }
  },
  data() {
    return {
      user: null,
      loading: true,
      isMdAndBelow: false
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
    matches() {
      return this.userMatches ? this.userMatches.matches || [] : []
    },
    lastOnlineDistance() {
      if (!this.lastOnline) return ''
      var lod = new Date(this.lastOnline)
      return this.$formatDateDistance(lod)
    },
    currentYear() {
      return new Date().getFullYear()
    }
  },
  methods: {
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
