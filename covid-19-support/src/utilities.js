export function businessIcon(business) {
  if (!business || !business.icon) {
    return 'fa-circle fa-xs'
  }

  if (business.icon && (business.icon.startsWith('fa-') || business.icon.startsWith('fas'))) {
    return business.icon
  }

  return 'fa-circle fa-xs'
}

export function optionIcon(option) {
  switch (option) {
    case 'acceptsmedicaid':
      return 'fa-notes-medical'
    case 'acceptsmedicare':
      return 'fa-notes-medical'
    case 'acceptsuninsuredPatients':
      return 'fa-hand-holding-medical'
    case 'curbside':
      return 'fa-car'
    case 'delivery':
      return 'fa-shipping-fast'
    case 'discountmedical':
      return 'fa-user-md'
    case 'drivethru':
      return 'fa-car-side'
    case 'familymeal':
      return 'fa-user-friends'
    case 'farmersmarket':
      return 'fa-store'
    case 'farmpick-up':
      return 'fa-truck-pickup'
    case 'free':
      return 'fa-heart'
    case 'freegroceries':
      return 'fa-shopping-basket'
    case 'freeproduce':
      return 'fa-apple-alt'
    case 'instore':
      return 'fa-store'
    case 'instorepickup':
      return 'fa-store-alt'
    case 'local':
      return 'fa-map-marker-alt'
    case 'lowcost':
      return 'fa-dollar-sign'
    case 'mealpublic':
      return 'fa-users'
    case 'mealstudent':
      return 'fa-school'
    case 'mustpreorder':
      return 'fa-phone'
    case 'orderonline':
      return 'fa-mouse'
    case 'payonline':
      return 'fa-credit-card'
    case 'safeforundocumentedindividuals':
      return 'fa-address-card'
    case 'specialhours':
      return 'fa-history'
    default:
      return 'fa-users'
  }
}

export function getAddress(marker) {
  var address = marker.address ? marker.address + ', ' : ''
  address = address + (marker.city ? marker.city + ', ' : '')
  address = address + (marker.state ? marker.state + ' ' : '')
  return address + (marker.zip ? marker.zip : '')
}

export function getShortAddress(marker) {
  var address = marker.address ? marker.address + ', ' : ''
  address = address + (marker.city ? marker.city : '')

  return address
}

// See: https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript

/**
 * Calculates the haversine distance between point A, and B.
 * @param {number[]} latlngA [lat, lng] point A
 * @param {number[]} latlngB [lat, lng] point B
 * @param {boolean} isMiles If we are using miles, else km.
 */
export function haversineDistance([lat1, lon1], [lat2, lon2], isMiles = false) {
  const toRadian = (angle) => (Math.PI / 180) * angle
  const distance = (a, b) => (Math.PI / 180) * (a - b)
  const RADIUS_OF_EARTH_IN_KM = 6371

  const dLat = distance(lat2, lat1)
  const dLon = distance(lon2, lon1)

  lat1 = toRadian(lat1)
  lat2 = toRadian(lat2)

  // Haversine Formula
  const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.asin(Math.sqrt(a))

  let finalDistance = RADIUS_OF_EARTH_IN_KM * c

  if (isMiles) {
    finalDistance /= 1.60934
  }

  return finalDistance
}

export function sortByName(a, b) {
  var nameA = a.marker.gsx$providername.$t.toUpperCase() // ignore upper and lowercase
  var nameB = b.marker.gsx$providername.$t.toUpperCase() // ignore upper and lowercase
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }

  // names must be equal
  return 0
}

export function sortByDistance(a, b) {
  if (a.distance < b.distance) {
    return -1
  }
  if (a.distance > b.distance) {
    return 1
  }

  // names must be equal
  return 0
}

export function getHoursVal(val) {
  if (!val) {
    return ''
  }

  let hours = parseInt(val.split(':')[0])
  let minutes = parseInt(val.split(':')[1])
  let t

  if (isNaN(hours)) {
    return ''
  }

  if (hours === 0) {
    hours = 12
    t = 'am'
  } else if (hours > 0 && hours < 12) {
    t = 'am'
  } else if (hours === 12) {
    t = 'pm'
  } else {
    hours = hours - 12
    t = 'pm'
  }

  minutes = !isNaN(minutes) && minutes > 0 ? ':' + minutes : ''

  return hours + minutes + ' ' + t
}
