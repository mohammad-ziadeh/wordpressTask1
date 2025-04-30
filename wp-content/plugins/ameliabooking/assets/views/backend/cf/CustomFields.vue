<template>
  <div class="am-wrap">
    <!-- Preview Fonts Import -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <!-- /Preview Fonts Import -->

    <div class="am-customize-page am-body">

      <!-- Page Header -->
      <page-header
        :addNewCustomFieldBtnDisplay="addNewCustomFieldBtnDisplay"
        @newCustomFieldBtnClicked="showDialogNewCustomFields()"
      >
      </page-header>

      <div class="am-customize am-section">
        <!-- Custom Fields -->
        <div>

          <!-- Custom Fields -->
          <div class="am-custom-fields" id="qweqwe">

            <!-- Spinner -->
            <div class="am-spinner am-section" v-show="!fetched || !options.fetched">
              <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
            </div>

            <!-- Empty State -->
            <EmptyState
              :visible="fetched && options.fetched && customFields.length === 0"
              :licence="'basic'"
              :title="$root.labels.no_custom_fields_yet"
              :description="$root.labels.click_add_custom_field"
            >
            </EmptyState>

            <!-- Custom Fields List -->
            <div class="am-custom-fields-list" v-show="fetched && options.fetched && customFields.length > 0">

              <!-- Checkbox send all custom fields -->
              <el-checkbox
                v-model="separateCustomFields"
                style="padding-bottom: 20px"
                @change="saveSendAllCustomFields()"
              >
                {{ $root.labels.send_custom_fields_separately }}
                <el-tooltip placement="top">
                  <div slot="content" v-html="$root.labels.send_custom_fields_tooltip"></div>
                  <i class="el-icon-question am-tooltip-icon"></i>
                </el-tooltip>
              </el-checkbox>

              <!-- Custom Field Component -->
              <draggable v-model="customFields" :options="draggableOptions" @end="dropCustomField">
                <custom-field
                  v-for="customField in customFields"
                  :key="customField.id"
                  :customField="customField"
                  :events="options.entities.events"
                  :categories="options.entities.categories"
                  :services="options.entities.services"
                  :passed-used-languages="options.settings.general.usedLanguages"
                  :languages-data="languagesData"
                  @deleteCustomField="deleteCustomField"
                  @updateCustomField="updateCustomField"
                  @usedLanguagesUpdated="updateUsedLanguages"
                >
                </custom-field>
              </draggable>

            </div>

          </div>

          <!-- Dialog Custom Fields -->
          <transition name="slide">
            <el-dialog
              :close-on-click-modal="false"
              class="am-side-dialog am-dialog-custom-fields"
              :visible.sync="showDialog"
              :show-close="false" v-if="showDialog"
            >
              <dialog-custom-fields
                @closeDialogCustomFields="closeDialogCustomFields"
                @addCustomField="addCustomField"
              >
              </dialog-custom-fields>
            </el-dialog>
          </transition>

          <!-- Button New -->
          <div id="am-button-new" class="am-button-new">

            <!-- Popover -->
            <el-popover
              ref="popover"
              placement="top"
              width="160"
              v-model="popover"
              visible-arrow="false"
              popper-class="am-button-popover"
            >
              <div class="am-overlay" @click="popover = false; buttonNewItems = !buttonNewItems">
                <div class="am-button-new-items-custom-fields">
                  <transition name="el-zoom-in-bottom">
                    <div v-show="buttonNewItems">
                      <el-button
                        v-for="(type, index) in types"
                        :key="index" @click="addCustomField(type)"
                      >
                        {{ $root.labels[type] }}
                      </el-button>
                    </div>
                  </transition>
                </div>
              </div>
            </el-popover>

            <!-- Button -->
            <el-button
              id="am-plus-symbol"
              v-popover:popover
              type="primary"
              icon="el-icon-plus"
              @click="buttonNewItems = !buttonNewItems"
              :disabled="notInLicence()"
            >
            </el-button>

          </div>

        </div>
      </div>

      <!-- Help Button -->
      <el-col :md="6" class="">
        <a class="am-help-button" :href="needHelpPage" target="_blank" rel="nofollow">
          <i class="el-icon-question"></i> {{ $root.labels.need_help }}?
        </a>
      </el-col>

    </div>

