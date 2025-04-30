<template>
  <div>
    <!-- Dialog Loader -->
    <div
      v-show="passedCategory === null || dialogLoading"
      class="am-dialog-loader"
    >
      <div class="am-dialog-loader-content">
        <img :src="$root.getUrl+'public/img/spinner.svg'" class="">
        <p>{{ $root.labels.loader_message }}</p>
      </div>
    </div>

    <div
      v-if="passedCategory !== null && !dialogLoading"
      class="am-dialog-scrollable"
      :class="{'am-edit':category.id !== 0}"
    >
      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="18">
            <h2 v-if="category.id !== 0">
              {{ $root.labels.edit_category }}
            </h2>
            <h2 v-else>
              {{ $root.labels.new_category }}
            </h2>
          </el-col>
          <el-col :span="6" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>
      <!-- /Dialog Header -->

      <!-- Form -->
      <el-form :model="category" ref="category" :rules="rulesCategory" label-position="top">
        <!-- Profile Photo -->
        <div class="am-service-profile">
          <picture-upload
            :delete-icon-visibility="category.pictureThumbPath && category.pictureFullPath"
            :edited-entity="this.category"
            :entity-name="'category'"
            @pictureSelected="categoryPictureSelected"
            v-on:deleteImage="() => deleteImage(category)"
          >
          </picture-upload>

          <el-popover
            ref="color-popover"
            v-model="colorPopover"
            placement="bottom"
            width="160"
            trigger="click"
            popper-class="am-color-popover"
          >
            <span
              v-for="color in categoryColors" :key="color"
              class="am-service-color"
              :class="{ 'color-active' : '#' + color === category.color}"
              @click="changeCategoryColor"
              :data-color="'#'+color"
              :style="'background-color:#'+color"
            >
            </span>

            <el-form-item :label="$root.labels.hex + ':'">
              <el-input v-model="category.color" auto-complete="off"></el-input>
            </el-form-item>
            <div class="align-right">
              <el-button type="primary" size="mini" @click="colorPopover = false">
                {{ $root.labels.ok }}
              </el-button>
            </div>

          </el-popover>
          <span class="am-service-color" :style="bgColor(category.color)" v-popover:color-popover></span>
          <h2>{{ category.name }}</h2>
        </div>

        <!-- Name -->
        <el-form-item prop="name">
          <label slot="label">
            {{ $root.labels.name + ':' }}
            <div
              class="am-service-translate"
              @click="showDialogTranslate('categoryName')"
            >
              <img class="am-dialog-translate-svg" width="16px" :src="$root.getUrl+'public/img/translate.svg'">
              {{ $root.labels.translate }}
            </div>
          </label>
          <el-input
            id="am-category-name"
            v-model="category.name"
            auto-complete="off"
            @input="clearValidation()"
            @change="trimProperty(category, 'name')"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <dialog-actions
      v-if="!dialogLoading"
      formName="category"
      urlName="categories"
      :isNew="!passedCategory.id"
      :entity="category"
      :hasIcons="true"
      :updateStash="true"
      :getParsedEntity="getParsedEntity"
      :haveSaveConfirmation="haveSaveConfirmation"
      @validationTabFailCallback="validationTabFailCallback"
      @validationFailCallback="validationFailCallback"

      :status="{
        on: 'visible',
        off: 'hidden'
      }"

      :buttonText="{
        confirm: {
          save: {
            yes: $root.labels.update_for_all,
            no: $root.labels.no
          },
          status: {
            yes: category.status === 'visible' ? $root.labels.visibility_hide : $root.labels.visibility_show,
            no: $root.labels.visibility_show
          }
        }
      }"

      :action="{
        haveAdd: true,
        haveEdit: true,
        haveRemove: $root.settings.capabilities.canDelete === true,
        haveRemoveEffect: false,
        haveDuplicate: true
      }"

      :message="{
        success: {
          save: $root.labels.category_saved,
          remove: $root.labels.category_deleted,
        },
        confirm: {
          save: $root.labels.confirm_global_change_category,
          remove: $root.labels.delete_category_confirmation,
          duplicate: $root.labels.duplicate_category_confirmation
        },
      }"
    >
    </dialog-actions>

  </div>
</template>

<script>
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import helperMixin from '../../../js/backend/mixins/helperMixin'
  import settingsMixin from '../../../js/common/mixins/settingsMixin'
  import PictureUpload from '../parts/PictureUpload.vue'
  import Form from 'form-object'
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import DialogActions from '../parts/DialogActions.vue'
  import EntitySettings from '../parts/EntitySettings.vue'
  import DialogTranslate from '../parts/DialogTranslate'
  import ContentBlock from '../parts/ContentBlock'

  export default {
    mixins: [imageMixin, notifyMixin, helperMixin, settingsMixin],

    props: {
      passedCategory: null,
      settings: null
    },

    data () {
      return {
        executeUpdate: true,
        dialogLoading: true,
        colorPopover: false,
        form: new Form(),
        rulesCategory: {
          name: [
            {
              required: true,
              message: this.$root.labels.enter_name_warning,
              trigger: 'submit'
            }
          ]
        },
        category: null,
        categoryColors: [
          '1788FB',
          '4BBEC6',
          'FBC22D',
          'FA3C52',
          'D696B8',
          '689BCA',
          '26CC2B',
          'FD7E35',
          'E38587',
          '774DFB'
        ],
        style: ''
      }
    },

    created () {
      Form.defaults.axios = this.$http
      this.category = JSON.parse(JSON.stringify(this.passedCategory))
      this.dialogLoading = false
    },

    updated () {},

    methods: {
      validationFailCallback () {},

      closeDialog () {
        this.$emit('closeDialog')
      },

      getParsedEntity (applyGlobally) {
        return JSON.parse(JSON.stringify(this.category))
      },

      haveSaveConfirmation () {},

      bgColor (color) {
        return {'background-color': color}
      },

      categoryPictureSelected (pictureFullPath, pictureThumbPath) {
        this.category.pictureFullPath = pictureFullPath
        this.category.pictureThumbPath = pictureThumbPath
      },

      changeCategoryColor (e) {
        let siblings = Array.from(e.target.parentNode.children)
        siblings.forEach(function (sib) {
          if (sib.className.includes('color-active')) {
            sib.classList.remove('color-active')
          }
        })
        e.target.className = e.target.className + ' color-active'
        this.category.color = e.target.getAttribute('data-color')
      },

      clearValidation () {
        if (typeof this.$refs.category !== 'undefined') {
          this.$refs.category.clearValidate()
        }
      },

      showDialogTranslate (dialogType, extraIndex = 0) {
        switch (dialogType) {
          case 'categoryName':
            this.$emit('showDialogTranslate', 'name', 'category')
            break
        }
      },

      validationTabFailCallback () {}
    },

    computed: {},

    watch: {
      'passedCategory.translations' () {
        if (this.category) {
          this.category.translations = this.passedCategory.translations
        }
      }
    },

    components: {
      DialogTranslate,
      PictureUpload,
      EntitySettings,
      ContentBlock,
      DialogActions
    }
  }
</script>
