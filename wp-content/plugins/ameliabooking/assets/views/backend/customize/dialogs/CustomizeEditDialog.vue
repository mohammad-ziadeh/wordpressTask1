<template>
  <el-popover
    ref="popover"
    popper-class="am-customize__edit"
    :placement="'top'"
    :append-to-body="true"
    v-model="editVisible"
    @hide="cancelEdit"
  >
    <div class="am-customize__edit-body">
      <el-form @submit.prevent.native>
        <!-- Field Labels -->
        <el-form-item v-for="(item, key) in field.labels" :key="`${key}-labels`" class="am-customize__edit-input-wrapper">
          <template slot="label">
            <span
              v-if="item.hasOwnProperty('value')"
              :style="{display: 'block', textAlign: 'left'}"
            >
              {{ `${$root.labels.label} "${$root.labels[key]}"` }}
            </span>
            <span
              v-if="item.hasOwnProperty('visibility')"
              :style="{display: 'block', textAlign: 'left'}"
            >
              {{ `"${$root.labels[key]}" Visibility` }}
            </span>
          </template>
          <el-input v-if="item.hasOwnProperty('value') && !languageShortCode" v-model="item.value"></el-input>
          <el-input v-if="item.hasOwnProperty('value') && languageShortCode" v-model="item.translations[languageShortCode]"></el-input>
          <el-switch
            v-if="item.hasOwnProperty('visibility')"
            v-model="item.visibility"
            :style="{height: '40px', maxWidth: '60px'}"
            active-color="#1A84EE"
          ></el-switch>
        </el-form-item>
        <!-- /Field Labels -->

        <!-- Field Parts -->
        <el-form-item v-for="(item, key) in field.parts" :key="`${key}-parts`" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ `"${$root.labels[key]}" ${$root.labels.visibility}` }}
          </template>
          <el-switch
            v-if="item.hasOwnProperty('visibility')"
            v-model="item.visibility"
            active-color="#1A84EE"
          ></el-switch>
        </el-form-item>
        <!-- /Field Parts -->

        <el-form-item v-if="field.hasOwnProperty('visibility')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.display_field }}
          </template>
          <el-switch
            v-model="field.visibility"
            :disabled="(field.hasOwnProperty('required') && field.required) ? field.required : false"
            @change="visibilityChange"
            active-color="#1A84EE"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="field.hasOwnProperty('required')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.mandatory_field }}
          </template>
          <el-switch
            v-model="field.required"
            @change="requiredChange"
            active-color="#1A84EE"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="field.hasOwnProperty('endDateVisibility')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.end_time_visibility }}
          </template>
          <el-switch
            v-model="field.endDateVisibility"
            active-color="#1A84EE"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="field.hasOwnProperty('anyEmployeeVisible')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.any_employee_visibility }}
          </template>
          <el-switch
            v-model="field.anyEmployeeVisible"
            :disabled="(field.hasOwnProperty('required') && field.required) ? field.required : false"
            @change="anyEmployeeChange"
            active-color="#1A84EE"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="field.hasOwnProperty('timeZoneVisibility')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.time_zone }} {{ $root.labels.visibility }}
          </template>
          <el-switch
            v-model="field.timeZoneVisibility"
            active-color="#1A84EE"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="field.hasOwnProperty('addToCalendarVisibility')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.add_to_calendar }} {{ $root.labels.visibility }}
          </template>
          <el-switch
            v-model="field.addToCalendarVisibility"
            active-color="#1A84EE"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="field.hasOwnProperty('showSingleEvent')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.show_single_event }}
          </template>
          <el-switch
            v-model="field.showSingleEvent"
            active-color="#1A84EE"
          ></el-switch>
        </el-form-item>
        <el-form-item v-if="field.hasOwnProperty('switchPaymentMethodView')" class="am-customize__edit-input-wrapper">
          <template slot="label">
            {{ $root.labels.payment_method_view }}
          </template>
          <el-select
              v-model="field.switchPaymentMethodView"
              active-color="#1A84EE"
          >
            <el-option
              v-for="option in field.switchPaymentMethodViewOptions.slice(0,2)"
              :key="option.id"
              :value="option.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="am-customize__edit-footer">
      <el-button
        class="am-customize__edit-footer--button am-customize__edit-footer--button-cancel"
        type="text"
        size="mini"
        @click="cancelEdit"
      >
        {{ $root.labels.cancel }}
      </el-button>
      <el-button
        class="am-customize__edit-footer--button am-customize__edit-footer--button-confirm"
        type="primary"
        size="mini"
        @click="saveEdit"
      >
        {{ $root.labels.ok }}
      </el-button>
    </div>
    <slot name="fieldEdit" slot="reference" />
  </el-popover>
</template>

<script>
export default {
  name: 'customizeEditDialog',

  props: {
    languageShortCode: {
      type: String,
      default: ''
    },
    formField: {
      default: () => {
        return {}
      },
      type: Object
    }
  },

  data () {
    return {
      editVisible: false,
      field: JSON.parse(JSON.stringify(this.formField))
    }
  },

  methods: {
    visibilityChange () {
      if (!this.field.visibility) {
        if (this.field.hasOwnProperty('anyEmployeeVisible')) {
          this.field.anyEmployeeVisible = true
        }
      }
    },

    requiredChange () {
      if (this.field.required) {
        if (this.field.hasOwnProperty('visibility')) {
          this.field.visibility = true
        }
        if (this.field.hasOwnProperty('anyEmployeeVisible')) {
          this.field.anyEmployeeVisible = false
        }
      }
    },

    anyEmployeeChange () {
      if (!this.field.anyEmployeeVisible) {
        if (this.field.hasOwnProperty('visibility')) {
          this.field.visibility = true
        }
      }
    },

    cancelEdit () {
      this.editVisible = false
      this.field = JSON.parse(JSON.stringify(this.formField))
    },

    saveEdit () {
      this.editVisible = false
      let fieldData = JSON.parse(JSON.stringify(this.field))
      this.$emit('saveEdit', fieldData)
    }
  },

  watch: {
    'formField' () {
      this.field = JSON.parse(JSON.stringify(this.formField))
    }
  }
}
</script>
