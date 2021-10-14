import * as dayjs from 'dayjs'
import * as SunCalc from 'suncalc'

const HT_OFFSET = 600 // hawaii time offset from ut time [minutes]
const KECK_LONG = -155.4747 // Keck Observatory longitude west of Greenwich [deg]
const KECK_LAT = 19.8260 //[deg]

const date_to_juld = (date: Date) => {
    return Math.floor( date.getTime()/864000 ) - (HT_OFFSET / 1440 ) + 2440587.5
}

const get_gmt = (date?: Date) => {
    /* Taken from Jean Meeus's Astronomical Algorithms textbook. Using equations
    12.1 & 12.4*/
    if (!date) date = new Date()
    const JD = date_to_juld(date)
    const T = ( JD - 2_451_545.0 ) / 36_525 // 12.1
    const Theta0 = 280.46061837 
                   + 360.98564736629 * (JD - 2451545.0) 
                   + T * T * 0.000387933 
                   - T * T * T / 38710000 // 12.4
    return Theta0
}

export const hours_to_deg = (time: string, dec = false) => {
    let [hours, min, sec] = time.split(':')
    // let sign: number = dec ? (hours[0] === '+' ? 1 : -1) : 1
    let sign = 1
    if (hours[0] === '+') hours = hours.substring(1);
    if (hours[0] === '-') hours = hours.substring(1); sign=-1
    console.log([sign, hours, min, sec])
    const deg = 360 * sign * (parseInt(hours, 10) / 24
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

export const ra_dec_to_az_alt = (ra: number, dec: number, date?: Date): [number, number] => {
    if (!date) date = new Date()
    const hourAngle = (get_gmt(date) - (Math.PI/2 * KECK_LONG) - ra) % 360
    const sinAlt =  sind(dec) * sind(KECK_LAT) 
            + cosd(dec) * cosd(KECK_LAT) * cosd(hourAngle)
    const alt = Math.asin(sinAlt)
    const cosA = ( sind(dec) - Math.sin(alt) * sind(KECK_LAT))
              / Math.cos(alt) * cosd(KECK_LAT)
    const A = Math.acos(cosA)
    const az = Math.sin(hourAngle) < 0? A: 2 * Math.PI - A
    return [ (180 / Math.PI * az ) % 360, ( 180 / Math.PI * alt ) ]
}

const linspace = (start: number, end: number, nLen: number, endpoint=true) => {
    const div = endpoint ? (nLen-1) : nLen;
    const step = (end - start) / nLen;
    return Array.from( {length: nLen}, (_, idx) => start + step * idx)
}

const addHours = (date: Date, hours: number): Date => {
    const newDate = new Date(date.getTime())
    newDate.setTime(date.getTime() + hours*60*60*1000)
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
  const deltaNadir = linspace(-5, 5, nPoints)
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
  const [alt, az]= get_target_traj(ra, dec, times)
  const airmass = alt.map( (a: number) => 1/sind(a))
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