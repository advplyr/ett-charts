<template>
  <div id="dashboard" class="w-full h-full overflow-y-auto p-6">
    <template v-if="!loading">
      <div class="flex items-center">
        <nuxt-link to="/">
          <span class="material-icons text-5xl text-gray-200 hover:text-white transform hover:scale-125 transition-transform duration-300 cursor-pointer">chevron_left</span>
        </nuxt-link>
        <p class="ml-4 text-4xl font-coda font-extrabold">{{ username }}</p>

        <p class="ml-4 text-sm text-white text-opacity-40 font-oswald font-light italic">Online {{ lastOnlineDistance }} ago</p>
        <div class="flex-grow" />
      </div>

      <div v-if="user" class="mt-4 max-w-4xl mx-auto flex items-center justify-between">
        <div class="px-8">
          <p class="font-oswald text-sm font-semibold text-white text-opacity-40 uppercase">Rank</p>
          <p class="font-oswald font-black text-5xl tracking-tighter text-white">#{{ user.rank }}</p>
        </div>
        <div class="px-8">
          <p class="font-oswald text-sm font-semibold text-white text-opacity-40 uppercase">ELO</p>
          <p class="font-oswald font-black text-5xl tracking-tighter text-white">{{ user.elo }}</p>
        </div>
        <div class="px-8">
          <p class="font-oswald text-sm font-semibold text-white text-opacity-40 uppercase">Wins</p>
          <p class="font-oswald font-black text-5xl tracking-tighter text-white">{{ user.wins }}</p>
        </div>
        <div class="px-8">
          <p class="font-oswald text-sm font-semibold text-white text-opacity-40 uppercase">Losses</p>
          <p class="font-oswald font-black text-5xl tracking-tighter text-white">{{ user.losses }}</p>
        </div>
        <div class="px-8">
          <p class="font-oswald text-sm font-semibold text-white text-opacity-40 uppercase">Win Rate</p>
          <p v-if="user.wins + user.losses" class="font-oswald font-black text-5xl tracking-tighter text-white">{{ Math.round((100 * user.wins) / (user.wins + user.losses)) }}%</p>
          <p v-else class="font-oswald font-black text-5xl tracking-tighter text-white">N/A</p>
        </div>
      </div>

      <div v-if="matches.length" class="w-full max-w-4xl mx-auto py-12 px-6">
        <p class="font-oswald text-sm font-semibold text-white text-opacity-40 uppercase">Latest Ranked Matches</p>

        <div v-for="match in matches" :key="match.id" class="flex py-4">
          <div class="w-12 flex justify-end pr-4">
            <p class="font-oswald font-black" :class="match.won ? 'text-green-600' : 'text-red-600'">
              <span>{{ match.won ? '+' : '-' }}</span
              >{{ match.eloChange }}
            </p>
          </div>
          <nuxt-link :to="`/${match.opponent.id}`" class="font-oswald w-56 hover:underline">
            {{ match.opponent.UserName }} <span class="text-gray-400 text-sm">&nbsp;({{ match.opponent.ELO }})</span>
          </nuxt-link>
          <div v-for="index in 3" :key="index" class="w-16">
            <p v-if="match.rounds[index - 1]" class="font-oswald text-sm text-gray-400">{{ match.rounds[index - 1].userScore }}/{{ match.rounds[index - 1].opponentScore }}</p>
          </div>
          <div class="flex-grow" />
          <p class="font-oswald font-light italic text-gray-400 text-xs">played {{ match.createdAtDistance }} ago</p>
        </div>
      </div>
      <div v-else class="my-24">
        <p class="text-4xl font-oswald font-semibold text-center text-red-600">No matches found!</p>
      </div>

      <div v-if="matches.length" class="w-full max-w-4xl mx-auto" style="height: 250px">
        <p class="font-oswald text-sm font-semibold text-white text-opacity-40 uppercase px-6">Ranked Matches {{ currentYear - 1 }} - {{ currentYear }}</p>

        <match-heatmap :elo-history-by-date="eloHistoryByDate" class="-mt-2" />
      </div>
      <div v-if="matches.length" class="w-full max-w-4xl mx-auto" style="height: 400px">
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
      loading: true
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
    }
  },
  mounted() {
    this.checkUser()
  }
}
</script>
