<template>
  <div id="am-whats-new" class="am-wrap">
    <div class="am-body">

      <dismissible-banner></dismissible-banner>

      <!-- Page Header -->
      <page-header></page-header>
      <!-- /Page Header -->

      <div class="am-whats-new-welcome am-section am-whats-new-section">

        <div class="am-whats-new-welcome-left">

          <div class="am-whats-new-welcome-title">{{ $root.labels.welcome_to_amelia }}</div>

          <div class="am-whats-new-welcome-subtitle">{{ $root.labels.welcome_congratz }}</div>

          <a class="am-whats-new-btn" href="https://www.youtube.com/c/AmeliaWordPressBookingPlugin" target="_blank">
            {{ $root.labels.discover_amelia }}
          </a>

        </div>

        <div class="am-whats-new-welcome-right">
          <img :src="$root.getUrl+'public/img/am-whats-new-welcome.webp'" />
        </div>

      </div>

      <div class="am-whats-new-blog am-section am-whats-new-section">

        <div class="am-whats-new-blog-left">

          <div class="am-whats-new-blog-title am-whats-new-blog-title-text">
            {{ $root.labels.news_blog }}<img :src="$root.getUrl+'public/img/am-ringing-bel.png'" />
          </div>

          <div class="am-whats-new-loader" v-if="loading">
            <img :src="$root.getUrl + 'public/img/spinner.svg'"/>
          </div>

          <div class="am-whats-new-blog-list" v-else>

            <div class="am-whats-new-blog-list-item" v-for="post in blogPosts" :key="post.href">
              <p>{{post.title}}</p>
              <a :href="post.href" target="_blank" rel="nofollow"><img :src="$root.getUrl+'public/img/am-arrow-upper-right.svg'" /></a>
            </div>

          </div>

          <div class="am-whats-new-blog-subscribe">

            <div class="am-whats-new-blog-subscribe-left">

              <div class="am-whats-new-blog-subscribe-title">{{ $root.labels.keep_up_to_date }}</div>
              <div class="am-whats-new-blog-subscribe-subtitle am-whats-new-blog-subtitle-text">{{ $root.labels.never_miss_notifications }}</div>
              <div class="am-whats-new-blog-subscribe-form">

                <!-- Form Acumbamail -->
                <form ref="emailForm" @submit.prevent="submitForm" action="https://acumbamail.com/newform/subscribe/ET8rshmNeLvQox6J8U99sSJZ8B1DZo1mhOgs408R0mHYiwgmM/31412/" method="post" class="am-whats-new-blog-subscribe-form">
                  <div class="">
                    <div style="width: 100%; position:relative;">
                      <span v-if="!isValidEmail" id="am-subscribe-error-msg" style="color: red;">Please enter a valid email address.</span><br>
                      <input v-model="email" @keyup="clearValidation" id="r0c0m2i1" name="email_1" type="email" :placeholder="$root.labels.enter_your_email" required=""/><br />
                      <!-- Do not delete the following fields, is important in order to protect you from spam :)
                                               No borres los siguientes campos, es importante para protegerte del spam :)  -->


                      <input type="text" name="a642138c" tabindex="-1" value="" style="position: absolute; left: -4900px;" aria-hidden="true" id="a642138c" autocomplete="off"/>
                      <br />

                      <input type="email" name="b642138c" tabindex="-1" value="" style="position: absolute; left: -5000px;" aria-hidden="true" id="b642138c" autocomplete="off"/>
                      <br />

                      <input type="checkbox" name="c642138c" tabindex="-1" style="position: absolute; left: -5100px;" aria-hidden="true" id="c642138c" autocomplete="off"/>
                      <br />
                    </div>
                  </div>
                  <input type="hidden" name="ok_redirect" id="id_redirect" value="/*You can insert the url that you want to redirect to after a valid registration here */">
                  <input type="submit" :value="$root.labels.subscribe" class="am-whats-new-btn am-subscribe-btn">
                </form>
                <!-- End Form -->
              </div>

            </div>

            <div class="am-whats-new-blog-subscribe-right">
              <img :src="$root.getUrl+'public/img/am-subscribe-box.svg'" />
            </div>

          </div>

        </div>

        <div class="am-whats-new-blog-right">

          <div class="am-whats-new-blog-support am-whats-new-blog-box">

            <img :src="$root.getUrl+'public/img/am-contact-support.svg'" />

            <div class="am-whats-new-blog-title-text">
              {{ $root.labels.have_questions }}
            </div>

            <div class="am-whats-new-blog-support-subtitle am-whats-new-blog-subtitle-text">
              {{ $root.labels.our_support_team }}
            </div>

            <a class="am-whats-new-btn" href="https://tmsplugins.ticksy.com/submit/#100012870" target="_blank">
              {{ $root.labels.contact_our_support }}
            </a>

          </div>

        </div>

      </div>

      <div class="am-whats-new-features am-section am-whats-new-section">

        <div class="am-whats-new-features-left">

          <div class="am-whats-new-features-header">
            <div class="am-whats-new-features-title am-whats-new-blog-title-text">
              {{ $root.labels.amelia_features }}
            </div>
          </div>

          <div class="am-whats-new-features-list">
            <a
              v-for="item in features"
              :key="item.icon"
              :href="`https://wpamelia.com/${item.url}`"
              class="am-whats-new-features-item"
              target="_blank"
              rel="nofollow"
            >
              <img :alt="item.name" :src="$root.getUrl+`public/img/${item.icon}.svg`" />
              <span>
                  {{item.name}}
                </span>
            </a>
          </div>
        </div>

        <div class="am-whats-new-features-right">

          <div class="am-whats-new-blog-success-stories am-whats-new-blog-box">

            <img :src="$root.getUrl+'public/img/am-success-stories.webp'" />

            <div class="am-whats-new-blog-success-stories-title am-whats-new-blog-title-text">
              {{ $root.labels.take_a_look }}
            </div>

            <a class="am-whats-new-btn" href="https://wpamelia.com/success-stories/" target="_blank" rel="nofollow">
              {{ $root.labels.read_success_stories }}
            </a>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import PageHeader from '../parts/PageHeader.vue'
