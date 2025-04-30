<template>
  <div class="am-working-hours" ref="workingHours">

    <div class="am-dialog-table" v-for="(workDay, workDayIndex) in weekSchedule" :key="workDay.id">

      <el-row class="am-dialog-table-head hours">
        <el-col :span="12"><span>{{ workDay.day }}</span></el-col>
        <el-col :span="12" class="am-align-right">
          <span class="am-add-element" @click="applyToAllDays(workDay)" v-if="workDayIndex === 0">
            {{ $root.labels.apply_to_all_days }}
          </span>
          <div class="am-add-element" @click="showNewHoursForm(workDay)">
            <i class="el-icon-plus"></i>
          </div>
        </el-col>
      </el-row>

      <!-- Add Work Hours -->
      <transition name="fade">
        <div class="am-add-period" v-if="workDay.form.show">
          <el-form label-position="top" :model="workDay" ref="workDay">
            <el-row :gutter="10" v-if="workDay.form.isNew" class="am-add-period-type">
              <el-col>
                <el-radio v-model="workDay.form.type" label="Work">{{ $root.labels.work_hours }}</el-radio>
                <el-radio v-model="workDay.form.type" label="Break">{{ $root.labels.breaks }}</el-radio>
              </el-col>
            </el-row>

            <el-row v-if="workDay.form.type === 'Work'" :gutter="10" type="flex" style="flex-wrap: wrap">

              <!-- Working Hours -->
              <el-col :span="responsiveGrid.editHours.workHours">
                <el-row :gutter="10" type="flex" style="flex-wrap: wrap">
                  <el-col :span="24" style="margin-bottom: 4px">
                    <span>{{ $root.labels.work_hours }}</span>
                  </el-col>

                  <!-- Work Hours Start -->
                  <el-col :span="responsiveGrid.editHours.hour">
                    <el-form-item :rules="rules.startTime" :prop="'form.data.time.0'">
                      <el-time-select
                        v-model="workDay.form.data.time[0]"
                        :picker-options="getPeriodBorderTime(workDay.form.data.time[0], workDay.form.data.time[1], true)"
                        size="mini"
                        style="margin-bottom: 12px;"
                        :popper-class="'am-dropdown-cabinet'"
                        @change="startTimeChanged(workDay.form.data.time[0], workDay.form.data.time[1], getWorkingPeriodsInSeconds(workDay), function (value) {workDay.form.data.time[1] = value})"
                        @focus="startTimeChanged(workDay.form.data.time[0], workDay.form.data.time[1], getWorkingPeriodsInSeconds(workDay), function (value) {workDay.form.data.time[1] = value})"
                      >
                      </el-time-select>
                    </el-form-item>
                  </el-col>

                  <!-- Work Hours End -->
                  <el-col :span="responsiveGrid.editHours.hour">
                    <el-form-item :rules="rules.endTime" :prop="'form.data.time.1'">
                      <el-time-select
                        v-model="workDay.form.data.time[1]"
                        :picker-options="getPeriodBorderTime(workDay.form.data.time[0], workDay.form.data.time[1], false)"
                        size="mini"
                        style="margin-bottom: 12px;"
                        :popper-class="'am-dropdown-cabinet'"
                        :disabled="workDay.form.data.time[0] === null"
                      >
                      </el-time-select>
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-col>
              <!-- /Working Hours -->

              <!-- Services -->
              <el-col v-if="categorizedServiceList && servicesCount > 1" :span="responsiveGrid.editHours.services">
                <el-row :gutter="10" type="flex" style="flex-wrap: wrap">
                  <el-col :span="24" style="margin-bottom: 4px">
                    <span>{{ $root.labels.services.charAt(0).toUpperCase() + $root.labels.services.slice(1) }}</span>
                      <el-tooltip placement="top">
                        <div slot="content" v-html="$root.labels.period_services_filter1_tooltip"></div>
                        <i class="el-icon-question am-tooltip-icon"></i>
                      </el-tooltip>
                  </el-col>

                  <el-col :span="24">
                    <el-select
                      v-model="workDay.form.data.serviceIds"
                      multiple
                      filterable
                      :placeholder="$root.labels.period_services_filter"
                      :popper-class="'am-dropdown-cabinet'"
                      collapse-tags
                      size="mini"
                      class="am-select-service"
                    >
                      <div
                        v-if="category.serviceList.filter(service => service.state).length > 0"
                        v-for="category in categorizedServiceList"
                        :key="category.id"
                      >
                        <div
                          class="am-drop-parent"
                          @click="selectAllInCategory(workDay.form.data, category.id)"
                        >
                          <span>{{ category.name }}</span>
                        </div>
                        <el-option
                          v-if="service.state"
                          v-for="service in category.serviceList"
                          :key="service.id"
                          :label="service.name"
                          :value="service.id"
                          class="am-drop-child"
                        >
                        </el-option>
                      </div>
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
              <!-- /Services -->

              <!-- Locations -->
              <el-col v-if="locations && locations.length > 1" :span="responsiveGrid.editHours.location">
                <el-row :gutter="10" type="flex" style="flex-wrap: wrap">
                  <el-col :span="24" style="margin-bottom: 4px">
                    <span>{{ $root.labels.location }}</span>
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.period_location_filter1_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </el-col>

                  <el-col :span="24">
                    <el-select
                      v-model="workDay.form.data.locationIds"
                      multiple
                      class="am-select-service"
                      size="mini"
                      filterable
                      clearable
                      collapse-tags
                      :placeholder="$root.labels.location"
                      :popper-class="'am-dropdown-cabinet'"
                    >
                      <el-option
                        v-for="location in locations"
                        :key="location.id"
                        :label="location.name"
                        :value="location.id"
                      >
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
              <!-- /Location -->
            </el-row>

            <!-- Break -->
            <el-row v-else-if="workDay.form.type === 'Break'" :gutter="10">
              <el-col :span="24" style="margin-bottom: 4px">
                <span>{{ $root.labels.break_hours }}</span>
              </el-col>
              <p style="display: none;">{{ $root.labels.break_hours }}</p>

              <el-col :span="12">
                <el-form-item :rules="rules.startTime" :prop="'form.data.time.0'">
                  <el-time-select
                    v-model="workDay.form.data.time[0]"
                    :picker-options="getTimeSelectOptionsForBreaks(workDay.periods.length ? workDay.periods[0].time[0] : '00:00', workDay.periods.length ? workDay.periods[workDay.periods.length - 1].time[1] : '24:00', '', workDay.form.data.time[1])"
                    size="mini"
                    :popper-class="'am-dropdown-cabinet'"
                    style="margin-bottom: 14px;"
                  >
                  </el-time-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item :rules="rules.endTime" :prop="'form.data.time.1'">
                  <el-time-select
                    v-model="workDay.form.data.time[1]"
                    :picker-options="getTimeSelectOptionsForBreaks(workDay.periods.length ? workDay.periods[0].time[0] : '00:00', workDay.periods.length ? workDay.periods[workDay.periods.length - 1].time[1] : '24:00', workDay.form.data.time[0], '')"
                    size="mini"
                    :popper-class="'am-dropdown-cabinet'"
                    style="margin-bottom: 14px;"
                  >
                  </el-time-select>
                </el-form-item>
              </el-col>
            </el-row>

            <div class="am-working-hours-buttons">
              <div class="align-left">
                <el-button size="small" @click="hideHoursForm(workDay)">
                  {{ $root.labels.cancel }}
                </el-button>
                <el-button size="small" type="primary" @click="saveHoursForm(workDay)">
                  {{ $root.labels.save }}
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
      </transition>

      <!-- Periods -->
      <transition-group name="fade" tag="div">
        <div class="am-period" v-for="(hoursData, indexHours) in getDayHours(workDay)" :key="indexHours + 1">
          <el-row :gutter="10" type="flex">

            <!-- Hours -->
            <el-col :span="responsiveGrid.periods.hours" class="am-period__services">
              <span class="am-overflow-ellipsis">
                <span :class="{'am-period-break': hoursData.type === 'Break'}">{{ hoursData.data.time[0] }} - {{ hoursData.data.time[1] }}</span>
              </span>
            </el-col>
            <!-- /Hours -->

            <!-- Services -->
            <el-col :span="responsiveGrid.periods.services" class="am-flexed2 am-period__services">
                <span
                  class="am-overflow-ellipsis"
                  v-if="hoursData.type === 'Work' && hoursData.data.serviceIds.length > 0"
                >
                  <span
                    :ref="'serviceName-' + workDayIndex + '-' + indexHours"
                    :title="getServicesNames(hoursData.data.serviceIds).join(', ')"
                  >
                    {{ getServicesNames(hoursData.data.serviceIds).join(', ') }}
                  </span>
              </span>
            </el-col>
            <!-- /Services -->

            <!-- Location -->
            <el-col :span="responsiveGrid.periods.locations" class="am-flexed2 am-period__locations">
              <span
                  v-if="hoursData.type === 'Work' && getPeriodLocationsIds(hoursData.data).length > 0"
                  :title="getLocationsNames(getPeriodLocationsIds(hoursData.data)).join(', ')" class="am-overflow-ellipsis"
              >
                {{ getLocationsNames(getPeriodLocationsIds(hoursData.data)).join(', ') }}
              </span>
            </el-col>
            <!-- /Location -->

            <!-- Edit Hours -->
            <el-col style="margin: auto" :span="responsiveGrid.periods.edit" :class="{'mobile': responsiveGrid.periods.edit === 24}" class="am-flexed2 am-period__services">
              <div class="am-edit-element" @click="editHours(workDay, hoursData.type, hoursData.index)">
                <img :src="$root.getUrl + 'public/img/edit-pen.svg'">
              </div>

              <!-- Delete Hours -->
              <div class="am-delete-element" @click="deleteHours(workDay, hoursData.type, hoursData.index)">
                <img :src="$root.getUrl + 'public/img/delete.svg'">
              </div>
            </el-col>

          </el-row>
        </div>

      </transition-group>

    </div>

  </div>
