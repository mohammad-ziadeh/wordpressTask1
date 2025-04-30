<template>
  <div id="am-whats-new" class="am-wrap">
    <div class="am-body">

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

      <div class="am-whats-new-changelog am-section am-whats-new-section">

        <div class="am-whats-new-changelog-left">

          <div class="am-whats-new-changelog-header">
            <div class="am-whats-new-changelog-title am-whats-new-blog-title-text">
              {{ $root.labels.amelia_changelog }}
            </div>
            <div class="am-whats-new-changelog-subtitle am-whats-new-blog-subtitle-text">
              {{ $root.labels.current_version }} {{ changelog.version }}
            </div>
          </div>

          <div class="am-whats-new-changelog-version">
            <div class="am-whats-new-changelog-version-title">
              {{ $root.labels.version }} {{ changelog.version }}
            </div>
            <div class="am-whats-new-changelog-subtitle am-whats-new-blog-subtitle-text">
              {{ $root.labels.version_subtitle }}
            </div>
          </div>

          <div class="am-whats-new-changelog-list">

            <p class="am-whats-new-changelog-list-title">{{$root.labels.included_plan_your}}</p>
            <div class="am-whats-new-changelog-list-item" v-for="(item, index) in getLicencesItems(getThisAndLowerLicences())" :key="item.licence + item.type + index">
              <div class="am-whats-new-changelog-list-item-img-holder">
                <img v-if="item.type" :src="$root.getUrl+`public/img/am-${getIconType(item.type)}.svg`" />
              </div>

              <div v-if="item.text" class="am-whats-new-blog-subtitle-text" v-html="item.text.replace(':','')"></div>
            </div>

            <p class="am-whats-new-changelog-list-title" v-if="!$root.licence.isDeveloper && getLicencesItems(getHigherLicences()).length">{{$root.labels.included_plan_higher}}</p>
            <div v-if="!$root.licence.isDeveloper" class="am-whats-new-changelog-list-item" v-for="(item, index) in getLicencesItems(getHigherLicences())" :key="index">
              <div class="am-whats-new-changelog-list-item-img-holder">
                <img v-if="item.type" :src="$root.getUrl+`public/img/am-${getIconType(item.type)}.svg`" />
              </div>

              <div v-if="item.text" class="am-whats-new-blog-subtitle-text" v-html="item.text.replace(':','')"></div>
            </div>

            <a class="am-whats-new-changelog-link" href="https://wpamelia.com/changelog/" target="_blank" rel="nofollow">
              {{ $root.labels.see_previous_versions }}
              <img :src="$root.getUrl+'public/img/am-arrow-upper-right.svg'" />
            </a>

          </div>

        </div>

        <div class="am-whats-new-changelog-right">

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
                <form ref="emailForm" @submit.prevent="submitForm" action="https://acumbamail.com/newform/subscribe/ET8rshmNeLvQox6J8U99sSJZ8B1DZo1mhOgs408R0mHYiwgmM/39828/" method="post" class="am-whats-new-blog-subscribe-form">
                  <div class="">
                    <div style="width: 100%; position:relative;">
                      <span v-if="!isValidEmail" id="am-subscribe-error-msg" style="color: red;">Please enter a valid email address.</span><br>
                      <input v-model="email" @keyup="clearValidation" id="r0c0m1i1" name="email_1" type="email" :placeholder="$root.labels.enter_your_email" required=""/><br />
                      <!-- Do not delete the following fields, is important in order to protect you from spam :)
                                               No borres los siguientes campos, es importante para protegerte del spam :)  -->


                      <input type="text" name="a781911c" tabindex="-1" value="" style="position: absolute; left: -4900px;" aria-hidden="true" id="a781911c" autocomplete="off"/>
                      <br />

                      <input type="email" name="b781911c" tabindex="-1" value="" style="position: absolute; left: -5000px;" aria-hidden="true" id="b781911c" autocomplete="off"/>
                      <br />

                      <input type="checkbox" name="c781911c" tabindex="-1" style="position: absolute; left: -5100px;" aria-hidden="true" id="c781911c" autocomplete="off"/>
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
              {{ $root.labels.need_help }}
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

    </div>
  </div>
