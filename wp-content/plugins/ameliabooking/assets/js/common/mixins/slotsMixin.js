import durationMixin from './durationMixin'

export default {

  data: () => ({
  }),

  mixins: [
    durationMixin
  ],

  methods: {
    setPreferredEntitiesData (bookings) {
      let employeesIds = this.getAllEntitiesIds(bookings, 0)

      let locationsIds = this.getAllEntitiesIds(bookings, 1)

      let isSingleEmployee = employeesIds.length === 1

      let isSingleLocation = locationsIds.length === 1

      bookings.forEach((booking) => {
        if (booking.date && booking.time) {
          if (!locationsIds.length && isSingleEmployee) {
            booking.providerId = employeesIds[0]

            booking.locationId = null
          } else if (!locationsIds.length && !isSingleEmployee) {
            booking.locationId = null

            for (let i = 0; i < employeesIds.length; i++) {
              for (let j = 0; j < booking.slots[booking.time].length; j++) {
                if (booking.slots[booking.time][j][0] === employeesIds[i]) {
                  booking.providerId = employeesIds[i]

                  break
                }
              }
            }
          } else if (isSingleLocation && isSingleEmployee) {
            booking.providerId = employeesIds[0]

            booking.locationId = locationsIds[0]
          } else if (!isSingleLocation && isSingleEmployee) {
            booking.providerId = employeesIds[0]

            booking.locationId = this.getPreferredEntityId(
              booking.slots,
              booking.occupied,
              booking.time,
              booking.providerId,
              locationsIds,
              1
            )
          } else if (isSingleLocation && !isSingleEmployee) {
            booking.locationId = locationsIds[0]

            booking.providerId = this.getPreferredEntityId(
              booking.slots,
              booking.occupied,
              booking.time,
              booking.locationId,
              employeesIds,
              0
            )
          } else {
            for (let i = 0; i < locationsIds.length; i++) {
              for (let j = 0; j < employeesIds.length; j++) {
                let isPreferred = this.isPreferredLocationAndEmployee(
                  booking.slots,
                  booking.occupied,
                  booking.time,
                  locationsIds[i],
                  employeesIds[j]
                )

                if (isPreferred) {
                  booking.providerId = employeesIds[j]

                  booking.locationId = locationsIds[i]

                  return
                }
              }
            }

            for (let i = 0; i < locationsIds.length; i++) {
              for (let j = 0; j < employeesIds.length; j++) {
                for (let k = 0; k < booking.slots[booking.time].length; k++) {
                  if (booking.slots[booking.time][k][0] === employeesIds[j] &&
                    booking.slots[booking.time][k][1] === locationsIds[i]
                  ) {
                    booking.providerId = employeesIds[j]

                    booking.locationId = locationsIds[i]

                    return
                  }
                }
              }
            }
          }
        }
      })
    },

    getAllEntitiesIds (bookings, index) {
      let ids = {}

      for (let i = 0; i < bookings.length; i++) {
        if (bookings[i].date && bookings[i].time) {
          bookings[i].slots[bookings[i].time].forEach((slotData) => {
            if (slotData[index]) {
              if (!(slotData[index] in ids)) {
                ids[slotData[index]] = 0
              }

              ids[slotData[index]]++
            }
          })
        }
      }

      let sortedEntitiesIds = []

      Object.keys(ids).forEach((id) => {
        sortedEntitiesIds.push({id: parseInt(id), quantity: ids[id]})
      })

      sortedEntitiesIds.sort((a, b) => b.quantity - a.quantity)

      return sortedEntitiesIds.map(entity => entity.id)
    },

    getPreferredEntityId (availableSlots, occupiedSlots, timeString, selectedId, allIds, targetIndex) {
      let searchIndex = targetIndex ? 0 : 1

      let appointmentsStarts = {}

      Object.keys(occupiedSlots).forEach((time) => {
        occupiedSlots[time].forEach((slotData) => {
          if (slotData[searchIndex] === selectedId) {
            appointmentsStarts[this.getStringTimeInSeconds(time)] = slotData[targetIndex]
          }
        })
      })

      Object.keys(availableSlots).forEach((time) => {
        availableSlots[time].forEach((slotData) => {
          if (slotData.length >= 3 && slotData[searchIndex] === selectedId) {
            appointmentsStarts[this.getStringTimeInSeconds(time)] = slotData[targetIndex]
          }
        })
      })

      let availableIds = []

      availableSlots[timeString].forEach((slotData) => {
        if (slotData[searchIndex] === selectedId) {
          availableIds.push(slotData[targetIndex])
        }
      })

      if (Object.keys(appointmentsStarts).length) {
        let timeInSeconds = this.getStringTimeInSeconds(timeString)

        let closestSlot = Object.keys(appointmentsStarts).reduce((a, b) => {
          return Math.abs(b - timeInSeconds) < Math.abs(a - timeInSeconds) ? b : a
        })

        if (availableIds.indexOf(appointmentsStarts[closestSlot]) !== -1) {
          return appointmentsStarts[closestSlot]
        }
      }

      for (let i = 0; i < allIds.length; i++) {
        for (let j = 0; j < availableSlots[timeString].length; j++) {
          if (availableSlots[timeString][j][searchIndex] === selectedId &&
            allIds[i] === availableSlots[timeString][j][targetIndex]
          ) {
            return availableSlots[timeString][j][targetIndex]
          }
        }
      }

      return null
    },

    isPreferredLocationAndEmployee (slotsData, occupiedData, timeString, locationId, employeeId) {
      let isEmployeeLocation = false

      slotsData[timeString].forEach((slotData) => {
        if (slotData[0] === employeeId && slotData[1] === locationId) {
          isEmployeeLocation = true
        }
      })

      // inspect if employee is available on proposed location
      if (!isEmployeeLocation) {
        return false
      }

      let appointmentStarts = {
        onLocation: {},
        offLocation: {}
      }

      Object.keys(occupiedData).forEach((time) => {
        occupiedData[time].forEach((slotData) => {
          if (slotData[0] === employeeId && slotData[1] === locationId) {
            appointmentStarts.onLocation[this.getStringTimeInSeconds(time)] = slotData[1]
          } else if (slotData[0] === employeeId) {
            appointmentStarts.offLocation[this.getStringTimeInSeconds(time)] = slotData[1]
          }
        })
      })

      Object.keys(slotsData).forEach((time) => {
        slotsData[time].forEach((slotData) => {
          if (slotData.length >= 3 && slotData[0] === employeeId && slotData[1] === locationId) {
            appointmentStarts.onLocation[this.getStringTimeInSeconds(time)] = slotData[1]
          } else if (slotData.length >= 3 && slotData[0] === employeeId) {
            appointmentStarts.offLocation[this.getStringTimeInSeconds(time)] = slotData[1]
          }
        })
      })

      // inspect if employee has appointments only on proposed location, or has no appointments in that day
      if (
        (!Object.keys(appointmentStarts.onLocation).length && !Object.keys(appointmentStarts.offLocation).length) ||
        (Object.keys(appointmentStarts.onLocation).length && !Object.keys(appointmentStarts.offLocation).length)
      ) {
        return true
      }

      let timeInSeconds = this.getStringTimeInSeconds(timeString)

      appointmentStarts = Object.assign(appointmentStarts.onLocation, appointmentStarts.offLocation)

      let closestTime = Object.keys(appointmentStarts).reduce((a, b) => {
        return Math.abs(b - timeInSeconds) < Math.abs(a - timeInSeconds) ? b : a
      })

      return locationId === appointmentStarts[closestTime]
    }
  }
}
