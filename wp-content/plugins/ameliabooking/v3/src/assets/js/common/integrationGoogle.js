import httpClient from "../../../plugins/axios";
import {useRemoveUrlParameter, useUrlQueryParams} from "./helper";
import {useAuthorizationHeaderObject} from "../public/panel";

function useGoogleSync (code, successCallback) {
  let redirectURL = useRemoveUrlParameter(
    useRemoveUrlParameter(
      useRemoveUrlParameter(
        window.location.href,
        'code'
      ),
      'state'
    ),
    'scope'
  )

  httpClient.post(
    '/google/authorization/token',
    {
      authCode: code,
      userId: useUrlQueryParams(window.location.href)['state'],
      redirectUri: redirectURL
    }
  ).then(() => {
    history.pushState(null, null, redirectURL)
  }).catch((error) => {
    console.log(error)
  }).finally(() => {
    successCallback()
  })
}

function useGoogleConnect (store) {
  if (!store.getters['auth/getGoogleLoading']) {
    store.commit('auth/setGoogleLoading', true)

    httpClient.get(
      '/google/authorization/url/' + store.getters['employee/getId'],
      Object.assign(
        {
          'redirectUri': window.location.href.split('?')[0],
        },
        useAuthorizationHeaderObject(store)
      )
    ).then((response) => {
      window.location.href = response.data.data.authUrl.replace(
        /redirect_uri=.+?&/,
        'redirect_uri=' + window.location.href + '&'
      )
    }).catch((error) => {
      console.log(error)

      store.commit('auth/setGoogleLoading', false)
    })
  }
}

function useGoogleDisconnect (store) {
  store.commit('auth/setGoogleLoading', true)

  httpClient.post(
    '/google/disconnect/' + store.getters['employee/getId']
  ).then(() => {
    store.commit('employee/setGoogleId', null)
    store.commit('employee/setGoogleCalendarId', '')
    store.commit('employee/setGoogleToken', null)
    store.commit('auth/setGoogleCalendars', [])
  }).catch((error) => {
    console.log(error)
  }).finally(() => {
    store.commit('auth/setGoogleLoading', false)
  })
}

export {
  useGoogleSync,
  useGoogleConnect,
  useGoogleDisconnect,
}
