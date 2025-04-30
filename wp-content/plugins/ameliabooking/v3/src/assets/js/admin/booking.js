function useParams (store, cabinetType) {
  return {
    source: 'cabinet-' + cabinetType.value,
    timeZone: store.getters['cabinet/getTimeZone'],
  }
}

function useCustomFieldsData(bookings, userType) {
  let result = []

  bookings.forEach((booking) => {
    if (['approved', 'pending'].includes(booking.status) && booking.customFields) {
      let customFields = JSON.parse(booking.customFields)

      Object.keys(customFields).forEach((customFieldId) => {
        let value = customFields[customFieldId].type === 'file'
          ? (customFields[customFieldId]?.value ? customFields[customFieldId].value : '')
          : customFields[customFieldId].value

        if (Array.isArray(value) ? value.length : value) {
          result.push({
            label: customFields[customFieldId].label,
            value: value,
          })
        }
      })
    }
  })

  return userType === 'customer'
    ? result
    : [... new Set(result.filter(i => i.value).map(i => i.label))].map(i => new Object({label: i}))
}

function useExtrasData(bookings, bookable) {
  let result = {}

  bookings.forEach((booking) => {
    if (['approved', 'pending'].includes(booking.status)) {
      booking.extras.forEach((bookingExtra) => {
        if (!(bookingExtra.extraId in result)) {
          result[bookingExtra.extraId] = {
            quantity: 0,
            price: bookingExtra.price,
            name: bookable.extras.find(i => i.id === bookingExtra.extraId).name,
          }
        }

        result[bookingExtra.extraId].quantity = result[bookingExtra.extraId].quantity + bookingExtra.quantity
      })
    }
  })

  return result
}

export {
  useParams,
  useCustomFieldsData,
  useExtrasData,
}
