<template>

  <!-- Employees Special Days -->
  <div class="am-employee-special-days" ref="specialDays">

    <!-- Special Days List -->
    <div class="am-dialog-table">

      <!-- Special Days Header -->
      <el-row :gutter="20" class="am-dialog-table-head days">
        <el-col :span="24">
          <span>
            {{ $root.labels.special_days }}
          </span>
        </el-col>
      </el-row>
      <!-- /Special Days Header -->

      <!-- Special Days Row -->
      <div
        class="am-special-day"
        v-for="(specialDay, index) in specialDays" :key="index + 1"
      >
        <el-row>
          <!-- Special Day Date, Time, Services -->
          <el-col :span="20">
            <!-- Special Day Date -->
            <div class="am-special-day-data">
              <span class="am-strong">
                {{ `${$root.labels.date}: ` }}
              </span>
              <span>
                {{ `${getFrontedFormattedDate(specialDay.startDate)} - ${getFrontedFormattedDate(specialDay.endDate)}` }}
              </span>
            </div>
            <!-- /Special Day Date -->

            <!-- Special Day Time -->
            <div class="am-special-day-data">
              <span class="am-strong">{{ $root.labels.work_hours }}: </span>
              <span v-for="(specialDayPeriod, index) in specialDay.periodList" :key="index + 1">
                ({{ getFrontedFormattedTime(specialDayPeriod.startTime) }} - {{ getFrontedFormattedTime(specialDayPeriod.endTime) }})
                {{ (index !== specialDayPeriod.length - 1 && specialDayPeriod.length > 1) ? '; ' : '' }}
              </span>
            </div>
            <!-- /Special Day Time -->

            <!-- Special Day Services -->
            <div class="am-special-day-data">
              <span class="am-strong">{{ $root.labels.special_days_reflect_services }}: </span>
              <span class="am-special-day-services">
                <span class="am-special-day-service">
                  {{ getSpecialDayServices(specialDay) }}
                </span>
              </span>
            </div>
            <!-- /Special Day Services -->

          </el-col>
          <!-- /Special Day Date, Time, Services -->

          <!-- Special Day Edit and Delete -->
          <el-col :span="4" class="align-right">
            <div class="am-copy-element" @click="cloneSpecialDay(index)">
              <img :src="$root.getUrl + 'public/img/copy.svg'">
            </div>
            <div class="am-edit-element" @click="editSpecialDay(index)">
              <img :src="$root.getUrl + 'public/img/edit-pen.svg'">
            </div>
            <div class="am-delete-element" @click="deleteSpecialDay(index)">
              <img :src="$root.getUrl + 'public/img/delete.svg'">
            </div>
          </el-col>
          <!-- /Special Day Edit and Delete -->

        </el-row>
      </div>
      <!-- /Special Days Row -->

      <!-- Add Special Day button -->
      <el-row>
        <el-col>
          <div class="am-add-element" @click="addSpecialDay">
            <i class="el-icon-plus"></i>
            <span>
            {{ $root.labels.add_special_day }}
            </span>
          </div>
        </el-col>
      </el-row>
      <!-- /Add Special Day button -->

    </div>
    <!-- /Special Days List -->

    <!-- Special Day Form -->
    <transition name="fade">
      <div class="am-special-day-add" v-show="showSpecialDayForm">
        <el-form :model="specialDayModel" ref="specialDayModel" label-position="top" @submit.prevent="" id="specialDay">

          <!-- Special Day Date -->
          <el-row :gutter="20">
            <el-col :sm="24" style="overflow: visible;" class="v-calendar-column">
              <el-form-item :label="$root.labels.date + ':'" prop="dateRange" :rules="rules.dateRange">
                <v-date-picker
                  v-model="specialDayModel.dateRange"
                  mode='range'
                  popover-visibility="focus"
                  popover-direction="bottom"
                  input-class="el-input__inner"
                  style="margin-bottom: 20px;"
                  :is-required=true
                  :is-expanded=false
                  :show-day-popover=false
                  :tint-color='isCabinet ? $root.settings.customization.primaryColor : "#1A84EE"'
                  :input-props='{class: "el-input__inner", readOnly: "readonly"}'
                  :popover-align="screenWidth < 768 ? 'center' : 'left'"
                  :placeholder="$root.labels.pick_a_date_or_range"
                  :formats="vCalendarFormats"
                  :available-dates="{ start: this.$moment().subtract(1, 'days').toDate() }"
                  @input="clearValidation"
                >
                </v-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- /Special Day Date -->

          <!-- Special Day Work and Break Hours -->
          <transition-group name="fade">
            <div v-for="(period, index) in specialDayModel.periodList" :key="index + 1" class="am-period">
              <el-row :gutter="10" type="flex" style="flex-wrap: wrap">

                <!-- Work Hours Start & End -->
                <el-col :span="responsiveGrid.editHours.workHours">
                  <el-row :gutter="10">

                    <el-col :span="24" style="margin-bottom: 4px">
                      <span>{{ $root.labels.work_hours }}</span>
                    </el-col>

                    <!-- Work Hours Start -->
                    <el-col :span="responsiveGrid.editHours.hour">
                      <el-form-item :prop="'periodList.' + index + '.startTime'" :rules="rules.startTime">
                        <el-time-select
                          v-model="period.startTime"
                          size="mini"
                          style="margin-bottom: 12px"
                          :is-required=true
                          :popper-class="'am-dropdown-cabinet'"
                          :picker-options="getTimeSelectOptionsWithLimits(getPeriodBorderTime(specialDayModel, index)[0], period.endTime)"
                          @change="clearValidation"
                        >
                        </el-time-select>
                      </el-form-item>
                    </el-col>
                    <!-- /Work Hours Start -->

                    <!-- Work Hours End -->
                    <el-col :span="responsiveGrid.editHours.hour">
                      <el-form-item :prop="'periodList.' + index + '.endTime'" :rules="rules.endTime">
                        <el-time-select
                          v-model="period.endTime"
                          :picker-options="getTimeSelectOptionsWithLimits(period.startTime, getPeriodBorderTime(specialDayModel, index)[1])"
                          size="mini"
                          style="margin-bottom: 12px"
                          :is-required=true
                          :popper-class="'am-dropdown-cabinet'"
                          @change="clearValidation"
                        >
                        </el-time-select>
                      </el-form-item>
                    </el-col>
                    <!-- /Work Hours End -->

                  </el-row>
                </el-col>
                <!-- /Work Hours Start & End -->

                <!-- Services -->
                <el-col v-if="categorizedServiceList && servicesCount > 1" :span="responsiveGrid.editHours.services">
                  <el-row :gutter="10" type="flex" style="flex-wrap: wrap">
                    <el-col :span="24" style="margin-bottom: 4px">
                      <span>{{ $root.labels.services.charAt(0).toUpperCase() + $root.labels.services.slice(1) }}</span>
                      <el-tooltip placement="top">
                        <div slot="content" v-html="$root.labels.period_services_filter2_tooltip"></div>
                        <i class="el-icon-question am-tooltip-icon"></i>
                      </el-tooltip>
                    </el-col>


                    <el-col :span="24">
                      <el-select
                        v-if="categorizedServiceList"
                        v-model="period.serviceIds"
                        multiple
                        filterable
                        collapse-tags
                        size="mini"
                        style="margin-bottom: 12px"
                        class="am-select-service"
                        :popper-class="'am-dropdown-cabinet'"
                        :placeholder="$root.labels.period_services_filter"
                        @change="clearValidation()"
                      >
                        <div
                          v-if="category.serviceList.filter(service => service.state).length > 0"
                          v-for="category in categorizedServiceList"
                          :key="category.id"
                        >
                          <div
                            class="am-drop-parent"
                            @click="selectAllInCategory(period, category.id)"
                          >
                            <span>{{ category.name }}</span>
                          </div>
                          <el-option
                            v-for="service in category.serviceList"
                            :key="service.id"
                            :label="service.name"
                            :value="service.id"
                            class="am-drop-child"
                            v-if="service.state"
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
                        <div slot="content" v-html="$root.labels.period_location_filter2_tooltip"></div>
                        <i class="el-icon-question am-tooltip-icon"></i>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="24">
                      <el-select
                        v-model="period.locationIds"
                        multiple
                        filterable
                        clearable
                        :placeholder="$root.labels.location"
                        collapse-tags
                        size="mini"
                        style="margin-bottom: 12px"
                        class="am-select-service"
                        :popper-class="'am-dropdown-cabinet'"
                        v-if="locations.length"
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

                <!-- Delete Period -->
                <el-col v-if="specialDayModel.periodList.length > 1" :span="2">
                  <div class="am-delete-element" @click="deletePeriod(index)">
                    <i class="el-icon-minus"></i>
                  </div>
                </el-col>
                <!-- /Delete Period -->

              </el-row>
            </div>
          </transition-group>
          <!-- /Special Day Work and Break Hours -->

          <!-- Add Period Button -->
          <el-row>
            <el-col :sm="24" class="align-left">
              <div class="am-add-elements">
                <div class="am-add-element" @click="addPeriod">
                  <i class="el-icon-plus"></i> {{ $root.labels.add_period }}
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- /Add Period Button -->

          <!-- Save Special Day Button -->
          <el-row class="am-special-day-buttons">
            <el-col :sm="24" class="align-right">
              <el-button size="small" @click="showSpecialDayForm = !showSpecialDayForm">{{ $root.labels.cancel }}
              </el-button>
              <el-button size="small" type="primary" @click="saveSpecialDay" class="am-dialog-create">
                {{ $root.labels.save_special_day }}
              </el-button>
            </el-col>
          </el-row>
          <!-- /Save Special Day Button -->

        </el-form>
      </div>
    </transition>
    <!-- /Special Day Form -->

  </div>
  <!-- /Employees Special Days -->

