<template>
  <!-- Form -->
  <el-form label-position="top" @submit.prevent="onSubmit">

    <!-- Events -->
    <div class="am-extra-list" style="padding: 0">
      <el-button @click="addEvent" size="large" type="primary" class="am-dialog-create">
        <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.marketing_add_tracking }}</span>
      </el-button>

      <transition-group name="list-complete">
        <div class="am-extra-item"
             :id="'trackingEventF' + type + '-' + index"
             v-for="(trackingEvent, index) in settings" :key="index + 1">

          <!-- Tracking Preview -->
          <el-row align="top" class="" style="margin-bottom: 0;">
            <el-col :span="24">
              <el-row type="flex" align="middle" style="margin-bottom: 0;">
                <el-col :span="18">
                  <h3>{{ trackingEvent.event }}</h3>
                </el-col>
                <el-col :span="6" class="extra-item-actions align-right"
                        v-if="editedEvent === null || index !== settings.indexOf(editedEvent)">
                  <span @click="showEditEventDialog(trackingEvent)">
                    <img class="svg-amelia edit" width="16px" :src="$root.getUrl+'public/img/edit.svg'">
                  </span>
                  <span @click="showDeleteEventDialog(trackingEvent)">
                    <img class="svg-amelia" width="16px" :src="$root.getUrl+'public/img/delete.svg'">
                  </span>
                </el-col>
              </el-row>

              <div class="am-extra-item-data"
                   v-show="(editedEvent === null || index !== settings.indexOf(editedEvent)) && (eventToDelete === null || index !== settings.indexOf(eventToDelete))">
                <el-row :gutter="24" style="margin-bottom: 0;">
                  <el-col :sm="24">
                    <span class="data-title">{{ $root.labels['tracking_' + trackingEvent.type] }}</span>
                  </el-col>
                </el-row>
              </div>

            </el-col>
          </el-row>

          <!-- Event Delete -->
          <el-collapse-transition>
            <div class="am-confirmation"
                 v-show="eventToDelete !== null && index === settings.indexOf(eventToDelete)">
              <p>{{ $root.labels.marketing_delete_confirmation }}?</p>
              <div class="align-right" style="display: inline-flex;">
                <el-button size="small" @click="hideDeleteEventDialog()">{{ $root.labels.cancel }}</el-button>
                <el-button size="small" @click="deleteEvent(trackingEvent)" type="primary">{{ $root.labels.delete }}</el-button>
              </div>
            </div>
          </el-collapse-transition>

          <!-- Event Edit -->
          <el-collapse-transition>
            <div v-show="eventEditDialog === true && index === settings.indexOf(editedEvent)">
              <el-form :model="trackingEvent" ref="trackingEvent" :rules="rules" label-position="top">

                <!-- Action -->
                <el-form-item prop="type">
                  <label slot="label">
                    {{ $root.labels.type }}:
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.tracking_type_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </label>
                  <el-select
                      v-model="trackingEvent.type"
                      clearable
                      placeholder=""
                  >
                    <el-option
                        v-for="(item, index) in actions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <!--Event -->
                <el-form-item prop="event">
                  <label slot="label">
                    {{ $root.labels.analytics_event }}:
                    <el-tooltip placement="top">
                      <div slot="content" v-html="$root.labels.analytics_event_tooltip"></div>
                      <i class="el-icon-question am-tooltip-icon"></i>
                    </el-tooltip>
                  </label>
                  <el-input v-model="trackingEvent.event" auto-complete="off" @change = "trimProperty(trackingEvent,'event')">
                  </el-input>
                </el-form-item>

                <div>
                  <el-row :gutter="24" class="zero-margin-bottom">
                    <el-col :span="11">
                      <label class="el-form-item__label">
                        {{$root.labels.tracking_parameter_name + ': '}}
                        <el-tooltip placement="top">
                          <div slot="content" v-html="$root.labels.tracking_parameter_name_tooltip"></div>
                          <i class="el-icon-question am-tooltip-icon"></i>
                        </el-tooltip>
                      </label>
                    </el-col>
                    <el-col :span="11">
                      <label class="el-form-item__label">
                        {{$root.labels.tracking_parameter_value + ': '}}
                      </label>
                    </el-col>
                    <el-col :span="2">
                    </el-col>
                  </el-row>
                  <el-row :gutter="24" type="flex" v-for="(pair, index) in trackingEvent.data" :key="index" class="small-margin-bottom am-payments-meta-data">
                    <el-col :span="11">
                      <el-input type="text" :name="pair.name" v-model="trackingEvent.data[index].key"/>
                    </el-col>
                    <el-col :span="11">
                      <el-input type="text" v-model="trackingEvent.data[index].value"/>
                    </el-col>
                    <el-col :span="2">
                      <span v-if="index !== trackingEvent.data.length - 1" @click="deleteParameter(index)">
                        <i class="el-icon-delete"></i>
                      </span>
                      <span v-else @click="addParameter()">
                        <i class="el-icon-plus"></i>
                      </span>
                    </el-col>
                  </el-row>
                </div>

                <el-form-item>
                  <div>
                    <el-row class="am-notifications-placeholders" v-if="trackingEvent.type !== 'ViewContent'">
                      <el-col :sm="24">
                        <div class="am-placeholder-wrapper">
                          <el-dropdown :key=columnKey v-for="(placeholdersType, columnKey) in marketingPlaceholders[type]" class="am-placeholder-wrapper__dropdown">
                            <el-button class="am-placeholder-wrapper__button" size="small">
                              {{ $root.labels[columnKey] }}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown" :class="{'amelia-dropdown': placeholdersType.length > 20}">
                              <el-dropdown-item
                                  :key=placeholderKey
                                  v-for="(code, placeholderKey) in placeholdersType"
                                  v-if="trackingEvent.type && isAvailablePlaceholder(trackingEvent.type, code.value)"
                              >
                                <el-tooltip
                                    :key="code.code"
                                    effect="dark"
                                    :content="code.label"
                                    placement="left"
                                >
                                  <p @click="copyCodeText(code.value)">
                                    {{ code.value }}
                                  </p>
                                </el-tooltip>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>

                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>

                <!-- Cancel & Save -->
                <div class="align-right" style="display: inline-flex;">
                  <el-button @click="cancelEvent(trackingEvent)" size="small">
                    {{ $root.labels.cancel }}
                  </el-button>
                  <el-button size="small" @click="saveEvent(index)" type="primary">
                    {{ $root.labels.save }}
                  </el-button>
                </div>

              </el-form>
            </div>
          </el-collapse-transition>

        </div>
      </transition-group>

    </div>

  </el-form>