</template>

<script>
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import periodMixin from '../../../js/backend/mixins/periodMixin'

  export default {

    mixins: [periodMixin, imageMixin, dateMixin, durationMixin],

    props: {
      activeTab: '',
      weekSchedule: null,
      categorizedServiceList: null,
      locations: null
    },

    data () {
      return {
        rules: {
          startTime: [
            {
              required: true, message: this.$root.labels.select_time_warning, trigger: 'submit'
            }
          ],
          endTime: [
            {
              required: true, message: this.$root.labels.select_time_warning, trigger: 'submit'
            }
          ]
        },
        responsiveGrid: {
          editHours: {
            workHours: 24,
            hour: 24,
            services: 24,
            location: 24
          },
          periods: {
            hours: !this.categorizedServiceList ? 6 : 4,
            services: !this.categorizedServiceList ? 10 : 12,
            locations: 5,
            edit: 3
          }
        }
      }
    },

    methods: {
      getWorkingPeriodsInSeconds (workDay) {
        let workPeriods = this.getDayHours(workDay).filter(period => period.type === 'Work').map(period => period.data).map(periodData => periodData.time)

        let periodsInSeconds = []

        let $this = this

        workPeriods.forEach(function (period) {
          if (!(workDay.form.data.time[0] === period[0] && workDay.form.data.time[1] === period[1])) {
            periodsInSeconds.push([$this.getStringTimeInSeconds(period[0]), $this.getStringTimeInSeconds(period[1])])
          }
        })

        return periodsInSeconds
      },

      getDayHours (day) {
        let hours = []

        day.periods.forEach(function (dayPeriod, index) {
          hours.push({
            index: index,
            type: 'Work',
            data: dayPeriod
          })
        })

        day.breaks.forEach(function (dayBreak, index) {
          hours.push({
            index: index,
            type: 'Break',
            data: dayBreak
          })
        })

        return hours.sort((a, b) => this.$moment('2000-01-01 ' + a.data.time[0] + ':00', 'YYYY-MM-DD HH:mm:ss').diff(this.$moment('2000-01-01 ' + b.data.time[0] + ':00', 'YYYY-MM-DD HH:mm:ss')))
      },

      getServicesNames (serviceIds) {
        let services = []

        if (this.categorizedServiceList) {
          this.categorizedServiceList.forEach(function (category) {
            category.serviceList.forEach(function (service) {
              if (serviceIds.indexOf(service.id) !== -1) {
                services.push(service.name)
              }
            })
          })
        }

        return services
      },

      selectAllInCategory (period, id) {
        let servicesIds = this.categorizedServiceList.find(category => category.id === id).serviceList.filter(service => service.state).map(service => service.id)

        // Deselect all services if they are already selected
        if (_.isEqual(_.intersection(servicesIds, period.serviceIds), servicesIds)) {
          period.serviceIds = _.difference(period.serviceIds, servicesIds)
        } else {
          period.serviceIds = _.uniq(period.serviceIds.concat(servicesIds))
        }
      },

      getTimeSelectOptionsForBreaks: function (minTimeWorkingHour, maxTimeWorkingHour, minTimeBreak, maxTimeBreak) {
        return {
          start: '00:00',
          end: '24:00',
          step: this.secondsToTimeSelectStep(this.getTimeSlotLength()),
          minTime: minTimeBreak || minTimeWorkingHour,
          maxTime: maxTimeBreak || maxTimeWorkingHour
        }
      },

      editHours (day, type, index) {
        let $this = this

        switch (type) {
          case ('Work'):
            day.form.show = false

            setTimeout(function () {
              day.form = {
                data: day.periods[index],
                oldData: JSON.parse(JSON.stringify(day.periods[index])),
                isNew: false,
                type: 'Work',
                show: true,
                index: index
              }

              $this.findFreePeriods($this.getWorkingPeriodsInSeconds(day))
            }, 200)

            break

          case ('Break'):
            day.form.show = false

            setTimeout(function () {
              day.form = {
                data: day.breaks[index],
                oldData: JSON.parse(JSON.stringify(day.breaks[index])),
                isNew: false,
                type: 'Break',
                show: true,
                index: index
              }
            }, 200)

            break
        }
      },

      deleteHours (day, type, index) {
        switch (type) {
          case ('Work'):
            day.periods.splice(index, 1)

            break

          case ('Break'):
            day.breaks.splice(index, 1)

            break
        }
      },

      showNewHoursForm (day) {
        day.form = {
          data: {
            time: day.form.type === 'Work' ? [day.periods.length ? (day.periods[day.periods.length - 1].time[1]) : '', ''] : ['', ''],
            id: null,
            locationId: null,
            locationIds: [],
            serviceIds: [],
            periodLocationList: [],
            periodServiceList: []
          },
          isNew: true,
          type: 'Work',
          show: true,
          index: null
        }

        this.findFreePeriods(this.getWorkingPeriodsInSeconds(day))
      },

      hideHoursForm (day) {
        day.form.show = false

        switch (day.form.type) {
          case ('Work'):
            if (!day.form.isNew) {
              day.periods[day.form.index] = day.form.oldData
            }

            break

          case ('Break'):
            if (!day.form.isNew) {
              day.breaks[day.form.index] = day.form.oldData
            }

            break
        }
      },

      saveHoursForm (day) {
        this.$refs.workDay[0].validate((valid) => {
          if (valid) {
            switch (day.form.type) {
              case ('Work'):
                if (day.form.isNew) {
                  day.periods.push({
                    id: null,
                    time: day.form.data.time,
                    locationIds: day.form.data.locationIds,
                    serviceIds: day.form.data.serviceIds,
                    locationId: day.form.data.locationId,
                    periodLocationList: day.form.data.periodLocationList,
                    periodServiceList: day.form.data.periodServiceList
                  })
                } else {
                  day.periods[day.form.index] = day.form.data
                }

                break

              case ('Break'):
                if (day.form.isNew) {
                  day.breaks.push({
                    id: null,
                    time: day.form.data.time
                  })
                } else {
                  day.breaks[day.form.index] = day.form.data
                }

                break
            }

            day.form.show = false
          } else {
            return false
          }
        })
      },

      applyToAllDays (selectedWorkDay) {
        let periods = JSON.parse(JSON.stringify(selectedWorkDay.periods))

        periods.forEach(function (period) {
          period.id = null

          period.periodLocationList = []

          period.periodServiceList = []

          period.savedPeriodServiceList = []
        })

        let breaks = JSON.parse(JSON.stringify(selectedWorkDay.breaks))

        breaks.forEach(function (dayBreak) {
          dayBreak.id = null
        })

        this.weekSchedule.forEach(function (weekDay) {
          weekDay.id = null
          weekDay.periods = JSON.parse(JSON.stringify(periods))
          weekDay.breaks = JSON.parse(JSON.stringify(breaks))

          weekDay.time = JSON.parse(JSON.stringify(selectedWorkDay.time))
        })
      },

      getPeriodLocationsIds (data) {
        return data.locationIds.length ? data.locationIds : (data.locationId ? [data.locationId] : [])
      },

      getLocationsNames (locationIds) {
        let locations = []

        locationIds.forEach((locationId) => {
          let location = this.locations.find(location => location.id === locationId)

          if (location) {
            locations.push(location.name)
          }
        })

        return locations
      },

      getColumnLength (size = '') {
        if (this.categorizedServiceList && this.servicesCount > 1 && this.locations && this.locations.length > 1) {
          if (size === 'mini') {
            return {
              workHours: 24,
              hour: 24,
              services: 24,
              location: 24
            }
          }

          if (size === 'mobile') {
            return {
              workHours: 24,
              hour: 12,
              services: 24,
              location: 24
            }
          }

          return {
            workHours: 8,
            hour: 12,
            services: 8,
            location: 8
          }
        } else if (this.categorizedServiceList && this.servicesCount > 1) {
          if (size === 'mini') {
            return {
              workHours: 24,
              hour: 24,
              services: 24,
              location: 0
            }
          }

          if (size === 'mobile') {
            return {
              workHours: 24,
              hour: 12,
              services: 24,
              location: 0
            }
          }

          return {
            workHours: 10,
            hour: 12,
            services: 14,
            location: 0
          }
        } else if (this.locations && this.locations.length > 1) {
          if (size === 'mini') {
            return {
              workHours: 24,
              hour: 24,
              services: 0,
              location: 24
            }
          }

          if (size === 'mobile') {
            return {
              workHours: 24,
              hour: 12,
              services: 0,
              location: 24
            }
          }

          return {
            workHours: 10,
            hour: 12,
            services: 0,
            location: 14
          }
        } else {
          if (size === 'mini') {
            return {
              workHours: 24,
              hour: 24,
              services: 0,
              location: 0
            }
          }

          if (size === 'mobile') {
            return {
              workHours: 24,
              hour: 12,
              services: 0,
              location: 0
            }
          }

          return {
            workHours: 24,
            hour: 12,
            services: 0,
            location: 0
          }
        }
      },

      handleResize () {
        if (this.activeTab === 'workingHours' || this.activeTab === 'hours') {
          let amContainer = this.$refs.workingHours

          if (typeof amContainer !== 'undefined' && amContainer.offsetWidth < 320) {
            this.responsiveGrid.periods = {
              hours: 24,
              services: 24,
              locations: 24,
              edit: 24
            }
            this.responsiveGrid.editHours = this.getColumnLength('mini')
          } else if (typeof amContainer !== 'undefined' && amContainer.offsetWidth < 650) {
            this.responsiveGrid.periods = {
              hours: 24,
              services: 24,
              locations: 24,
              edit: 24
            }
            this.responsiveGrid.editHours = this.getColumnLength('mobile')
          } else {
            this.responsiveGrid.periods = {
              hours: !this.categorizedServiceList ? 6 : 4,
              services: !this.categorizedServiceList ? 10 : 12,
              locations: 5,
              edit: 3
            }
            this.responsiveGrid.editHours = this.getColumnLength()
          }
        }
      }
    },

    created () {
      window.addEventListener('resize', this.handleResize)
    },

    computed: {
      servicesCount () {
        let servicesCount = 0

        this.categorizedServiceList.forEach(function (category) {
          servicesCount += category.serviceList.length
        })

        return servicesCount
      }
    },

    watch: {
      'activeTab' () {
        if (this.activeTab === 'workingHours' || this.activeTab === 'hours') {
          this.handleResize()
        }
      }
    }
  }
</script>
