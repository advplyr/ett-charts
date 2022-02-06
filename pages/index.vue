<template>
  <div class="w-full h-full">
    <div class="absolute top-0 right-0 px-4 py-3 md:px-8 md:py-6 z-50">
      <a href="https://github.com/advplyr/ett-charts" target="_blank">
        <img src="/images/github.png" class="w-8 h-8 md:w-12 md:h-12" />
      </a>
    </div>

    <div ref="usersearch" class="pt-16 pb-8 lg:pb-0 lg:pt-0 lg:absolute top-0 left-0 lg:h-full flex items-center justify-center lg:justify-end w-full lg:w-2/5">
      <div class="max-w-full lg:max-w-md">
        <h1 class="font-coda font-extrabold italic text-5xl md:text-6xl mb-8">ETT <span class="text-red-600">CHARTS</span></h1>
        <user-search :search-user="searchUser" @results="setResults" />
      </div>
    </div>
    <div ref="scroll" class="flex justify-end lg:h-full mx-auto px-8 py-0 lg:p-24 overflow-y-auto">
      <div class="lg:h-full w-full max-w-full lg:w-2/5 lg:min-w-md">
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
    },
    setSize() {
      if (!this.$refs.usersearch || !this.$refs.scroll) return

      var height = this.$refs.usersearch.clientHeight
      if (window.innerWidth < 1024) {
        this.$refs.scroll.style.height = window.innerHeight - height + 'px'
        console.log('Set height', this.$refs.scroll.style.height)
      } else {
        this.$refs.scroll.style.height = '100%'
      }
    },
    resize() {
      this.setSize()
    }
  },
  mounted() {
    this.setSize()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
  }
}
</script>

<style>
.results-container {
  max-height: calc(100vh - 400px);
}
</style>