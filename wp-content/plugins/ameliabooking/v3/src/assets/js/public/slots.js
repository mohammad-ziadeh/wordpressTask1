import moment from "moment";
import httpClient from "../../../plugins/axios";
import {useSortedDateStrings, useUrlParams} from "../common/helper";
import {settings} from "../../../plugins/settings";
import {useAvailableSlots, useDuration} from "../common/appointments";
import {useCartItem} from "./cart";

function useLocalFromUtcSlots (slots) {
  let formattedSlots = {}

  for (let date in slots) {
    for (let time in slots[date]) {
      let dateTime = moment
        .utc(date + ' ' + time, 'YYYY-MM-DD HH:mm')
        .local()
        .format('YYYY-MM-DD HH:mm')
        .split(' ')

      if (!(dateTime[0] in formattedSlots)) {
        formattedSlots[dateTime[0]] = {}
      }

      formattedSlots[dateTime[0]][dateTime[1]] = slots[date][time]
    }
  }

  return formattedSlots
}

function useAppointmentParams (store) {
  let employeeId = store.getters['booking/getEmployeeId']

  return {
    queryTimeZone: settings.general.showClientTimeZone ? Intl.DateTimeFormat().resolvedOptions().timeZone : null,
    monthsLoad: 1,
    locationId: store.getters['booking/getLocationId'],
    serviceId: store.getters['booking/getServiceId'],
    serviceDuration: store.getters['booking/getBookingDuration'],
    providerIds: !employeeId ? store.getters['entities/filteredEmployees'](
      store.getters['booking/getSelection']
    ).map(item => item.id) : [employeeId],
    extras: JSON.stringify(
      store.getters['entities/getService'](
        store.getters['booking/getServiceId']
      ).extras.map(
        extra => extra.quantity ? (
          {
            id: extra.id,
            quantity: extra.quantity
          }
        ) : null
      ).filter(
        extra => extra !== null
      )
    ),
    group: 1,
    page: 'booking',
    persons: store.getters['booking/getBookingPersons']
  }
}

function useAppointmentSlots (params, fetchedSlots, callback, customCallback) {
  httpClient.get(
    '/slots',
    {params: useUrlParams(params)}
  ).then(response => {
    let resultSlots = 'queryTimeZone' in params && params.queryTimeZone
      ? useLocalFromUtcSlots(response.data.data.slots) : response.data.data.slots

    let slots = fetchedSlots !== null ? fetchedSlots : resultSlots

    if (fetchedSlots !== null) {
      Object.keys(resultSlots).forEach((date) => {
        slots[date] = resultSlots[date]
      })
    }

    let occupied = 'queryTimeZone' in params && params.queryTimeZone
      ? useLocalFromUtcSlots(response.data.data.occupied) : response.data.data.occupied

    callback(
      slots,
      occupied,
      response.data.data.minimum,
      response.data.data.maximum,
      response.data.data.busyness,
      response.data.data.appCount,
      {providerId: response.data.data.lastProvider, fromBackend: true},
      customCallback
    )
  })
}

function useRange(store) {
  return store.getters['booking/getMultipleAppointmentsRange']
}

function useSelectedDuration(store, value) {
  let cartItem = useCartItem(store)

  store.commit('booking/setDuration', value)

  let service = store.getters['entities/getService'](cartItem.serviceId)

  let extrasIds = store.getters['booking/getSelectedExtras'].map(i => i.extraId)

  return useDuration(value, service.extras.filter(i => extrasIds.includes(i.id)))
}

function useSelectedDate(store, date, range) {
  store.commit('booking/setMultipleAppointmentsDate', date)

  store.commit('booking/setMultipleAppointmentsRange', range)

  return useAvailableSlots(store)
}

function useSelectedTime(store, time) {
  store.commit('booking/setMultipleAppointmentsTime', time)
}

function useDeselectedDate(store) {
  let cartItem = useCartItem(store)

  store.commit('booking/unsetMultipleAppointmentsData', cartItem.index)
}

function useSlotsCallback(
  store,
  slots,
  occupied,
  minimumDateTime,
  maximumDateTime,
  busyness,
  appCount,
  lastBookedProviderId,
  searchStart,
  searchEnd
) {
  store.commit('booking/setMultipleAppointmentsSlots', slots)
  store.commit('booking/setMultipleAppointmentsOccupied', occupied)
  store.commit('booking/setMultipleAppointmentsLastDate', maximumDateTime)
  store.commit('booking/setBusyness', busyness)
  store.commit('booking/setLastBookedProviderId', lastBookedProviderId)
  store.commit('booking/setMultipleAppointmentsAppCount', appCount)

  let result = {}

  let cartItem = useCartItem(store)

  let activeService = cartItem.services[cartItem.serviceId]

  if (cartItem.index !== '' && activeService.list.length) {
    let dates = useSortedDateStrings(Object.keys(slots))

    result['calendarStartDate'] = activeService.list[cartItem.index].date
      ? activeService.list[cartItem.index].date : (dates.length ? dates[0] : null)

    if (!(activeService.list[cartItem.index].date in slots)) {
      store.commit('booking/setMultipleAppointmentsDate', null)
      store.commit('booking/setMultipleAppointmentsTime', null)

      result['calendarEventSlot'] = ''

      result['calendarEventSlots'] = []

    } else if (activeService.list.length &&
      !(activeService.list[cartItem.index].time in slots[activeService.list[cartItem.index].date])
    ) {
      store.commit('booking/setMultipleAppointmentsTime', null)

      result['calendarEventSlot'] = ''
    }

    if (activeService.list.length &&
      activeService.list[cartItem.index].date &&
      (searchStart.value ? moment(activeService.list[cartItem.index].date).isSameOrAfter(searchStart.value) : true) &&
      (searchEnd.value ? moment(activeService.list[cartItem.index].date).isSameOrBefore(searchEnd.value) : true)
    ) {
      if (activeService.list[cartItem.index].date in activeService.slots) {
        let availableSlots = useAvailableSlots(store)

        result['calendarEventSlots'] = availableSlots.length ?
          availableSlots : Object.keys(activeService.slots[activeService.list[cartItem.index].date])

        if (activeService.list[cartItem.index].time) {
          result['calendarEventSlot'] = activeService.list[cartItem.index].time
        }
      }
    }
  }

  return result
}

export {
  useRange,
  useSelectedDuration,
  useSelectedDate,
  useSelectedTime,
  useDeselectedDate,
  useSlotsCallback,
  useAppointmentSlots,
  useAppointmentParams,
}
