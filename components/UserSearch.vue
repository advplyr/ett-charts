<template>
  <div>
    <search-input v-model="username" placeholder="Search username" :loading.sync="loading" @input="inputUpdate" />
  </div>
</template>

<script>
export default {
  props: {
    searchUser: {
      type: Function,
      default: () => null
    }
  },
  data() {
    return {
      username: '',
      loading: false,
      searchValue: '',
      timer: null,
      timeouttime: 1000
    }
  },
  computed: {},
  methods: {
    async search(value) {
      this.searchValue = value
      var result = await this.searchUser(value)
      if (value !== this.searchValue) return
      this.loading = false
      this.$emit('results', result)
    },
    inputUpdate(v) {
      clearTimeout(this.timer)
      this.loading = true
      this.timer = setTimeout(() => {
        this.search(v)
      }, this.timeouttime)
    }
  },
  mounted() {}
}
</script>