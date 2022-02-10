export default {
  data() {
    return {
      eloHistory: null,
      eloHistoryByDate: null,
      highestELO: 0,
      lowestELO: 0,
      userMatches: [],
      nextUserMatchUrl: null
    }
  },
  methods: {
    async loadAll() {
      if (!this.userId) return
      await Promise.all([this.setEloHistory(), this.setUserMatches()])
    },
    groupEloHistory() {
      var groupByDay = {}
      var lowestELO = 1500
      var highestELO = 0
      this.eloHistory.forEach((hist) => {
        var elo = hist.attributes['current-elo']
        var date = hist.attributes['created-at'].split('T')[0]
        if (!groupByDay[date]) groupByDay[date] = { date: date, wins: 0, losses: 0, lastelo: 0, firstelo: 0 }
        if (hist.attributes['won-game']) groupByDay[date].wins++
        else groupByDay[date].losses++
        if (!groupByDay[date].firstelo) groupByDay[date].firstelo = elo
        groupByDay[date].lastelo = elo
        if (groupByDay[date].lastelo < lowestELO) lowestELO = groupByDay[date].lastelo
        if (!highestELO || elo > highestELO) highestELO = elo
      })
      this.eloHistoryByDate = groupByDay
      this.highestELO = highestELO
      this.lowestELO = lowestELO
    },
    async setEloHistory() {
      this.eloHistory = await this.getEloHistory()
      if (this.eloHistory) {
        this.groupEloHistory()
      }
    },
    async setUserMatches(ranked = true) {
      var append = ranked ? '/ranked' : ''
      var url = `https://www.elevenvr.club/accounts/${this.userId}/matches${append}`
      var data = await this.getUserMatches(url)
      if (data) {
        this.userMatches = this.userMatches.concat(data.matches || [])
        this.nextUserMatchUrl = data.links.next
      }
    },
    async loadNextMatches() {
      if (!this.nextUserMatchUrl) return
      var data = await this.getUserMatches(this.nextUserMatchUrl)
      if (data) {
        this.userMatches = this.userMatches.concat(data.matches || [])
        this.nextUserMatchUrl = data.links.next
      }
    },
    getUserData(userId) {
      return this.$axios.$get(`https://www.elevenvr.club/accounts/${userId}`).then((res) => {
        return {
          ...res.data.attributes,
          id: res.data.id
        }
      }).catch((error) => {
        console.error('Error fetching data', error)
        return null
      })
    },
    getEloHistory() {
      return this.$axios.$get(`https://www.elevenvr.club/accounts/${this.userId}/elo-history`).then((res) => {
        return res.data
      }).catch((error) => {
        console.error('Error fetching elo history data', error)
        return null
      })
    },
    getStateName(state) {
      if (state < 0) return 'Pending'
      else if (state === 0) return 'In Progress'
      else if (state === 1) return 'Completed'
      else if (state === 2) return 'Cancelled'
      else if (state === 3) return 'Expired'
      else if (state === 4) return 'Pending Completion'
      else if (state === 5) return 'Reverted'
      else if (state === 6) return 'Reversed'
      return 'Unknown'
    },
    cleanRound(round, roundIndex, userTeam, opponentTeam) {
      var attributes = round.attributes || {}
      var userScore = attributes[`${userTeam}-score`]
      var opponentScore = attributes[`${opponentTeam}-score`]
      return {
        id: attributes.id,
        index: roundIndex,
        userScore,
        opponentScore,
        won: userScore > opponentScore,
        createdAt: attributes['created-at'],
        state: attributes.state, // Unknown if this works
        winner: attributes.winner // Unknown if this works
      }
    },
    cleanMatch(data, rounds) {
      var attributes = data.attributes || {}
      var match = {
        id: data.id,
        state: attributes.state,
        winner: attributes.winner,
        numberOfRounds: attributes['number-of-rounds'],
        ranked: attributes.ranked,
        eloChange: attributes['elo-change'],
        createdAt: attributes['created-at'],
        rounds: []
      }

      var userTeam = attributes['away-user-id'] == this.userId ? 'away' : 'home'
      var opponentTeam = userTeam === 'away' ? 'home' : 'away'
      var userTeamIndex = userTeam === 'away' ? 1 : 0

      if (rounds && data.relationships && data.relationships.rounds) {
        var roundIds = (data.relationships.rounds.data || []).map(r => Number(r.id)).sort((a, b) => a - b)
        var roundIndex = 0
        match.rounds = rounds.filter(r => roundIds.includes(Number(r.id))).map(r => this.cleanRound(r, roundIndex++, userTeam, opponentTeam))
      }

      match.stateName = this.getStateName(match.state)
      match.opponent = attributes[`${opponentTeam}-team`][0]
      match.opponentTeam = opponentTeam
      match.user = attributes[`${userTeam}-team`][0]
      match.won = attributes.winner === userTeamIndex

      var startedAt = new Date(match.createdAt)
      match.date = this.$formatDate(startedAt)
      match.createdAtDistance = this.$formatDateDistance(startedAt)
      match.createdAtRelative = this.$formatDateRelative(startedAt)
      match.createdAtPretty = this.$formatDate(startedAt, 'MMM d yyyy hh:mm a')

      return match
    },
    getUserMatches(url) {
      return this.$axios.$get(url).then((res) => {
        // console.log('Fetched matches data', res)
        return {
          matches: res.data.map(d => this.cleanMatch(d, res.included)),
          links: res.links
        }
      }).catch((error) => {
        console.error('Error fetching user matches data', error)
        return null
      })
    },
    searchUser(term) {
      return this.$axios.$get(`https://www.elevenvr.club/accounts/search/${term}`).then((res) => {
        return res.data.map((user) => {
          return {
            ...user.attributes,
            id: user.id
          }
        })
      }).catch((error) => {
        console.error('Error searching user', error)
        return null
      })
    },
    getLeaderboard(start = 0) {
      return this.$axios.$get(`https://www.elevenvr.club/leaderboards?start=${start}`).then((res) => {
        return res.scores
      }).catch((error) => {
        console.error('Error searching user', error)
        return null
      })
    }
  }
}