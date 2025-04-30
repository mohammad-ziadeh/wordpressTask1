<template>
  <div>

    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="20">
            <h2 v-if="showWorkingHoursOnly">
              {{ $root.labels.company_work_hours_settings }}
            </h2>
            <h2 v-else-if="showDaysOffOnly">
              {{ $root.labels.company_days_off_settings }}
            </h2>
            <h2 v-else="showWorkingHoursOnly">
              {{ $root.labels.work_hours_days_off_settings }}
            </h2>
          </el-col>
          <el-col :span="4" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form label-position="top" @submit.prevent="onSubmit">

        <!-- Working Hours & Days Off In Tabs -->
        <el-tabs v-if="showTabs" v-model="activeTab">
          <el-tab-pane :label="$root.labels.work_hours" name="hours">
            <!-- Working Hours -->
            <working-hours :weekSchedule="weekScheduleSettings"></working-hours>
          </el-tab-pane>
          <el-tab-pane :label="$root.labels.days_off" name="off">
            <!-- Days Off -->
            <days-off @changeDaysOff="changeDaysOff" :daysOff="dayOffSettings"></days-off>
          </el-tab-pane>
        </el-tabs>

        <!-- Working Hours -->
        <working-hours v-if="showWorkingHoursOnly" :weekSchedule="weekScheduleSettings" :categorizedServiceList="[]" :locations="[]"></working-hours>

        <!-- Days Off -->
        <days-off v-if="showDaysOffOnly" @changeDaysOff="changeDaysOff" :daysOff="dayOffSettings"></days-off>

      </el-form>
    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button type="" @click="closeDialog" class="">{{ $root.labels.cancel }}</el-button>
            <el-button type="primary" @click="onSubmit" class="am-dialog-create">{{ $root.labels.save }}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
  import DaysOff from '../parts/DaysOff.vue'
  import WorkingHours from '../parts/WorkingHours.vue'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import durationMixin from '../../../js/common/mixins/durationMixin'

  export default {

    mixins: [imageMixin, dateMixin, durationMixin],

    props: {
      weekSchedule: {
        type: Array
      },
      daysOff: {
        type: Array
      },
      showWorkingHours: {
        default: true,
        type: Boolean
      },
      showDaysOff: {
        default: true,
        type: Boolean
      }
    },

    data () {
      return {
        dayOffSettings: this.daysOff.slice(0),
        weekScheduleSettings: this.weekSchedule ? this.weekSchedule.slice(0) : [],
        activeTab: 'hours'
      }
    },

    mounted () {
      if (this.showWorkingHours) {
        this.translateDayStrings()
      }

      this.inlineSVG()
    },

    methods: {
      closeDialog () {
        this.$emit('closeDialogSettingsWorkHoursDaysOff')
      },

      onSubmit () {
        let weekDaySchedule = []
        let $this = this

        this.weekScheduleSettings.forEach(function (weekDay) {
          let weekDayPeriods = []
          let weekDayBreaks = []

          let minStartTime = 86400
          let maxEndTime = 0

          weekDay.breaks.forEach(function (weekDayBreak) {
            if (weekDayBreak.time.length && weekDayBreak.time[0] && weekDayBreak.time[1]) {
              weekDayBreaks.push({
                time: [
                  weekDayBreak.time[0],
                  weekDayBreak.time[1]
                ]
              })
            }
          })

          if (('periods' in weekDay) && weekDay.periods.length) {
            weekDay.periods.forEach(function (weekDayPeriod) {
              let periodStartTime = $this.getStringTimeInSeconds(weekDayPeriod.time[0])
              let periodEndTime = $this.getStringTimeInSeconds(weekDayPeriod.time[1])

              minStartTime = periodStartTime < minStartTime ? periodStartTime : minStartTime
              maxEndTime = periodEndTime > maxEndTime ? periodEndTime : maxEndTime

              if (weekDayPeriod.time.length && weekDayPeriod.time[0] && weekDayPeriod.time[1]) {
                weekDayPeriods.push({
                  time: [
                    weekDayPeriod.time[0],
                    weekDayPeriod.time[1]
                  ]
                })
              }
            })
          }

          weekDaySchedule.push({
            day: weekDay.day,
            time: [
              weekDayPeriods.length ? $this.secondsToTimeSelectStep(minStartTime) : null,
              weekDayPeriods.length ? $this.secondsToTimeSelectStep(maxEndTime) : null
            ],
            periods: weekDayPeriods,
            breaks: weekDayBreaks
          })
        })

        this.$emit('closeDialogSettingsWorkHoursDaysOff')
        this.$emit('updateSettings', {
          daysOff: this.dayOffSettings,
          weekSchedule: weekDaySchedule
        })
      },

      changeDaysOff (data) {
        data.forEach(function (v) { delete v.id })

        this.dayOffSettings = data
      },

      translateDayStrings () {
        let translations = [
          'weekday_monday',
          'weekday_tuesday',
          'weekday_wednesday',
          'weekday_thursday',
          'weekday_friday',
          'weekday_saturday',
          'weekday_sunday'
        ]

        for (let i = 0; i < this.weekSchedule.length; i++) {
          let day = translations[i]
          this.weekSchedule[i].day = this.$root.labels[day]
        }
      }
    },

    computed: {
      showTabs () {
        return this.showWorkingHours && this.showDaysOff
      },

      showWorkingHoursOnly () {
        return this.showWorkingHours && !this.showDaysOff
      },

      showDaysOffOnly () {
        return !this.showWorkingHours && this.showDaysOff
      }
    },

    components: {
      DaysOff,
      WorkingHours
    }

  }
</script>