import DismissibleBanner from '../parts/DismissibleBanner.vue'

export default {

  data () {
    return {
      email: '',
      isValidEmail: true,
      blogPosts: [],
      features: [
        {
          icon: 'am-email-blue',
          name: this.$root.labels.email_notifications,
          url: 'notifications/'
        },
        {
          icon: 'am-card-blue',
          name: this.$root.labels.online_payments,
          url: 'configuring-payments/'
        },
        {
          icon: 'am-calendar-blue',
          name: this.$root.labels.events,
          url: 'working-with-events/'
        },
        {
          icon: 'am-package-blue',
          name: this.$root.labels.packages_services,
          url: 'packages/'
        },
        {
          icon: 'am-recurr-blue',
          name: this.$root.labels.recurring_appointments,
          url: 'recurring-appointments/'
        },
        {
          icon: 'am-gcalendar',
          name: this.$root.labels.google_sync,
          url: 'configuring-google-calendar/'
        },
        {
          icon: 'am-woocommerce',
          name: this.$root.labels.wc,
          url: 'woocommerce-integration/'
        },
        {
          icon: 'am-zoom-blue',
          name: this.$root.labels.zoom_meet,
          url: 'configuring-zoom/'
        },
        {
          icon: 'am-text-blue',
          name: this.$root.labels.custom_fields,
          url: 'custom-fields/'
        },
        {
          icon: 'am-sandclock-blue',
          name: this.$root.labels.custom_service_duration,
          url: 'custom-service-duration/'
        }
      ],
      loading: false
    }
  },

  methods: {
    clearValidation () {
      this.isValidEmail = true
    },

    submitForm () {
      let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

      if (emailRegex.test(this.email)) {
        this.isValidEmail = true
        this.$refs.emailForm.submit()
      } else {
        this.isValidEmail = false
      }
    },

    getNews () {
      this.loading = true

      this.$http.get(`${this.$root.getAjaxUrl}/whats-new`)
        .then(response => {
          this.blogPosts = response.data.data.blogPosts.slice(0, 6)

          this.loading = false
        })
        .catch(e => {
          this.loading = false
          console.log(e)
        })
    }
  },

  created () {
    this.getNews()
  },

  components: {
    DismissibleBanner,
    PageHeader
  }
}
</script>
