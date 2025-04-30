<template>
    <div class="am-gallery-images">
        <div class="am-event-section-title">{{label}}</div>
        <el-row :gutter="24">
            <draggable v-model="clonedGallery" :options="draggableOptions" @end="dropGalleryImage">
                <el-col :sm="12" v-for="(galleryImage, index) in clonedGallery" :key="index">
                    <div class="am-gallery-image-wrapper">
                        <div class="am-gallery-image"
                             :style="{'background-image': 'url(' + galleryImage.pictureFullPath + ')'}">
                            <i class="el-icon-delete" @click="deleteGalleryImage(index)"></i>
                        </div>
                        <div class="am-gallery-image-title">
                      <span class="am-drag-handle">
                        <img class="svg-amelia" width="20px" :src="$root.getUrl+'public/img/burger-menu.svg'">
                      </span>
                            <span>{{ galleryImage.pictureFullPath.substring(galleryImage.pictureFullPath.lastIndexOf('/')+1) }}</span>
                        </div>
                    </div>
                </el-col>
            </draggable>

            <!-- Add Gallery -->
            <el-col :sm="12">
                <div class="am-gallery-image-add">

                    <div>
                        <picture-upload
                                :multiple="true"
                                :edited-entity="null"
                                :entity-name="'gallery'"
                                @pictureSelected="galleryPictureSelected"
                        >
                        </picture-upload>
                    </div>
                </div>
            </el-col>

        </el-row>
    </div>
</template>

<script>
  import imageMixin from '../../../js/common/mixins/imageMixin'
  import Draggable from 'vuedraggable'
  import PictureUpload from '../parts/PictureUpload.vue'

  export default {

    mixins: [imageMixin],

    props: {
      label: null,
      gallery: null
    },

    data () {
      return {
        clonedGallery: null,
        draggableOptions: {
          animation: 150,
          group: 'people',
          handle: '.am-drag-handle'
        }
      }
    },

    mounted () {
      this.clonedGallery = JSON.parse(JSON.stringify(this.gallery))
    },

    methods: {
      galleryPictureSelected (pictureFullPath, pictureThumbPath) {
        this.clonedGallery.push({
          id: 0,
          pictureFullPath: pictureFullPath,
          pictureThumbPath: pictureThumbPath,
          position: this.clonedGallery.length + 1
        })

        this.$emit('galleryUpdated', this.clonedGallery)
      },

      deleteGalleryImage (index) {
        this.clonedGallery.splice(index, 1)

        for (let i = 0; i < this.clonedGallery.length; i++) {
          this.clonedGallery[i].position = i + 1
        }

        this.$emit('galleryUpdated', this.clonedGallery)
      },

      dropGalleryImage (e) {
        if (e.newIndex !== e.oldIndex) {
          let that = this

          this.clonedGallery.forEach((image) => {
            image.position = that.clonedGallery.indexOf(image) + 1
          })
        }

        this.$emit('galleryUpdated', this.clonedGallery)
      }
    },

    components: {
      PictureUpload,
      Draggable
    }

  }
</script>