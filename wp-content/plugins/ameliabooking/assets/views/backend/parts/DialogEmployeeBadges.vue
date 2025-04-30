<template>
  <div>

    <div class="am-dialog-scrollable">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="14">
            <h2>{{ $root.labels.manage_employee_badges }}</h2>
          </el-col>
          <el-col :span="10" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <div class="am-create-badge-form">
        <el-row>
          <p class="am-create-badge-form-title">
            {{ $root.labels.create_new_badge }}
          </p>
        </el-row>
        <el-row>
          <el-col :sm="10" :xs="24" :style="{paddingRight: '8px'}">
            <p class="am-label">{{ $root.labels.badge_label }}</p>
            <el-input
                class="calc-width"
                placeholder="Enter label"
                v-model="newBadge.content"
                size="medium"
            >
            </el-input>
          </el-col>
          <el-col :sm="10" :xs="24":style="{padding: '0 8px'}">
            <p class="am-label">{{ $root.labels.badge_color }}</p>
            <el-input
                class="calc-width"
                placeholder="Enter label"
                v-model="newBadge.color"
                size="medium"
            >
              <template slot="suffix">
                <el-color-picker size="medium" v-model="newBadge.color" :show-alpha="true"></el-color-picker>
              </template>
            </el-input>
          </el-col>
          <el-col :sm="4" :xs="12" :style="{paddingLeft: '8px'}">
            <el-button
              :disabled="!newBadge.content"
              size="medium"
              @click="addBadge"
              class="am-create-badge-form-add-btn"
            >
              {{ $root.labels.add }}
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="am-badge-list">
        <div class="am-event-translate" @click="showDialogTranslate('badges')" style="display: inline-block;float: right;cursor: pointer;">
          <img class="am-dialog-translate-svg" width="16px" :src="$root.getUrl+'public/img/translate.svg'">
          {{ $root.labels.translate }}
        </div>

        <div class="am-badge-list-items">
          <el-collapse v-for="badge in badgeArray.badges" :key="badge.id">
            <el-collapse-item
                class="am-badge-item"
                style=""
            >
              <template slot="title">
                <div class="am-delete-element" @click="deleteBadge(badge.id)">
                  <img :src="$root.getUrl + 'public/img/delete.svg'">
                </div>
                <div class="am-badge-content" :style="{border: `1px solid ${badge.color + '66'}`, background: badge.color}">
                  <span class="am-badge-content-text">{{ badge.content }}</span>
                </div>
              </template>
              <div>

                <el-row :gutter="24">
                  <el-col :sm="12">
                    <p class="am-label">{{ $root.labels.badge_label }}</p>
                    <el-input
                        class="calc-width"
                        placeholder="Enter label"
                        v-model="badge.content"
                        size="medium"
                    >
                    </el-input>
                  </el-col>
                  <el-col :sm="12">
                    <p class="am-label">{{ $root.labels.badge_color }}</p>
                    <el-input
                        class="calc-width"
                        placeholder="Enter label"
                        v-model="badge.color"
                        size="medium"
                    >
                      <template slot="suffix">
                        <el-color-picker size="medium" v-model="badge.color" :show-alpha="true"></el-color-picker>
                      </template>
                    </el-input>
                  </el-col>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

      </div>

    </div>

    <!-- Dialog Footer -->
    <div class="am-dialog-footer">
      <div class="am-dialog-footer-actions">
        <el-row>
          <el-col :sm="24" class="align-right">
            <el-button
                type=""
                @click="closeDialog"
            >
              <span>{{ $root.labels.cancel }}</span>
            </el-button>
            <el-button
                type="primary"
                class="am-dialog-create"
                @click="onSubmit"
            >
              {{ $root.labels.save }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
import imageMixin from '../../../js/common/mixins/imageMixin'

export default {

  mixins: [imageMixin],

  props: {
    roles: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      newBadge: {
        content: '',
        color: '#3B82F6'
      },
      badgeArray: [],
      dataLoading: false,
      dialogLoading: false,
      mapForm: {},
      mapColumns: [],
      errorMessages: []
    }
  },

  mounted () {
    this.inlineSVG()
  },

  created () {
    this.badgeArray = this.roles.providerBadges
  },

  methods: {
    showDialogTranslate (type) {
      this.$emit('showDialogTranslate', type)
    },

    deleteBadge (id) {
      this.badgeArray.badges = this.badgeArray.badges.filter(b => b.id !== id)
    },

    addBadge () {
      let id = this.badgeArray.counter + 1
      this.newBadge.id = id
      this.badgeArray.badges.push(this.newBadge)
      this.newBadge = {content: '', color: '#3B82F6'}

      this.badgeArray.counter = id
    },

    loadData () {
      this.showContinue = true
      this.dataLoading = true
    },

    closeDialog () {
      this.$emit('closeDialogEmployeeBadges')
    },

    onSubmit () {
      let settingsRoles = this.roles
      settingsRoles.providerBadges = this.badgeArray

      this.$emit('closeDialogEmployeeBadges')
      this.$emit('updateSettings', {'roles': settingsRoles})
    }
  },

  components: {}
}
</script>
