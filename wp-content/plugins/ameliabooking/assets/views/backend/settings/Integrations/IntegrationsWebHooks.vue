<template>
      <!-- Form -->
      <el-form label-position="top" @submit.prevent="onSubmit">

        <!-- Web Hooks -->
        <div class="am-extra-list">
          <el-button @click="addWebHook" size="large" type="primary" class="am-dialog-create">
            <i class="el-icon-plus"></i> <span class="button-text">{{ $root.labels.add_web_hook }}</span>
          </el-button>

          <transition-group name="list-complete">
            <div class="am-extra-item"
                 :id="'webHook' + index"
                 v-for="(webHook, index) in settings" :key="index + 1">

              <!-- Web Hook Preview -->
              <el-row type="flex" align="top" class="">
                <el-col :span="24">
                  <el-row type="flex" align="middle">
                    <el-col :span="18">
                      <h3>{{ webHook.name }}</h3>
                    </el-col>
                    <el-col :span="6" class="extra-item-actions align-right"
                            v-if="editedWebHook === null || index !== settings.indexOf(editedWebHook)">
                      <span @click="showEditWebHookDialog(webHook)">
                        <img class="svg-amelia edit" width="16px" :src="$root.getUrl+'public/img/edit.svg'">
                      </span>
                      <span @click="showDeleteWebHookDialog(webHook)">
                        <img class="svg-amelia" width="16px" :src="$root.getUrl+'public/img/delete.svg'">
                      </span>
                    </el-col>
                  </el-row>

                  <div class="am-extra-item-data"
                       v-show="(editedWebHook === null || index !== settings.indexOf(editedWebHook)) && (webHookToDelete === null || index !== settings.indexOf(webHookToDelete))">
                    <el-row :gutter="24">
                      <el-col :sm="12">
                        <span class="data-title">{{ $root.labels.web_hook_action }}: {{ webHook && webHook.action ? (webHook.type === 'package' ? packageActions : actions).find(action => webHook.action === action.value).label : '' }}</span>
                      </el-col>
                      <el-col :sm="12">
                        <span class="data-title">{{ $root.labels.web_hook_booking_type }}: {{ webHook && webHook.type ? types.find(type => webHook.type === type.value).label : '' }}</span>
                      </el-col>
                    </el-row>
                    <el-row :gutter="24">
                      <el-col :sm="24">
                        <span class="data-title">{{ $root.labels.url }}: {{ webHook.url }}</span>
                      </el-col>
                    </el-row>
                  </div>

                </el-col>
              </el-row>

              <!-- Web Hook Delete -->
              <el-collapse-transition>
                <div class="am-confirmation"
                     v-show="webHookToDelete !== null && index === settings.indexOf(webHookToDelete)">
                  <p>{{ $root.labels.web_hook_delete_confirmation }}?</p>
                  <div class="align-right">
                    <el-button size="small" @click="hideDeleteWebHookDialog()">{{ $root.labels.cancel }}</el-button>
                    <el-button size="small" @click="deleteWebHook(webHook)" type="primary">{{ $root.labels.delete }}</el-button>
                  </div>
                </div>
              </el-collapse-transition>

              <!-- Web Hook Edit -->
              <el-collapse-transition>
                <div v-show="webHookEditDialog === true && index === settings.indexOf(editedWebHook)">
                  <el-form :model="webHook" ref="webHook" :rules="rules" label-position="top">

                    <!-- Name -->
                    <el-form-item :label="$root.labels.name + ':'" prop="name">
                      <el-input v-model="webHook.name" auto-complete="off" @change = "trimProperty(webHook,'name')">
                      </el-input>
                    </el-form-item>

                    <!-- URL -->
                    <el-form-item label="URL:" prop="url">
                      <el-input v-model.trim="webHook.url" auto-complete="off">
                      </el-input>
                    </el-form-item>

                    <!-- Booking Type -->
                    <el-form-item :label="$root.labels.web_hook_booking_type + ':'" prop="type">
                      <el-select
                          v-model="webHook.type"
                          @change="webHookTypeChanged()"
                          clearable
                          placeholder=""
                      >
                        <el-option
                            v-for="(item, index) in types"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <!-- Action -->
                    <el-form-item :label="$root.labels.web_hook_action + ':'" prop="action">
                      <el-select
                          v-model="webHook.action"
                          clearable
                          placeholder=""
                      >
                        <el-option
                            v-for="(item, index) in (webHook.type === 'package' ? packageActions : actions)"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-alert
                      v-if="webHook.action === 'packagePurchased'"
                      title=""
                      type="warning"
                      :description="$root.labels.web_hook_package_tooltip"
                      show-icon
                      :closable="false"
                    >
                    </el-alert>

                    <!-- Cancel & Save -->
                    <div class="align-right">
                      <el-button @click="cancelWebHook(webHook)" size="small">
                        {{ $root.labels.cancel }}
                      </el-button>
                      <el-button size="small" @click="saveWebHook(index)" type="primary">
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
  import imageMixin from '../../../../js/common/mixins/imageMixin'
  import helperMixin from '../../../../js/backend/mixins/helperMixin'

  export default {

    mixins: [imageMixin, helperMixin],

    props: ['webHooks'],

    data () {
      return {
        settings: this.webHooks,
        webHookToDelete: null,
        webHookEditDialog: null,
        webHookToEdit: null,
        editedWebHook: null,
        editedWebHookOld: null,
        isNewWebHook: false,
        actions: [
          {value: 'bookingAdded', label: this.$root.labels.web_hook_booking_completed},
          {value: 'bookingTimeUpdated', label: this.$root.labels.web_hook_booking_rescheduled},
          {value: 'bookingCanceled', label: this.$root.labels.web_hook_booking_canceled},
          {value: 'bookingStatusUpdated', label: this.$root.labels.web_hook_booking_status_updated}
        ],
        packageActions: [
          {value: 'packagePurchased', label: this.$root.labels.web_hook_package_purchased},
          {value: 'packageCanceled', label: this.$root.labels.web_hook_package_canceled},
        ],
        types: [
          {value: 'appointment', label: this.$root.labels.appointment},
          {value: 'event', label: this.$root.labels.event}
        ],
        rules: {
          name: [
            {required: true, message: this.$root.labels.web_hook_name_warning, trigger: 'submit'}
          ],
          url: [
            {required: true, message: this.$root.labels.enter_valid_url_warning, trigger: 'submit'}
          ],
          action: [
            {required: true, message: this.$root.labels.web_hook_action_warning, trigger: 'submit'}
          ],
          type: [
            {required: true, message: this.$root.labels.web_hook_booking_type_warning, trigger: 'submit'}
          ]
        }
      }
    },

    beforeMount () {
      if (this.$root.licence.isPro || this.$root.licence.isDeveloper) {
        this.types.push({value: 'package', label: this.$root.labels.package})
      }
    },

    methods: {
      webHookTypeChanged () {
        this.editedWebHook.action = ''
      },

      addWebHook () {
        if (this.editedWebHook === null) {
          this.webHookEditDialog = true

          this.editedWebHook = {
            name: '',
            url: '',
            type: '',
            action: ''
          }

          this.isNewWebHook = true

          this.settings.push(this.editedWebHook)
          this.scrollViewInModal('webHook' + (this.settings.length - 1))
        }
      },

      showEditWebHookDialog (webHook) {
        this.editedWebHook = webHook
        this.editedWebHookOld = JSON.parse(JSON.stringify(webHook))
        this.webHookToDelete = null
        this.webHookEditDialog = true
      },

      showDeleteWebHookDialog (webHook) {
        this.webHookToDelete = webHook
        this.editedWebHook = null
        this.webHookEditDialog = false
      },

      hideDeleteWebHookDialog () {
        this.webHookToDelete = null
        this.webHookEditDialog = true
      },

      deleteWebHook (webHook) {
        let index = this.settings.indexOf(webHook)
        this.settings.splice(index, 1)
      },

      cancelWebHook (webHook) {
        if (this.editedWebHookOld !== null) {
          webHook.name = this.editedWebHookOld.name
          webHook.url = this.editedWebHookOld.url
          webHook.type = this.editedWebHookOld.type
          webHook.action = this.editedWebHookOld.action
        }

        if (this.isNewWebHook) {
          let index = this.settings.indexOf(webHook)
          this.settings.splice(index, 1)
          this.isNewWebHook = false
        }

        this.editedWebHook = null
        this.editedWebHookOld = null
        this.webHookEditDialog = false
      },

      saveWebHook (index) {
        this.$refs.webHook[index].validate((valid) => {
          if (valid) {
            this.editedWebHook = null
            this.webHookEditDialog = false
            this.isNewWebHook = false
            this.$refs.webHook[index].clearValidate()
          } else {
            return false
          }
        })
      }
    }
  }
</script>
