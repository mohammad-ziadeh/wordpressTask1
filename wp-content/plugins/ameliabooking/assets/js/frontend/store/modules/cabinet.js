import VueCookies from 'vue-cookies'

const getDefaultState = () => {
  return {
    headerErrorMessage: '',
    dialogButtonSpinner: false,
    submitButtonSpinner: false,
    fetchedAppointments: false,
    fetchedPackageAppointments: false,
    fetchedEvents: false,
    activeTab: 'appointments',
    clonedProfile: null,
    ameliaToken: null,
    cabinetType: '',
    settingsName: '',
    editedAppointmentId: 0,
    editedEventId: 0,
    isWpUser: false,
    display: {
      login: false,
      forgotPassword: false,
      changePassword: false,
      cabinetDashboard: false,
      dialogDeleteProfile: false,
      dialogCancelAppointment: false,
      dialogRescheduleAppointment: false,
      dialogAppointment: false,
      dialogEvent: false,
      dialogAttendees: false,
      setPassword: false
    },
    login: {
      email: '',
      password: ''
    },
    profile: {},
    params: {
      dates: null
    },
    timeZone: '',
    editCategorizedServiceList: null,
    editWeekDayList: [],
    futureAppointments: null,
    isUserAuthenticated: false,
    loadingAuthentication: false
  }
}

const state = getDefaultState()

// noinspection JSUnusedGlobalSymbols
const getters = {}

// noinspection JSUnusedGlobalSymbols
const mutations = {
  setHeaderErrorMessage (state, value) {
    state.headerErrorMessage = value
  },

  setDialogButtonSpinner (state, value) {
    state.dialogButtonSpinner = value
  },

  setSubmitButtonSpinner (state, value) {
    state.submitButtonSpinner = value
  },

  setFetchedAppointments (state, value) {
    state.fetchedAppointments = value
  },

  setFetchedPackageAppointments (state, value) {
    state.fetchedPackageAppointments = value
  },

  setFetchedEvents (state, value) {
    state.fetchedEvents = value
  },

  setActiveTab (state, value) {
    state.activeTab = value
  },

  setClonedProfile (state, value) {
    state.clonedProfile = value
  },

  setAmeliaToken (state, value) {
    state.ameliaToken = value
  },

  setCabinetType (state, value) {
    state.cabinetType = value
  },

  setSettingsName (state, value) {
    state.settingsName = value
  },

  setEditedAppointmentId (state, value) {
    state.editedAppointmentId = value
  },

  setEditedEventId (state, value) {
    state.editedEventId = value
  },

  setIsWpUser (state, value) {
    state.isWpUser = value
  },

  setTimeZone (state, value) {
    state.timeZone = value
  },

  setDisplayProperty (state, payload) {
    state.display[payload.property] = payload.value
  },

  setLoginEmail (state, value) {
    state.login.email = value
  },

  setLoginPassword (state, value) {
    state.login.password = value
  },

  setProfile (state, payload) {
    state.profile = payload
  },

  setProfileProperty (state, payload) {
    state.profile[payload.property] = payload.value
  },

  setParams (state, payload) {
    state.params = payload
  },

  setEditWeekDayList (state, payload) {
    state.editWeekDayList = payload
  },

  setEditCategorizedServiceList (state, payload) {
    state.editCategorizedServiceList = payload
  },

  setFutureAppointments (state, payload) {
    state.futureAppointments = payload
  },

  setIsUserAuthenticated (state, value) {
    state.isUserAuthenticated = value
  },

  setStripeProvider (state, value) {
    state.stripeProvider = value
  },

  setLoadingAuthentication (state, value) {
    state.loadingAuthentication = value
  }
}

const actions = {
  logout ({commit, state}, settings) {
    if (settings.roles[state.settingsName].loginEnabled) {
      commit('setDisplayProperty', {property: 'login', value: true})
    } else {
      commit('setDisplayProperty', {property: 'forgotPassword', value: true})
    }

    commit('setDisplayProperty', {property: 'cabinetDashboard', value: false})
    commit('setIsUserAuthenticated', false)
    commit('setLoadingAuthentication', false)
    commit('setAmeliaToken', null)
    VueCookies.remove('ameliaToken')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
