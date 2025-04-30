<template>
<div
  class="am-survey__wrapper"
  v-if="surveyVisibility && $root.settings.role === 'admin'"
>
  <el-dialog
    class="am-survey__dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible.sync="dialogSurvey"
  >
    <template #title>
      <div class="am-survey__dialog-header">
        <span class="am-survey__dialog-header__text">
          {{ $root.labels.survey_heading }}
        </span>
        <span
          class="am-survey__dialog-header__btn"
          @click="closeForever"
        >
          {{ $root.labels.survey_close }}
        </span>
      </div>
    </template>
    <template #default>
      <div class="am-survey__dialog-content">
        <div class="am-survey__dialog-img">
          <img
            :src="`${$root.getUrl}public/img/survey/am-survey.png`"
            :alt="$root.labels.survey_heading"
          >
        </div>
        <div class="am-survey__dialog-text" v-html="$root.labels.survey_content"></div>
      </div>
    </template>
    <template #footer>
      <div class="am-survey__dialog-footer">
        <el-button type="secondary" @click="maybeLater">
          {{$root.labels.survey_maybe}}
        </el-button>
        <el-button type="primary" @click="goToSurvey">
          {{$root.labels.survey_sure}}
        </el-button>
      </div>
    </template>
  </el-dialog>

  <div
    class="am-survey__btn"
    @click="openSurvey"
  >
    <img :src="`${$root.getUrl}public/img/survey/am-clipboard.svg`">
  </div>
</div>
</template>

<script>
export default {
  name: 'AmSurvey',

  data () {
    return {
      dialogSurvey: false,
      surveyVisibility: true
    }
  },

  created () {
    this.surveyVisibility = this.$root.settings.activation.showAmeliaSurvey
  },

  methods: {
    closeForever () {
      this.dialogSurvey = false
      this.$http.post(`${this.$root.getAjaxUrl}/settings`, {activation: {showAmeliaSurvey: false}})
        .then(response => {
          this.surveyVisibility = false
        })
        .catch(e => {})
    },

    maybeLater () {
      this.dialogSurvey = false
    },

    goToSurvey () {
      this.dialogSurvey = false
      window.open('https://www.surveymonkey.com/r/VJQDLVX', '_blank')
    },

    openSurvey () {
      this.dialogSurvey = true
    }
  }
}
</script>

<style lang="less">
.am-survey {
  &__btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 32px;
    right: 104px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgb(26,44,55);
    background: linear-gradient(330deg, rgba(26,44,55,1) 0%, rgba(26,44,55,1) 47%, rgba(96,173,221,1) 54%, rgba(26,44,55,1) 61%, rgba(26,44,55,1) 100%);
    background-size: 300%;
    animation: am-survey-animation 4s infinite;
    z-index: 1000;
    box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.24), 0 0 8px 0 rgba(0, 0, 0, 0.12);

    &:hover {
      animation: unset;
      background: #1A2C37;
    }
  }

  &__dialog {
    .el-dialog {
      max-width: 484px;
      width: 100%;
      border-radius: 8px;

      &__header {
        padding: 20px 24px 24px;
      }

      &__body {
        padding: 0 24px 24px;
      }
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__text {
        font-size: 18px;
        font-weight: 600;
        line-height: 1.55556;
        color: #1A2C37;
      }

      &__btn {
        font-size: 15px;
        font-weight: 500;
        line-height: 1.6;
        color: #808A90;
        cursor: pointer;
      }
    }

    &-img {
      width: 100%;
      margin-bottom: 16px;

      img {
        width: 100%;
      }
    }

    &-text {
      div {
        font-size: 18px;
        font-weight: 500;
        line-height: 1.55556;
        color: #1A2C37;
        margin-bottom: 4px;
      }

      span {
        display: block;
        font-size: 15px;
        font-weight: 500;
        line-height: 1.6;
        color: #1A2C37;
        word-break: break-word;
      }
    }
  }
}

@keyframes am-survey-animation {
  0% {
    transform: scale(1);
    background-position: 100% 0;
  }
  15% {
    transform: scale(1.05);
  }
  20% {
    background-position: -20% 0;
  }
  30% {
    transform: scale(1);
  }
  100% {
    background-position: -20% 0;
  }
}
</style>