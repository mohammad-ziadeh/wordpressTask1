<template>
  <div v-if="fieldVisibility" class="am-confirmation-booking-details">
    <!-- Employee -->
    <div>
      <p>
        {{ labelEmployee || `${capitalizeFirstLetter($root.labels.employee)}:` }}
      </p>
      <p class="am-semi-strong">
        <img
          class="am-employee-photo"
          :src="pictureLoad(provider, true)"
          :alt="provider.firstName + ' ' + provider.lastName"
          @error="imageLoadError(provider, true)"
        />
        {{ provider.firstName + ' ' + provider.lastName }}
      </p>
    </div>
    <!-- /Employee -->

    <!-- Date -->
    <div>
      <p>{{ labelDate || $root.labels.date_colon }}</p>
      <p class="am-semi-strong">
        {{ getAppointmentDate() }}
      </p>
    </div>
    <!-- /Date -->

    <!-- Time -->
    <div>
      <p>{{ labelTime || $root.labels.time_colon }}</p>
      <p class="am-semi-strong">
        {{ getAppointmentTime() }}
      </p>
    </div>
    <!-- /Time -->

    <!-- Location -->
    <div v-if="location !== null">
      <p>{{ labelLocation || $root.labels.location_colon }}</p>
      <p class="am-semi-strong">{{ location ? location.name : '' }}</p>
    </div>
    <!-- /Location -->

  </div>
</template>

<script>
  import moment from 'moment'
  import helperMixin from '../../../../js/backend/mixins/helperMixin'
  import imageMixin from '../../../../js/common/mixins/imageMixin'
  import dateMixin from '../../../../js/common/mixins/dateMixin'

  export default {
    name: 'confirmHeadingDataFormField',

    props: {
      bookableStart: {
        type: String,
        default: ''
      },
      provider: {
        type: Object,
        default: () => {}
      },
      location: {
        type: Object,
        default: () => {}
      },
      formField: {
        type: Object,
        default: () => {}
      }
    },

    data () {
      return {
        labelEmployee: this.formField[this.$options.name].labels.employee.value,
        labelDate: this.formField[this.$options.name].labels.date_colon.value,
        labelTime: this.formField[this.$options.name].labels.time_colon.value,
        labelLocation: this.formField[this.$options.name].labels.location_colon.value,
        fieldVisibility: this.formField[this.$options.name].visibility
      }
    },

    mixins: [helperMixin, imageMixin, dateMixin],

    methods: {
      getAppointmentDate () {
        return this.getFrontedFormattedDate(
          moment(this.bookableStart, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
        )
      },

      getAppointmentTime () {
        return this.getFrontedFormattedTime(this.bookableStart.split(' ')[1])
      }
    }
  }
</script>
