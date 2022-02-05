<template>
  <div class="w-screen h-screen overflow-hidden bg-bg text-white">
    <Nuxt />
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {},
  mounted() {}
}
</script>