</template>

<script>
 import PageHeader from '../parts/PageHeader.vue'

export default {

   data () {
     return {
       email: '',
       isValidEmail: true,
       blogPosts: [],
       changelog: {
         version: '8.2.1',
         starter: {
           feature: [
           ],
           improvement: [
           ],
           translations: [
           ],
           bugfix: [
             'Fixed issue with time slots that include buffer times spanning two days, particularly around midnight',
             'Fixed issue with adding blocked customers to events'
           ],
           other: [
             'Other small bug fixes and stability improvements'
           ]
         },
         basic: {
           feature: [
           ],
           improvement: [
           ],
           translations: [
             'Updated French translation'
           ],
           bugfix: [
             'Fixed issue with the Step by step form when Google is connected and different timezones',
             'Fixed issue with canceled appointments and booking new with different location',
             'Fixed issue with Stripe 3D Secure payments',
             'Fixed issue with deleting an employee added as Organizer to an event'
           ],
           other: [
           ]
         },
         pro: {
           feature: [
           ],
           improvement: [
           ],
           translations: [
           ],
           bugfix: [
             'Fixed issue with WooCommerce order details when recurring/cart appointments updated'
           ],
           other: [
           ]
         },
         developer: {
           feature: [
           ],
           improvement: [
           ],
           translations: [
           ],
           bugfix: [
           ],
           other: [
           ]
         }
       },
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

     getThisAndLowerLicences () {
       if (this.$root.licence.isStarter) {
         return ['starter']
       } else if (this.$root.licence.isBasic) {
         return ['starter', 'basic']
       } else if (this.$root.licence.isPro) {
         return ['starter', 'basic', 'pro']
       } else if (this.$root.licence.isDeveloper) {
         return ['starter', 'basic', 'pro', 'developer']
       }
     },

     getHigherLicences () {
       if (this.$root.licence.isStarter) {
         return ['basic', 'pro', 'developer']
       } else if (this.$root.licence.isBasic) {
         return ['pro', 'developer']
       } else if (this.$root.licence.isPro) {
         return ['developer']
       } else if (this.$root.licence.isDeveloper) {
         return []
       }
     },

     getLicencesItems (licences) {
       let items = []

       licences.forEach((licence) => {
         this.changelog[licence].feature.forEach((item) => {
           items.push({
             licence: licence,
             type: 'Feature',
             text: item
           })
         })
       })

       licences.forEach((licence) => {
         this.changelog[licence].improvement.forEach((item) => {
           items.push({
             licence: licence,
             type: 'Improvement',
             text: item
           })
         })
       })

       licences.forEach((licence) => {
         this.changelog[licence].translations.forEach((item) => {
           items.push({
             licence: licence,
             type: 'Translations',
             text: item
           })
         })
       })

       licences.forEach((licence) => {
         this.changelog[licence].bugfix.forEach((item) => {
           items.push({
             licence: licence,
             type: 'BugFix',
             text: item
           })
         })
       })

       licences.forEach((licence) => {
         this.changelog[licence].other.forEach((item) => {
           items.push({
             licence: licence,
             text: item
           })
         })
       })

       return items
     },

     getNews () {
       this.loading = true

       this.$http.get(`${this.$root.getAjaxUrl}/whats-new`)
         .then(response => {
           this.blogPosts = response.data.data.blogPosts ? response.data.data.blogPosts.slice(0, 6) : []

           this.loading = false
         })
         .catch(e => {
           this.loading = false
           console.log(e)
         })
     },

     getIconType (type) {
       let typeToReturn = type.toLowerCase()

       switch (typeToReturn) {
         case 'improvement':
         case 'bugfix':
         case 'feature':
         case 'translations':
           return typeToReturn
         default:
           return 'plus'
       }
     }
   },

   created () {
     this.getNews()
   },

   components: {
     PageHeader
   }
 }
</script>
