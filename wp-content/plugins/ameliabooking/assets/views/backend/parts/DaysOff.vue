<template>
  <div class="am-days-off">

    <div class="am-dialog-table">
      <el-row :gutter="20" type="flex" align="middle" style="flex-wrap: wrap">
        <el-col class="am-days-off__header">

          <!-- Year Picker -->
          <el-date-picker
            v-model="filterDate"
            type="year"
            :clearable="false"
            :placeholder="$root.labels.pick_a_year"
            @change="filterDaysOff"
          />
          <!-- /Year Picker -->

          <!-- Legend -->
          <div class="am-days-off__legend">
            <div class="am-legend-repeat"><span class="type repeat"></span>{{ $root.labels.repeat_every_year }}</div>
            <div class="am-legend-once"><span class="type once"></span>{{ $root.labels.once_off }}</div>
          </div>
          <!-- /Legend -->

        </el-col>
      </el-row>
    </div>

    <!-- Employees Days Off -->
    <div class="am-employee-days-off">

      <!-- Days Off Table -->
      <div class="am-dialog-table">

        <!-- Days Off Title -->
        <h4 v-if="listedDaysOff.length > 0">{{ $root.labels.employee_days_off }}</h4>
        <!-- /Days Off Title -->

        <!-- Days Off Table Header -->
        <el-row :gutter="20" class="am-dialog-table-head days">
          <el-col :span="12"><span>{{ $root.labels.date }}</span></el-col>
          <el-col :span="12"><span>{{ $root.labels.day_off_name }}</span></el-col>
        </el-row>
        <!-- /Days Off Table Header -->

        <!-- Day Off Row -->
        <el-row
          v-for="(dayOff, index) in yearDaysOff" :key="index"
          :gutter="20" type="flex" align="middle" class="am-day-off"
          style="flex-wrap: wrap"
        >

          <!-- Day Off Type and Date -->
          <el-col :xs="12" :sm="12" :md="12">
            <span class="type" :class="{ 'repeat': dayOff.repeat, 'once': !dayOff.repeat }"></span>
            <el-tooltip
              effect="dark"
              :content="dayOff.startDate === dayOff.endDate ? getFrontedFormattedDate (dayOff.startDate) :
              getFrontedFormattedDate(dayOff.startDate) + ' - ' + getFrontedFormattedDate(dayOff.endDate)"
              placement="top-start"
            >
              <span>
                {{ dayOff.startDate === dayOff.endDate ? getFrontedFormattedDate (dayOff.startDate) :
                getFrontedFormattedDate(dayOff.startDate) + ' - ' + getFrontedFormattedDate(dayOff.endDate) }}
              </span>
            </el-tooltip>
          </el-col>
          <!-- /Day Off Type and Date -->

          <!-- Day Off Name -->
          <el-col :xs="12" :sm="12" :md="8" class="am-day-off__name-column">
            <span :title="dayOff.name">{{ dayOff.name }}</span>
          </el-col>
          <!-- /Day Off Name -->

          <!-- Day Off Edit and Delete -->
          <el-col :xs="24" :sm="24" :md="4" class="align-right">
            <div class="am-edit-element" @click="editDayOff(dayOff)">
              <img :src="$root.getUrl + 'public/img/edit-pen.svg'">
            </div>
            <div class="am-delete-element" @click="deleteDayOff(dayOff)">
              <i class="el-icon-minus"></i>
            </div>
          </el-col>
          <!-- /Day Off Edit and Delete -->

        </el-row>
        <!-- /Day Off Row -->

        <!-- Add Day Off button -->
        <el-row>
          <el-col>
            <div class="am-add-element" @click="addDayOff">
              <i class="el-icon-plus"></i><span class="am-add-day-off">{{ $root.labels.add_day_off }}</span>
            </div>
          </el-col>
        </el-row>
        <!-- /Add Day Off button -->

      </div>
      <!-- /Days Off Table -->

      <!-- Days Off Form -->
      <transition name="fade">
        <div class="am-day-off-add" v-show="showDayOffForm">

          <!-- Days Off Name -->
          <el-form :model="model" ref="model" :rules="rules" label-position="top" @submit.prevent="saveDayOff">
            <el-form-item :label="$root.labels.day_off_name + ':'" prop="dayOffName">
              <el-input
                v-model="model.dayOffName" auto-complete="off"
                :placeholder="$root.labels.add_day_off_placeholder"
              >
              </el-input>
            </el-form-item>

            <!-- Days Off Date -->
            <el-row :gutter="20">
              <el-col :sm="24" class="v-calendar-column">
                <el-form-item :label="$root.labels.date + ':'" prop="dayOffDates">
                  <v-date-picker
                    v-model="model.dayOffDates"
                    mode='range'
                    input-class="el-input__inner"
                    popover-visibility="focus"
                    popover-direction="top"
                    :popover-align="screenWidth < 768 ? 'center' : 'left'"
                    :is-required=true
                    :is-expanded=false
                    :show-day-popover=false
                    :tint-color='isCabinet ? $root.settings.customization.primaryColor : "#1A84EE"'
                    :input-props='{class: "el-input__inner", readOnly: "readonly"}'
                    :placeholder="$root.labels.pick_a_date_or_range"
                    :formats="vCalendarFormats"
                  >
                  </v-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- Days Off Controls -->
            <el-row :gutter="20">

              <!-- Days Off Repeat -->
              <el-col :sm="12">
                <el-checkbox v-model="model.dayOffRepeat" class="am-semi-strong">
                  {{ $root.labels.days_off_repeat_yearly }}
                </el-checkbox>
              </el-col>

              <!-- Days Off Buttons -->
              <el-col :sm="12" class="align-right am-day-off-add-buttons">
                <el-button size="small" @click="showDayOffForm = !showDayOffForm">{{ $root.labels.cancel }}</el-button>
                <el-button size="small" type="primary" @click="saveDayOff" class="am-dialog-create">
                  {{ $root.labels.days_off_add }}
                </el-button>
              </el-col>
              <!-- /Days Off Buttons -->

            </el-row>
          </el-form>
        </div>
      </transition>
    </div>

    <!-- Company Days Off -->
    <div class="am-company-days-off" v-if="listedDaysOff.length > 0">

      <!-- Listed Days Off Table -->
      <div class="am-dialog-table">

        <!-- Listed Days Off Table Header -->
        <h4>{{ $root.labels.company_days_off }}</h4>
        <el-row :gutter="20" class="am-dialog-table-head days">
          <el-col :span="12"><span>{{ $root.labels.date }}</span></el-col>
          <el-col :span="12"><span>{{ $root.labels.day_off_name }}</span></el-col>
        </el-row>

        <!-- Listed Day Off Row -->
        <el-row
          v-for="(dayOff, index) in yearListedDaysOff" :key="index"
          :gutter="20" type="flex" align="middle" class="am-day-off"
        >

          <!-- Listed Day Off Type and Date -->
          <el-col :span="12">
            <span class="type" :class="{ 'repeat': dayOff.repeat, 'once': !dayOff.repeat }"></span>
            <span>
              {{ dayOff.startDate === dayOff.endDate ? getFrontedFormattedDate (dayOff.startDate) :
              getFrontedFormattedDate(dayOff.startDate) + ' - ' + getFrontedFormattedDate(dayOff.endDate) }}
            </span>
          </el-col>

          <!-- Listed Day Off Name -->
          <el-col :span="8">
            <span>{{ dayOff.name }}</span>
          </el-col>

        </el-row>

        <!-- Edit Company Days Off -->
        <el-row v-if="allowEditCompanyDaysOff">
          <el-col :span="24">
            <div class="am-add-element" @click="editCompanyDaysOffSettings">{{ $root.labels.edit_company_days_off }}
            </div>
          </el-col>
        </el-row>

      </div>

    </div>

  </div>
