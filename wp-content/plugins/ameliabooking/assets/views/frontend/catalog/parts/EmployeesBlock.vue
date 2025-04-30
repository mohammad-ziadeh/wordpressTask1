<template>
  <div class="am-service-providers">
    <h3 :style="{color: formColors.formTextColor}">
      {{ formLabels.employees.value || capitalizeFirstLetter($root.labels.employees) }}
    </h3>
    <div v-for="(employee, index) in employees" class="am-service-provider" :key="index">
      <img
        :src="pictureLoad(employee, true)"
        @error="imageLoadError(employee, true)"
        :alt="employee.firstName + ' ' + employee.lastName"
      >
      <span :style="{color: formColors.formTextColor}">
        {{ employee.firstName + ' ' + employee.lastName }}
      </span>
    </div>
  </div>
</template>

<script>
  import imageMixin from '../../../../js/common/mixins/imageMixin'
  import helperMixin from '../../../../js/backend/mixins/helperMixin'

  export default {

    mixins: [imageMixin, helperMixin],

    props: {
      formColors: {
        type: Object
      },
      formLabels: {
        type: Object
      },
      employees: {
        type: Array
      }
    }

  }
</script>