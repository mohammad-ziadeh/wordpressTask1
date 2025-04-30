<template id="picture-upload">
  <div class="am-profile-photo" @click="openMediaModal">
    <i
        class="el-icon-delete" @click="(e) => removeImage(e)"
       v-if="deleteIconVisibility"
    ></i>
    <i :class="{ 'el-icon-plus': entityName === 'gallery', 'el-icon-picture': entityName !== 'gallery' }"></i>
    <span v-if="entityName === 'gallery'">{{ $root.labels.add_image }}</span>
    <img v-if="entityName !== 'gallery'" :src="getPictureSrc" alt="">
  </div>
</template>

<script>
  export default {

    template: '#picture-upload',

    props: {
      deleteIconVisibility: false,
      editedEntity: null,
      entityName: '',
      multiple: false
    },

    data: () => ({
      pictureFullPath: '',
      pictureThumbPath: ''
    }),

    mounted () {

    },

    methods: {
      removeImage (e) {
        e.stopPropagation()

        this.pictureFullPath = ''
        this.pictureThumbPath = ''

        this.$emit('deleteImage')
      },

      openMediaModal () {
        var frame
        var $this = this

        if (frame) {
          frame.open()
          return
        }

        // eslint-disable-next-line no-undef
        frame = wp.media({
          title: 'Select or Upload Profile Picture',
          button: {
            text: 'Select picture'
          },
          multiple: this.multiple,
          library: {
            type: 'image'
          }
        })

        frame.on('select', function () {
          let selection = frame.state().get('selection')
          let attachment = null

          selection.forEach(function (item) {
            attachment = item.toJSON()

            $this.pictureFullPath = attachment.url
            $this.pictureThumbPath = attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url
            $this.$emit('pictureSelected', $this.pictureFullPath, $this.pictureThumbPath)
          })
        })

        frame.open()
      }

    },

    computed: {

      getPictureSrc: function () {
        if (this.editedEntity !== null && !this.pictureThumbPath && !!this.editedEntity.pictureThumbPath) {
          return this.editedEntity.pictureThumbPath
        }

        return this.pictureThumbPath && this.entityName !== 'gallery'
          ? this.pictureThumbPath : this.$root.getUrl + 'public/img/default-' + this.entityName + '.svg'
      }

    }

  }
</script>
