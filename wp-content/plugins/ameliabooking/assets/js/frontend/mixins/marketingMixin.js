const installFacebookPixelTracking = () => {
  if (typeof window.fbq === 'undefined') {
    !(function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js',
    );
  }
}

const hasAmeliaTracking = (marketing, id) => {
  if (typeof id === 'undefined' || id) {
    if (marketing.googleTag !== null || marketing.googleAnalytics !== null || marketing.facebookPixel !== null) {
      return true
    }
  }

  return false
}

const trackAmeliaData = ($this, marketing, reservation, type) => {
  Object.keys(marketing).forEach((analytics) => {
    if (marketing[analytics] === null || !window.wpAmeliaSettings[analytics].id) {
      return
    }

    let settings = window.wpAmeliaSettings[analytics].tracking[reservation]

    settings.filter(trackingEvent => trackingEvent.type === type).forEach((trackingEvent) => {
      let trackingEventProperties = {}

      let trackingEventData = {}

      switch (analytics) {
        case ('googleTag'): {
          trackingEventData = trackingEvent

          break
        }

        case ('googleAnalytics'):
        case ('facebookPixel'): {
          trackingEvent.data.forEach((item) => {
            if (item.key.trim() !== '' && item.value.trim() !== '') {
              trackingEventData[item.key] = item.value
            }
          })

          break
        }
      }

      Object.keys(trackingEventData).filter(property => analytics === 'googleAnalytics' || analytics === 'facebookPixel' || property !== 'type').forEach((property) => {
        let originalValue = trackingEventData[property]

        let itemProperties = originalValue.replace(/\s\s+/g, ' ').split('%').join('').split(' ')

        itemProperties.forEach((value) => {
          if (value && !Array.isArray(value) && !(typeof value === 'object') && value !== true) {
            let pathParts = value.split('_')

            let referenceObject = pathParts[0] === 'window' ? window : ($this === null ? window : $this.marketing)

            if (pathParts.length > 1) {
              pathParts.forEach((pathPart) => {
                if (typeof referenceObject !== 'undefined' && pathPart in referenceObject && referenceObject[pathPart] !== null) {
                  referenceObject = referenceObject[pathPart]
                } else {
                  return false
                }
              })

              if (!Array.isArray(referenceObject) && !(typeof referenceObject === 'object')) {
                if (value === 'payment_amount' &&
                  referenceObject.endsWith('.00') &&
                  analytics === 'googleTag' &&
                  property === 'value'
                ) {
                  referenceObject = parseInt(referenceObject)
                }

                originalValue = originalValue.split('%' + value + '%').join(referenceObject).trim()
              } else {
                originalValue = originalValue.split('%' + value + '%').join('').trim()
              }
            } else if (typeof referenceObject !== 'undefined' && value in referenceObject) {
              if (!Array.isArray(referenceObject[value]) && !(typeof referenceObject[value] === 'object')) {
                if (value === 'payment_amount' &&
                  referenceObject[value].endsWith('.00') &&
                  analytics === 'googleTag' &&
                  property === 'value'
                ) {
                  referenceObject[value] = parseInt(referenceObject[value])
                }

                originalValue = originalValue.split('%' + value + '%').join(referenceObject[value]).trim()
              } else {
                originalValue = originalValue.split('%' + value + '%').join('').trim()
              }
            }
          }
        })

        trackingEventProperties[property] = originalValue
      })

      switch (analytics) {
        case ('googleTag'): {
          marketing[analytics].event(
            trackingEventProperties.action,
            {
              event_category: trackingEventProperties.category,
              event_label: trackingEventProperties.label,
              value: trackingEventProperties.value
            }
          )

          break
        }

        case ('googleAnalytics'): {
          marketing[analytics].event(
            trackingEvent.event,
            trackingEventProperties
          )

          break
        }

        case ('facebookPixel'): {
          marketing[analytics].event(
            trackingEvent.event,
            trackingEventProperties
          )

          break
        }
      }
    })
  })
}

export default {
  installFacebookPixelTracking,
  hasAmeliaTracking,
  trackAmeliaData
}