</template>

<script>
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import windowMixin from '../../../js/backend/mixins/windowMixin'

  export default {
    mixins: [
      imageMixin,
      dateMixin,
      windowMixin
    ],

    props: {
      daysOff: {
        type: Array
      },
      listedDaysOff: {
        default: () => [],
        type: Array
      },
      allowEditCompanyDaysOff: {
        type: Boolean,
        default: true,
        required: false
      },
      isCabinet: {
        type: Boolean,
        default: false,
        required: false
      }
    },

    data () {
      return {
        editedDayOffIndex: -1,
        filterDate: this.$moment(),
        model: {
          dayOffDates: null,
          dayOffId: 0,
          dayOffName: '',
          dayOffRepeat: 0
        },
        rules: {
          dayOffName: [
            {required: true, message: this.$root.labels.days_off_name_warning, trigger: 'submit'}
          ],
          dayOffDates: [
            {required: true, message: this.$root.labels.days_off_date_warning, trigger: 'submit'}
          ]
        },
        settings: this.daysOff.slice(0),
        showDayOffForm: false,
        yearDaysOff: [],
        yearListedDaysOff: []
      }
    },

    mounted () {
      this.filterDaysOff()
    },

    methods: {
      editDayOff (dayOff) {
        this.model.dayOffId = dayOff.hasOwnProperty('id') ? dayOff.id : 0
        this.model.dayOffName = dayOff.name
        this.model.dayOffDates = {
          start: this.$moment(dayOff.startDate, 'YYYY-MM-DD').toDate(),
          end: this.$moment(dayOff.endDate, 'YYYY-MM-DD').toDate()
        }
        this.model.dayOffRepeat = dayOff.repeat
        this.showDayOffForm = true
        this.editedDayOffIndex = this.settings.indexOf(dayOff)
      },

      addDayOff () {
        this.editedDayOffIndex = -1
        this.model.dayOffId = 0
        this.model.dayOffName = ''
        this.model.dayOffRepeat = 0
        this.model.dayOffDates = null
        this.showDayOffForm = true
      },

      saveDayOff () {
        this.$refs.model.validate((valid) => {
          if (valid) {
            if (this.editedDayOffIndex !== -1) {
              this.settings.splice(this.editedDayOffIndex, 1, this.dayOff)
            } else {
              this.settings.push(this.dayOff)
            }
            // Clear validation on inputs
            this.$refs.model.clearValidate()
            this.showDayOffForm = false

            this.filterDate = this.$moment(this.dayOff.startDate, 'YYYY-MM-DD').toDate()

            this.filterDaysOff()
            this.$emit('changeDaysOff', this.settings)
          } else {
            return false
          }
        })
      },

      deleteDayOff (dayOff) {
        let index = this.settings.indexOf(dayOff)
        this.settings.splice(index, 1)
        this.filterDaysOff()

        this.$emit('changeDaysOff', this.settings)
      },

      filter (list) {
        let $that = this
        let filteredByYear = list.filter(dayOff => $that.$moment(dayOff.startDate, 'YYYY-MM-DD').year() === $that.filterYear && !dayOff.repeat)
        let filteredByRepeat = list.filter(dayOff => dayOff.repeat)

        filteredByRepeat.forEach(function (dayOff, index) {
          if ($that.$moment(dayOff.startDate, 'YYYY-MM-DD').year() === $that.$moment(dayOff.endDate, 'YYYY-MM-DD').year()) { filteredByRepeat[index].endDate = $that.$moment(dayOff.endDate, 'YYYY-MM-DD').year($that.filterYear).format('YYYY-MM-DD') } else { filteredByRepeat[index].endDate = $that.$moment(dayOff.endDate, 'YYYY-MM-DD').year($that.filterYear + 1).format('YYYY-MM-DD') }
          filteredByRepeat[index].startDate = $that.$moment(dayOff.startDate, 'YYYY-MM-DD').year($that.filterYear).format('YYYY-MM-DD')
        })

        let filtered = filteredByRepeat.concat(filteredByYear)
        return filtered.sort((a, b) => $that.$moment(a.startDate).diff(b.startDate))
      },

      editCompanyDaysOffSettings () {
        this.$emit('showCompanyDaysOffSettingsDialog')
      },

      filterDaysOff () {
        this.yearDaysOff = this.filter(this.settings)
        this.yearListedDaysOff = this.filter(this.listedDaysOff)
      }
    },

    computed: {
      filterYear () {
        return this.$moment(this.filterDate, 'YYYY-MM-DD').year()
      },

      dayOff () {
        return {
          id: this.model.dayOffId,
          name: this.model.dayOffName,
          startDate: this.$moment(this.model.dayOffDates.start).format('YYYY-MM-DD'),
          endDate: this.$moment(this.model.dayOffDates.end).format('YYYY-MM-DD'),
          repeat: this.model.dayOffRepeat
        }
      }
    },

    watch: {
      settings () {
        this.yearDaysOff = this.filter(this.settings)
      },

      listedDaysOff () {
        this.yearListedDaysOff = this.filter(this.listedDaysOff)
      }
    }
  }
</script>