<!--    <dialog-new-customize></dialog-new-customize>-->

  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import PageHeader from '../parts/PageHeader.vue'
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button.vue'
  import CustomField from './customfields/CustomField'
  import DialogCustomFields from './customfields/DialogCustomFields.vue'
  import licenceMixin from '../../../js/common/mixins/licenceMixin'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import entitiesMixin from '../../../js/common/mixins/entitiesMixin'
  import stashMixin from '../../../js/backend/mixins/stashMixin'
  // import DialogNewCustomize from '../parts/DialogNewCustomize.vue'

  export default {
    components: {
      ElButton,
      PageHeader,
      CustomField,
      DialogCustomFields,
      Draggable
      // DialogNewCustomize
    },

    mixins: [
      licenceMixin,
      notifyMixin,
      imageMixin,
      entitiesMixin,
      stashMixin
    ],

    data () {
      return {
        separateCustomFields: false,
        buttonNewItems: false,
        customFields: [],
        draggableOptions: {
          handle: '.am-drag-handle',
          animation: 150
        },
        fetched: false,
        options: {
          entities: {
            events: [],
            categories: [],
            services: []
          },
          settings: {
            general: {
              usedLanguages: []
            }
          },
          fetched: false
        },
        languagesData: [],
        popover: false,
        types: ['text', 'text-area', 'content', 'select', 'checkbox', 'radio', 'file', 'datepicker', 'address'],
        dialogCustomFields: false
      }
    },

    created () {},

    mounted () {
      if (this.$root.licence.isLite || this.$root.licence.isStarter) {
        this.fetched = true

        this.options.fetched = true

        return
      }

      this.getEntities()
      this.separateCustomFields = !(this.$root.settings.notifications.sendAllCF)
    },

    methods: {
      getCustomFields (inlineSVG) {
        this.fetched = false
        this.$http.get(`${this.$root.getAjaxUrl}/fields`)
          .then(response => {
            let customFields = response.data.data.customFields

            let eventsIds = this.options.entities.events.map(event => event.id)

            let $this = this
            customFields.forEach(function (customField) {
              let eventsNotRetrieved = customField.events.filter(event => eventsIds.indexOf(event.id) === -1)
              $this.options.entities.events = $this.options.entities.events.concat(eventsNotRetrieved)
            })

            this.customFields = customFields

            this.fetched = true
            if (inlineSVG) {
              setTimeout(() => {
                this.inlineSVG()
              }, 100)
            }
          })
          .catch(e => {
            console.log(e.message)
          })
      },

      getEntities () {
        this.options.fetched = false

        this.$http.get(`${this.$root.getAjaxUrl}/entities`, {
          params: this.getAppropriateUrlParams({
            types: ['categories', 'events', 'settings']
          })
        }).then(response => {
          this.options.entities = response.data.data
          this.languagesData = response.data.data.settings.languages
          this.options.settings.general.usedLanguages = response.data.data.settings.general.usedLanguages

          this.getCustomFields(false)

          this.options.fetched = true
          this.options.entities.services = this.getServicesFromCategories(this.options.entities.categories)
          setTimeout(() => {
            this.inlineSVG()
          }, 100)
        }).catch(() => {
          this.options.fetched = true
        })
      },

      dropCustomField (e) {
        if (e.newIndex !== e.oldIndex) {
          let $this = this
          this.customFields.forEach((customField) => {
            customField.position = $this.customFields.indexOf(customField) + 1
          })

          this.updateCustomFieldsPositions()
        }
      },

      deleteCustomField (customField) {
        this.fetched = false
        this.$http.post(`${this.$root.getAjaxUrl}/fields/delete/` + customField.id)
          .then(() => {
            this.notify(this.$root.labels.success, this.$root.labels.custom_fields_deleted, 'success')

            let index = this.customFields.indexOf(customField)
            this.customFields.splice(index, 1)

            // Update custom fields positions
            for (let i = 0; i < this.customFields.length; i++) {
              this.customFields[i].position = i + 1
            }
            this.updateCustomFieldsPositions()
            this.fetched = true
          })
          .catch(e => {
            this.notify(this.$root.labels.error, e.message, 'error')
          })
      },

      updateCustomField (customField) {
        let index = this.customFields.findIndex(field => field.id === customField.id)

        let $this = this
        this.customFields[index].options.forEach((option, optionIndex) => {
          if ($this.customFields[index].options[optionIndex].deleted === true) {
            $this.customFields[index].options.splice(optionIndex, 1)
          } else {
            $this.$set(option, 'id', typeof customField.options[optionIndex].id !== 'undefined' ? customField.options[optionIndex].id : null)
            $this.$set(option, 'edited', false)
            $this.$set(option, 'deleted', false)
            $this.$set(option, 'new', false)
          }
        })
      },

      closeDialogCustomFields () {
        this.dialogCustomFields = false
      },

      addCustomField (type) {
        this.fetched = false
        this.showDialog = false

        let customField = {
          id: null,
          label: '',
          options: [],
          position: this.customFields.length + 1,
          required: true,
          services: [],
          type: type,
          width: 50
        }

        this.$http.post(`${this.$root.getAjaxUrl}/fields`, {
          customField: customField
        }).then((response) => {
          this.notify(this.$root.labels.success, this.$root.labels.custom_fields_added, 'success')
          this.fetched = true
          this.customFields.push(response.data.data.customField)
          this.updateStashEntities({})
        }).catch(e => {
          this.notify(this.$root.labels.error, e.message, 'error')
        })
      },

      updateCustomFieldsPositions () {
        this.$http.post(`${this.$root.getAjaxUrl}/fields/positions`, {
          customFields: this.customFields
        }).then(response => {
          this.updateStashEntities({})
        }).catch(() => {
          this.notify(this.$root.labels.error, this.$root.labels.custom_fields_positions_saved_fail, 'error')
        })
      },

      saveSendAllCustomFields () {
        this.$http.post(`${this.$root.getAjaxUrl}/settings`, {sendAllCF: !this.separateCustomFields})
          .then(response => {
            this.notify(this.$root.labels.success, this.$root.labels.settings_saved, 'success')
            this.updateStashEntities({})
          })
          .catch(e => {
            this.notify(this.$root.labels.error, e.message, 'error')
          })
      },

      updateUsedLanguages (usedLanguages) {
        this.options.settings.general.usedLanguages = usedLanguages
      },

      showDialogNewCustomFields () {
        this.dialogCustomFields = true
      }
    },

    computed: {
      addNewCustomFieldBtnDisplay () {
        return true
      },

      needHelpPage () {
        return 'https://wpamelia.com/custom-fields/'
      },

      showDialog: {
        get () {
          return this.dialogCustomFields === true
        },
        set () {
          this.closeDialogCustomFields()
        }
      }
    }
  }
</script>
