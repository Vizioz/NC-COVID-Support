<template>
  <div class="openhours" v-if="days.length > 0">
    <div class="oh-title">
      <b>{{ title }}</b>
    </div>
    <table>
      <tr v-for="(item, index) in days" :key="index">
        <!-- <i class="fas" :class="icon" /> -->
        <td class="oh-name">{{ item.name }}</td>
        <td :class="item.class"><span v-html="item.val"></span></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'OpeningHours',
  data() {
    return {}
  },
  props: {
    title: { type: String },
    infotype: { type: String },
    icon: { type: String },
    openHours: { type: Array },
    description: { type: String }
  },
  computed: {
    days() {
      var myDays = []

      if (!this.openHours) {
        return myDays
      }

      this.openHours.forEach((openHour) => {
        let dayName = openHour.day
        let hours = []
        openHour.hours.forEach((hour) => {
          hours.push(this.getHoursVal(hour))
        })

        myDays.push({ name: dayName, val: hours.join('</br>') })
      })

      return myDays
    }
  },
  methods: {
    getHoursVal(val) {
      return this.getHoursRangeVal(val.startTime) + ' - ' + this.getHoursRangeVal(val.endTime)
    },
    getHoursRangeVal(val) {
      if (!val) {
        return ''
      }

      let hours = parseInt(val.split(':')[0])
      let minutes = parseInt(val.split(':')[1])
      let t

      if (isNaN(hours)) {
        return ''
      }

      if (hours === 0) {
        hours = 12
        t = 'AM'
      } else if (hours > 0 && hours < 12) {
        t = 'AM'
      } else if (hours === 12) {
        t = 'PM'
      } else {
        hours = hours - 12
        t = 'PM'
      }

      minutes = !isNaN(minutes) && minutes > 0 ? ':' + minutes : ''

      return hours + minutes + ' ' + t
    }
  }
}
</script>

<style lang="scss">
.openhours {
  margin-bottom: 10px;
}

.oh-name {
  padding-right: 20px;
  vertical-align: top;
}

.closed {
  color: theme-color('danger');

  @media (prefers-color-scheme: dark) {
    color: theme-color-level('danger', 2);
  }
}
</style>
