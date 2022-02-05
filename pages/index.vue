<template>
  <div class="w-full h-full">
    <div class="absolute top-0 left-0 h-full flex items-center justify-end w-2/5">
      <div class="max-w-md">
        <h1 class="font-coda font-extrabold italic text-6xl mb-8">ETT <span class="text-red-600">CHARTS</span></h1>
        <user-search :search-user="searchUser" @results="setResults" />
      </div>
    </div>
    <div ref="scroll" class="flex justify-end h-full mx-auto p-24 overflow-y-auto">
      <div class="h-full w-2/5" style="min-width: 448px">
        <leaderboard :load="getLeaderboard" :search-results="searchResults" />
      </div>
    </div>
  </div>
</template>

<script>
import apiMixin from '@/mixins/api'

export default {
  mixins: [apiMixin],
  data() {
    return {
      accountInput: '',
      loading: false,
      searchResults: []
    }
  },
  computed: {},
  methods: {
    setResults(results) {
      if (!results || !results.length) {
        this.searchResults = []
        return
      }
      if (this.$refs.scroll) this.$refs.scroll.scrollTo(0, 0)
      this.searchResults = results
        .map((r) => {
          return {
            id: r.id,
            username: r['user-name'],
            rank: r.rank,
            score: r.elo
          }
        })
        .filter((r) => r.rank)
        .sort((a, b) => a.rank - b.rank)
    }
  }
}
</script>

<style>
.results-container {
  max-height: calc(100vh - 400px);
}
</style>