import * as dayjs from 'dayjs'
import * as SunCalc from 'suncalc'

const HT_OFFSET = 600 // hawaii time offset from ut time [minutes]
export const KECK_LONG = 360 - 155.4747 // Keck Observatory longitude west of Greenwich [deg]
const KECK_LAT = 19.8260 //[deg]

export const date_to_juld = (date: Date) => {
    return date.getTime()/86400000 + 2440587.5
}

export const get_gmt = (date?: Date) => {
    /* Taken from Jean Meeus's Astronomical Algorithms textbook. Using equations
    12.1 & 12.4*/
    if (!date) date = new Date()
    const JD = date_to_juld(date)
    const T = ( JD - 2451545.0 ) / 36525 // 12.1
    const Theta0 = 280.460_618_37 
                   + 360.98564736629 * (JD - 2451545.0) 
                   + T * T * 0.000387933 
                   - T * T * T / 38710000 // 12.4

    let gmt = Theta0 % 360 
    if (gmt < 0) gmt += 360
    return gmt 
}

export const get_gmt_bak = (date?: Date) => {
    /* Taken from Jean Meeus's Astronomical Algorithms textbook. Using equations
    12.1 & 12.3*/
    if (!date) date = new Date()
    const JD = date_to_juld(date)
    const T = ( JD - 2_451_545.0 ) / 36_525 // 12.1
    const Theta0 = 100.46061837 + 8640184.812855 * T 
    + .000387933 * T * T 
    - T * T * T / 38_710_000 // 12.4

    let gmt = Theta0 % 360 
    if (gmt < 0) gmt += 360
    return gmt 
}

export const hours_to_deg = (time: string, dec = false) => {
    let [hours, min, sec] = time.split(':')
    // let sign: number = dec ? (hours[0] === '+' ? 1 : -1) : 1
    let sign = 1
    if (hours[0] === '+') hours = hours.substring(1);
    if (hours[0] === '-') hours = hours.substring(1); sign=-1
    const deg = 15 * sign * (parseInt(hours, 10) 
        + parseInt(min, 10) / 60
        + parseInt(sec, 10) / 60)
    // const deg = 360 * sign * (JSON.parse(hours) / 24
    return deg
}

const cosd = (deg: number): number => {
    return Math.cos(Math.PI/180 * deg)
}

const sind = (deg: number): number => {
    return Math.sin(Math.PI/180 * deg)
}

const tand = (deg: number): number => {
    return Math.tan(Math.PI/180 * deg)
}

export const ra_dec_to_az_alt_bak = (ra: number, dec: number, date?: Date): [number, number] => {
    if (!date) date = new Date()
    const hourAngle = get_gmt(date) - KECK_LONG - ra
    const sinAlt =  sind(dec) * sind(KECK_LAT) 
            + cosd(dec) * cosd(KECK_LAT) * cosd(hourAngle)
    const alt = Math.asin(sinAlt)
    const cosA = ( sind(dec) - Math.sin(alt) * sind(KECK_LAT))
              / Math.cos(alt) * cosd(KECK_LAT)
    const A = Math.acos(cosA)
    const az = Math.sin(hourAngle) < 0? A: 2 * Math.PI - A
    return [ (180 / Math.PI * az ) % 360, ( 180 / Math.PI * alt ) ]
}

export const ra_dec_to_az_alt = (ra: number, dec: number, date?: Date): [number, number] => {
    /* Taken from Jean Meeus's Astronomical Algorithms textbook. Using equations
    13.3 & 13.4*/
    if (!date) date = new Date()
    const hourAngle = get_gmt(date) - KECK_LONG - ra 
    const tanAzNum =  sind(hourAngle)  
    const tanAzDen =  cosd(hourAngle) * sind(KECK_LAT) - tand(dec) * cosd(KECK_LAT)
    const az = Math.atan2(tanAzNum, tanAzDen) //radians
    const sinEl = sind(KECK_LAT) * sind(dec) + cosd(KECK_LAT) * cosd(dec) * cosd(hourAngle) 
    const el = Math.asin(sinEl) // radians
    return [ (180 / Math.PI * az ), ( 180 / Math.PI * el ) ]
}

const linspace = (start: number, end: number, nLen: number, endpoint=true) => {
    const step = (end - start) / nLen;
    return Array.from( {length: nLen}, (_, idx) => start + step * idx)
}

const addHours = (date: Date, hours: number): Date => {
    const newDate = new Date(date.getTime())
    newDate.setTime(date.getTime() + hours*3600000)
    return newDate
}

export const get_nadir = () => {
  let date = new Date()
  let times = SunCalc.getTimes(date, KECK_LAT, KECK_LONG)
  if (date < times.sunrise) { // sun has not risen yet. use yesterday.
    date.setDate( date.getDate() - 1 )
    times = SunCalc.getTimes(date, KECK_LAT, KECK_LONG)
  }
  return times.nadir
}

export const get_times = (nadir: Date, nPoints: number=20) => {
  const deltaNadir = linspace(-6, 6, nPoints)
  let times: Date[] = []
  deltaNadir.forEach( (hour: number) => {
      times.push(addHours(nadir, hour))
  })
  return times
}


export const get_target_traj = (ra: number, dec: number,  times: Date[]): [number, number][] => {
  let traj: [number, number][] = []
  times.forEach((date: Date) => {
      traj.push(ra_dec_to_az_alt(ra, dec, date))
  })
  return traj
}

export const get_air_mass = (ra: number, dec: number, times: Date[]) => {
  const azAlt = get_target_traj(ra, dec, times)
  const airmass = azAlt.map( (a: [number, number]) => { return 1/sind(90 - a[1]) })
  return airmass
}

export const parallatic_angle = (ra: number, dec: number, date: Date) => {
    const hourAngle = (get_gmt(date) - ra) % 360
    const numerator = sind(hourAngle)
    const denominator: number = tand(KECK_LAT)
                              * cosd(dec) 
                              - sind(dec) * cosd(hourAngle)
    const tanq = numerator/denominator
    return Math.atan( tanq ) % Math.PI/2
}

export const get_parallactic_angle = (ra: number, dec: number, times: Date[]): number[] => {
    let ang: number[] = []
    times.forEach( (date: Date) => {
        ang.push(parallatic_angle(ra, dec, date))
    })
    return ang
}

const angular_separation = (lon1: number, lat1: number, lon2: number, lat2: number): number => {
  const sdlon = sind(lon2 - lon1)
  const cdlon = cosd(lon2 - lon1)
  const slat1 = sind(lat1)
  const slat2 = sind(lat2)
  const clat1 = cosd(lat1)
  const clat2 = cosd(lat2)

  const numerator1 = clat2 * sdlon
  const numerator2 = clat1 * slat2 - slat1 * clat2 * cdlon
  const denominator = slat1 * slat2 + clat1 * clat2 * cdlon
  const numerator = Math.sqrt(numerator1*numerator1 + numerator2*numerator2)
  return Math.atan(numerator/denominator) % Math.PI/2
}

export const get_lunar_angle = (ra: number, dec: number, times: Date[]): number[] => {
    let ang: number[] = []
    times.forEach( (date: Date) => {
      const sc = SunCalc.getMoonPosition(date, KECK_LAT, KECK_LONG)
      const moonPos = [sc.altitude, sc.azimuth] as [number, number]
      const tgtPos = ra_dec_to_az_alt(ra, dec, date)
      const angle = angular_separation(tgtPos[1], tgtPos[0], moonPos[1], moonPos[0])
      ang.push(angle)
    })
    return ang
}