</template>

<script>
import notifyMixin from '../../../../js/backend/mixins/notifyMixin'
import imageMixin from '../../../../js/common/mixins/imageMixin'
import helperMixin from '../../../../js/backend/mixins/helperMixin'
import InlinePlaceholders from '../../notifications/common/InlinePlaceholders'

export default {

  mixins: [imageMixin, helperMixin, notifyMixin],

  props: ['events', 'actions', 'type', 'marketingPlaceholders'],

  data () {
    return {
      settings: this.events,
      eventToDelete: null,
      eventEditDialog: null,
      eventToEdit: null,
      editedEvent: null,
      editedEventOld: null,
      isNewEvent: false,
      rules: {
        event: [
          {required: true, message: this.$root.labels.marketing_field_warning, trigger: 'submit'}
        ],
        type: [
          {required: true, message: this.$root.labels.marketing_type_warning, trigger: 'submit'}
        ]
      }
    }
  },

  methods: {
    isAvailablePlaceholder (type, value) {
      if (!(type === 'Schedule' || type === 'Purchase') &&
          (value === '%payment_amount%' || value === '%payment_currency%')
      ) {
        return false
      }

      if ((type === 'SelectCategory') &&
          !(value === '%category_name%' || value === '%category_id%')
      ) {
        return false
      }

      return true
    },

    addParameter () {
      this.editedEvent.data.push({key: '', value: ''})
    },

    deleteParameter (index) {
      this.editedEvent.data.splice(index, 1)
    },

    copyCodeText (code) {
      let textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('Copy')
      document.body.removeChild(textArea)

      this.notify('', this.$root.labels.placeholder_copied, 'info', 'no-title')
    },

    getInlinePlaceholdersNames (type) {
      let common = [
      ]

      switch (type) {
        case ('packages'):
          return common.concat(
            [
              'packagePlaceholders'
            ]
          )

        case ('events'):
          return common.concat(
            [
              'eventPlaceholders',
              'employeePlaceholders',
              'locationPlaceholders'
            ]
          )

        case ('appointments'):
          return common.concat(
            [
              'employeePlaceholders',
              'categoryPlaceholders',
              'locationPlaceholders'
            ]
          )
      }

      return common
    },
    addEvent () {
      if (this.editedEvent === null) {
        this.eventEditDialog = true

        this.editedEvent = {
          event: '',
          type: '',
          data: [{key: '', value: ''}]
        }

        this.isNewEvent = true

        this.settings.push(this.editedEvent)
      }

      this.scrollViewInModal('trackingEventF' + this.type + '-' + (this.settings.length - 1))
    },

    showEditEventDialog (trackingEvent) {
      this.editedEvent = trackingEvent

      if (!this.editedEvent.data.length) {
        this.editedEvent.data.push({key: '', value: ''})
      }

      this.editedEventOld = JSON.parse(JSON.stringify(trackingEvent))
      this.eventToDelete = null
      this.eventEditDialog = true
    },

    showDeleteEventDialog (trackingEvent) {
      this.eventToDelete = trackingEvent
      this.editedEvent = null
      this.eventEditDialog = false
    },

    hideDeleteEventDialog () {
      this.eventToDelete = null
      this.eventEditDialog = true
    },

    deleteEvent (trackingEvent) {
      let index = this.settings.indexOf(trackingEvent)
      this.settings.splice(index, 1)
    },

    cancelEvent (trackingEvent) {
      if (this.editedEventOld !== null) {
        trackingEvent.event = this.editedEventOld.event
        trackingEvent.type = this.editedEventOld.type
      }

      if (this.isNewEvent) {
        let index = this.settings.indexOf(trackingEvent)
        this.settings.splice(index, 1)
        this.isNewEvent = false
      }

      this.editedEvent = null
      this.editedEventOld = null
      this.eventEditDialog = false
    },

    saveEvent (index) {
      this.$refs.trackingEvent[index].validate((valid) => {
        if (valid) {
          this.editedEvent = null
          this.eventEditDialog = false
          this.isNewEvent = false
          this.$refs.trackingEvent[index].clearValidate()
        } else {
          return false
        }
      })
    }
  },

  components: {InlinePlaceholders}
}
</script>
