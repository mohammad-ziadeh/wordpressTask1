/* eslint-disable */
import VueRouter from 'vue-router'

let routes = [
  {
    path: '/dashboard',
    name: 'wpamelia-dashboard',
    meta: {title: wpAmeliaLabels.dashboard},
    component: () => import(/* webpackChunkName: "dashboard" */ '../../views/backend/dashboard/Dashboard')
  },

  {
    path: '/calendar',
    name: 'wpamelia-calendar',
    meta: {title: wpAmeliaLabels.calendar},
    component: () => import(/* webpackChunkName: "calendar" */ '../../views/backend/calendar/Calendar')
  },

  {
    path: '/appointments',
    name: 'wpamelia-appointments',
    meta: {title: wpAmeliaLabels.appointments},
    component: () => import(/* webpackChunkName: "appointments" */ '../../views/backend/appointments/Appointments')
  },

  {
    path: '/events',
    name: 'wpamelia-events',
    meta: {title: wpAmeliaLabels.events},
    component: () => import(/* webpackChunkName: "events" */ '../../views/backend/events/Events')
  },

  {
    path: '/employees',
    name: 'wpamelia-employees',
    meta: {title: wpAmeliaLabels.employees},
    component: () => import(/* webpackChunkName: "employees" */ '../../views/backend/employees/Employees')
  },

  {
    path: '/services',
    name: 'wpamelia-services',
    meta: {title: wpAmeliaLabels.services},
    component: () => import(/* webpackChunkName: "services" */ '../../views/backend/services/Services')
  },

  {
    path: '/locations',
    name: 'wpamelia-locations',
    meta: {title: wpAmeliaLabels.locations},
    component: () => import(/* webpackChunkName: "locations" */ '../../views/backend/locations/Locations')
  },

  {
    path: '/customers',
    name: 'wpamelia-customers',
    meta: {title: wpAmeliaLabels.customers},
    component: () => import(/* webpackChunkName: "customers" */ '../../views/backend/customers/Customers')
  },

  {
    path: '/notifications',
    name: 'wpamelia-notifications',
    meta: {title: wpAmeliaLabels.notifications},
    component: () => import(/* webpackChunkName: "notifications" */ '../../views/backend/notifications/Notifications')
  },
  {
    path: '/customize',
    name: 'wpamelia-customize',
    meta: {title: wpAmeliaLabels.customize},
    component: () => import(/* webpackChunkName: "customize" */ '../../views/backend/customize/Customize')
  },
  {
    path: '/finance',
    name: 'wpamelia-finance',
    meta: {title: wpAmeliaLabels.finance},
    component: () => import(/* webpackChunkName: "finance" */ '../../views/backend/finance/Finance')
  },
  {
    path: '/settings',
    name: 'wpamelia-settings',
    meta: {title: wpAmeliaLabels.settings},
    component: () => import(/* webpackChunkName: "settings" */ '../../views/backend/settings/Settings')
  },
  {
    path: '/cf',
    name: 'wpamelia-cf',
    meta: {title: 'Custom Fields'},
    component: () => import(/* webpackChunkName: "cf" */ '../../views/backend/cf/CustomFields')
  },
  {
    path: '/whats-new',
    name: 'wpamelia-whats-new',
    meta: {title: 'What\'s New'},
    component: () => import(/* webpackChunkName: "whats-new" */ '../../views/backend/whatsNew/WhatsNewLite.vue')
  },
  {
    path: '/lite-vs-premium',
    name: 'wpamelia-lite-vs-premium',
    meta: {title: 'Lite vs Premium'},
    component: () => import(/* webpackChunkName: "lite-vs-premium" */ '../../views/backend/liteVsPremium/LiteVsPremium.vue')
  }
]

export default new VueRouter({
  routes,
  linkActiveClass: 'is-active'
})