</template>

<script>
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../js/common/mixins/dateMixin'
  import durationMixin from '../../../js/common/mixins/durationMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import windowMixin from '../../../js/backend/mixins/windowMixin'

  export default {

    mixins: [imageMixin, dateMixin, durationMixin, helperMixin, windowMixin],

    props: {
      activeTab: '',
      categorizedServiceList: null,
      locations: null,
      specialDays: null,
      shouldScrollView: {
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
        model: {},

        rules: {
          dateRange: [
            {required: true, message: this.$root.labels.special_day_date_warning, trigger: 'submit'}
          ],
          startTime: [
            {required: true, message: this.$root.labels.special_day_start_time_warning, trigger: 'submit'}
          ],
          endTime: [
            {required: true, message: this.$root.labels.special_day_end_time_warning, trigger: 'submit'}
          ]
        },

        specialDayModel: this.getInitSpecialDayModel(),

        showSpecialDayForm: false,

        responsiveGrid: {
          editHours: {
            workHours: 24,
            hour: 24,
            services: 24,
            location: 24
          }
        }
      }
    },

    created () {
      window.addEventListener('resize', this.handleResize)
    },

    mounted () {
      this.sortSpecialDays()
    },

    methods: {
      sortSpecialDays () {
        this.specialDays.sort((a, b) => { return new Date(a.startDate) - new Date(b.startDate) })
      },

      getColumnLength (size = '') {
        if (this.categorizedServiceList && this.servicesCount > 1 && this.locations && this.locations.length > 1) {
          if (size === 'mini') {
            return {
              workHours: 22,
              hour: 24,
              services: 22,
              location: 22
            }
          }

          if (size === 'mobile') {
            return {
              workHours: 22,
              hour: 12,
              services: 22,
              location: 22
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
              workHours: 22,
              hour: 24,
              services: 22,
              location: 0
            }
          }

          if (size === 'mobile') {
            return {
              workHours: 22,
              hour: 12,
              services: 22,
              location: 0
            }
          }

          return {
            workHours: 10,
            hour: 12,
            services: 12,
            location: 0
          }
        } else if (this.locations && this.locations.length > 1) {
          if (size === 'mini') {
            return {
              workHours: 22,
              hour: 24,
              services: 0,
              location: 22
            }
          }

          if (size === 'mobile') {
            return {
              workHours: 22,
              hour: 12,
              services: 0,
              location: 22
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
              workHours: 22,
              hour: 24,
              services: 0,
              location: 0
            }
          }

          if (size === 'mobile') {
            return {
              workHours: 22,
              hour: 12,
              services: 0,
              location: 0
            }
          }

          return {
            workHours: 22,
            hour: 12,
            services: 0,
            location: 0
          }
        }
      },

      handleResize () {
        if (this.activeTab === 'specialDays' || this.activeTab === 'specialDays') {
          let amContainer = this.$refs.specialDays

          if (amContainer.offsetWidth < 320) {
            this.responsiveGrid.editHours = this.getColumnLength('mini')
          } else if (amContainer.offsetWidth < 650) {
            this.responsiveGrid.editHours = this.getColumnLength('mobile')
          } else {
            this.responsiveGrid.editHours = this.getColumnLength()
          }
        }
      },

      getInitSpecialDayModel () {
        return {
          index: null,
          id: null,
          dateRange: null,
          periodList: [
            {
              id: null,
              startTime: '',
              endTime: '',
              locationId: null,
              locationIds: [],
              serviceIds: [],
              periodLocationList: [],
              periodServiceList: []
            }
          ]
        }
      },

      addSpecialDay () {
        this.specialDayModel = this.getInitSpecialDayModel()
        this.showSpecialDayForm = true
        if (this.shouldScrollView === true) {
          this.scrollViewInModal('specialDay')
        }
      },

      cloneSpecialDay (index) {
        this.specialDayModel = this.getInitSpecialDayModel()

        this.specialDayModel.periodList = []

        this.specialDays[index].periodList.forEach((periodItem) => {
          let clonedPeriod = {}

          let periodServiceList = []

          let periodLocationList = []

          clonedPeriod.locationId = null

          periodItem.periodServiceList.forEach((periodServiceItem) => {
            periodServiceList.push({
              id: null,
              serviceId: periodServiceItem.serviceId
            })
          })

          periodItem.periodLocationList.forEach((periodLocationItem) => {
            periodLocationList.push({
              id: null,
              locationId: periodLocationItem.locationId
            })
          })

          this.specialDayModel.periodList.push({
            id: null,
            startTime: periodItem.startTime.substr(0, 5),
            endTime: periodItem.endTime.substr(0, 5),
            locationId: periodLocationList.length ? periodLocationList[0] : null,
            locationIds: periodLocationList.map(i => i.locationId),
            serviceIds: periodServiceList.map(i => i.serviceId),
            periodLocationList: periodLocationList,
            periodServiceList: periodServiceList
          })
        })

        this.showSpecialDayForm = true

        if (this.shouldScrollView === true) {
          this.scrollViewInModal('specialDay')
        }
      },

      editSpecialDay (index) {
        let specialDayModel = {
          index: index,
          id: this.specialDays[index].id,
          dateRange: {
            start: this.$moment(this.specialDays[index].startDate).toDate(),
            end: this.$moment(this.specialDays[index].endDate).toDate()
          },
          periodList: []
        }

        this.specialDays[index].periodList.forEach(function (period) {
          let locationIds = []

          if (period.periodLocationList.length) {
            period.periodLocationList.forEach(function (periodLocation) {
              locationIds.push(periodLocation.locationId)
            })
          } else if (period.locationId) {
            locationIds.push(period.locationId)
          }

          let serviceIds = []

          period.periodServiceList.forEach(function (periodService) {
            serviceIds.push(periodService.serviceId)
          })

          specialDayModel.periodList.push({
            id: period.id,
            startTime: period.startTime.slice(0, -3),
            endTime: period.endTime.slice(0, -3),
            periodLocationList: period.periodLocationList,
            periodServiceList: period.periodServiceList,
            locationId: period.locationId,
            locationIds: locationIds,
            serviceIds: serviceIds
          })
        })

        this.specialDayModel = specialDayModel
        this.showSpecialDayForm = true
        if (this.shouldScrollView === true) {
          this.scrollViewInModal('specialDay')
        }
      },

      deleteSpecialDay (index) {
        this.specialDays.splice(index, 1)
      },

      saveSpecialDay () {
        this.$refs.specialDayModel.validate((valid) => {
          if (valid) {
            let specialDay = {
              id: this.specialDayModel.id,
              startDate: this.$moment(this.specialDayModel.dateRange.start).format('YYYY-MM-DD'),
              endDate: this.$moment(this.specialDayModel.dateRange.end).format('YYYY-MM-DD'),
              periodList: []
            }

            this.specialDayModel.periodList.forEach(function (period) {
              let periodLocationList = []

              period.locationIds.forEach(function (locationId) {
                let periodLocation = period.periodLocationList.find(periodLocation => periodLocation.locationId === locationId)

                periodLocationList.push({
                  id: periodLocation ? periodLocation.id : null,
                  locationId: locationId
                })
              })

              let periodServiceList = []

              period.serviceIds.forEach(function (serviceId) {
                let periodService = period.periodServiceList.find(periodService => periodService.serviceId === serviceId)

                periodServiceList.push({
                  id: periodService ? periodService.id : null,
                  serviceId: serviceId
                })
              })

              specialDay.periodList.push({
                id: period.id,
                startTime: period.startTime + ':00',
                endTime: period.endTime + ':00',
                locationId: period.locationId,
                periodLocationList: periodLocationList,
                periodServiceList: periodServiceList
              })
            })

            this.$emit('changeSpecialDays', specialDay, this.specialDayModel.index)
            this.clearValidation()
            this.showSpecialDayForm = false
          } else {
            return false
          }
        })
        this.sortSpecialDays()
      },

      getSpecialDayServices (specialDay) {
        let locationIds = []
        let serviceIds = []
        let serviceNames = []

        specialDay.periodList.forEach(function (period) {
          locationIds = _.uniq(locationIds.concat(period.periodLocationList.map(periodLocation => periodLocation.locationId)))
          serviceIds = _.uniq(serviceIds.concat(period.periodServiceList.map(periodService => periodService.serviceId)))
        })

        this.categorizedServiceList.forEach(function (category) {
          category.serviceList.forEach(function (service) {
            if (service.state && (serviceIds.length === 0 || serviceIds.indexOf(service.id) !== -1)) {
              serviceNames.push(service.name)
            }
          })
        })

        return serviceNames.join(', ')
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

      getPeriodBorderTime: function (workDay, index) {
        let nextPeriodStart = '24:00'
        let previousPeriodEnd = '00:00'

        workDay.periodList.forEach(function (period, periodIndex) {
          if (index === periodIndex - 1) {
            nextPeriodStart = period.startTime
          }

          if (index === periodIndex + 1) {
            previousPeriodEnd = period.endTime
          }
        })

        return [
          this.secondsToTimeSelectStep(this.getStringTimeInSeconds(previousPeriodEnd) - this.getTimeSlotLength()),
          this.secondsToTimeSelectStep(this.getStringTimeInSeconds(nextPeriodStart) + this.getTimeSlotLength())
        ]
      },

      addPeriod () {
        this.specialDayModel.periodList.push({
          startTime: this.specialDayModel.periodList.length ? (this.specialDayModel.periodList[this.specialDayModel.periodList.length - 1].endTime) : '',
          endTime: '',
          id: null,
          locationIds: [],
          serviceIds: [],
          locationId: null,
          periodLocationList: [],
          periodServiceList: []
        })
      },

      deletePeriod (index) {
        this.specialDayModel.periodList.splice(index, 1)
      },

      clearValidation () {
        if (typeof this.$refs.specialDayModel !== 'undefined') {
          this.$refs.specialDayModel.clearValidate()
        }
      }
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
        if (this.activeTab === 'specialDays' || this.activeTab === 'special') {
          this.handleResize()
        }
      }
    }

  }
</script>
