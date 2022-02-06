<template>
  <div class="w-full mx-auto lg:mx-0 max-w-sm md:max-w-md md:min-h-full relative">
    <div v-if="!leaderboard.length && loading" class="w-full h-full flex items-center justify-center absolute top-0 right-0">
      <loading-indicator class="w-32 h-32" />
    </div>
    <nuxt-link v-for="user in items" :key="user.id" :to="`/${user.id || user.username}`" class="leaderboard-item flex items-center p-2 cursor-pointer">
      <p class="item-rank text-base md:text-lg font-oswald w-20 text-red-500">#{{ user.rank }}</p>
      <p class="item-username text-base md:text-lg font-oswald">{{ user.username }}</p>
      <div class="flex-grow" />
      <p class="item-elo text-sm md:text-base font-oswald text-gray-500">{{ user.score }}</p>
    </nuxt-link>
    <div id="bottomscroll" class="w-full h-8 mb-4 mt-4 bg-white bg-opacity-10" />
  </div>
</template>

<script>
export default {
  props: {
    load: {
      type: Function,
      default: () => null
    },
    searchResults: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      leaderboard: [],
      loading: false,
      min: 30
    }
  },
  computed: {
    items() {
      if (this.searchResults.length) return this.searchResults
      return this.leaderboard
    }
  },
  methods: {
    async loadMore() {
      this.loading = true
      var items = await this.load(this.leaderboard.length)
      if (!items || !items.length) {
        console.error('Invalid no items', items)
        return
      }
      this.loading = false
      this.leaderboard = this.leaderboard.concat(items)
      if (this.leaderboard.length < this.min) {
        this.loadMore()
      }
    },
    init() {
      let bottomscroll = document.getElementById('bottomscroll')
      let observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.intersectionRatio == 1 && this.leaderboard.length === this.min) {
              this.min += 10
              this.loadMore()
            }
          })
        },
        { threshold: 1 }
      )
      observer.observe(bottomscroll)
    }
  },
  mounted() {
    this.init()
    this.loadMore()
  }
}
</script>

<style scoped>
.leaderboard-item:hover .item-rank {
  transition: color 0.2s ease-out;
}
.leaderboard-item:hover .item-username {
  transition: color 0.2s ease-out;
  color: rgb(239, 68, 68);
}
.leaderboard-item:hover .item-elo {
  transition: color 0.2s ease-out;
  color: #ddd;
}
</style>