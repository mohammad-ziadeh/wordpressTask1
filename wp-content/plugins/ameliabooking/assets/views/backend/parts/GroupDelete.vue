<template>
  <!-- Selected Popover Delete -->
  <transition name="slide-vertical">
    <div class="am-bottom-popover" v-show="checkGroupData.toaster">
      <transition name="fade">
        <el-button
            class="am-button-icon"
            @click="showDeleteConfirmation = !showDeleteConfirmation"
            v-show="!showDeleteConfirmation"
        >
          <img class="svg-amelia" :alt="$root.labels.delete" :src="$root.getUrl+'public/img/delete.svg'"/>
        </el-button>
      </transition>
      <transition name="slide-vertical">
        <div class="am-bottom-popover-confirmation" v-show="showDeleteConfirmation">
          <el-row type="flex" justify="start" align="middle">
            <h3>{{ confirmDeleteMessage }}</h3>
            <div class="align-left">
              <el-button size="small" @click="showDeleteConfirmation = !showDeleteConfirmation">
                {{ $root.labels.cancel }}
              </el-button>
              <el-button
                  size="small"
                  @click="deleteSelectedEntities"
                  type="primary"
                  :loading="deleteGroupLoading"
              >
                {{ $root.labels.delete }}
              </el-button>
            </div>
          </el-row>

        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import notifyMixin from '../../../js/backend/mixins/notifyMixin'
  import checkMixin from '../../../js/backend/mixins/checkMixin'
  import deleteMixin from '../../../js/backend/mixins/deleteMixin'

  export default {

    mixins: [notifyMixin, checkMixin, deleteMixin],

    props: {
      name: null,
      entities: null,
      checkGroupData: {
        toaster: false,
        allChecked: false
      },
      confirmDeleteMessage: '',
      successMessage: {single: '', multiple: ''},
      errorMessage: {single: '', multiple: ''}
    },

    data () {
      return {
        deleteGroupLoading: false,
        showDeleteConfirmation: false
      }
    },

    methods: {
      deleteSelectedEntities () {
        let $this = this

        this.deleteGroupLoading = true

        this.deleteEntities(
          this.entities.filter(entity => entity.checked).map(entity => entity.id),
          function () {
            $this.showDeleteConfirmation = false
            $this.deleteGroupLoading = false
            $this.$emit('groupDeleteCallback')
          },
          function (id) {},
          function (id) {}
        )
      }

    }
  }
</script>
