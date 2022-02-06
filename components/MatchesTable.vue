<template>
  <div v-if="matches.length" class="w-full max-w-full lg:max-w-4xl mx-auto py-12 px-0 sm:px-6">
    <p class="font-oswald text-xs sm:text-sm font-semibold text-white text-opacity-40 uppercase">Latest Ranked Matches</p>

    <div v-for="match in matches" :key="match.id" class="flex py-4">
      <div class="w-12 flex justify-end pr-4">
        <p class="font-oswald font-black" :class="match.won ? 'text-green-600' : 'text-red-600'">
          <span>{{ match.won ? '+' : '-' }}</span
          >{{ match.eloChange }}
        </p>
      </div>
      <nuxt-link :to="`/${match.opponent.id}`" class="font-oswald w-40 sm:w-56 hover:underline text-sm sm:text-base truncate">
        {{ match.opponent.UserName }} <span class="text-gray-400 text-xs sm:text-sm">&nbsp;({{ match.opponent.ELO }})</span>
      </nuxt-link>
      <div v-for="index in 3" :key="index" class="w-16 hidden sm:block">
        <p v-if="match.rounds[index - 1]" class="font-oswald text-xs sm:text-sm text-gray-400">{{ match.rounds[index - 1].userScore }}/{{ match.rounds[index - 1].opponentScore }}</p>
      </div>
      <div class="flex-grow" />
      <p class="font-oswald font-light italic text-gray-400 text-xs">played {{ match.createdAtDistance }} ago</p>
    </div>
  </div>
  <div v-else class="my-24">
    <p class="text-4xl font-oswald font-semibold text-center text-red-600">No matches found!</p>
  </div>
</template>

<script>
export default {
  props: {
    matches: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {}
}
</script>