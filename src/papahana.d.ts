export interface Base {
	_id: string
}

export interface ObservationBlock extends Base {
	_id: string,
	target?: Target,
	acquisition?: Acquisition,
	observations: Observation[],
	associations: string[],
	observation_type: string[],
	signature: Signature
	priority?: number
}

export interface Acquisition {
	instrumental_setup: string,
	acquisition_method: string,
	guider_selection?: string,
	ao_modes?: string[],
	offset_stars?: string[],
	slitmasks?: string[],
	position_angles: string[],
}

export interface Observation {
	instrument: string,
	exposure_sequences: string[],
	associations: string[],
}

export interface Signature {
	pi: string,
	semester: string,
	program: number,
	observers: string[],
	container: number
}

export interface TargetDescription {
	name: string,
	ra: string,
	dec: string,
	equinox: number,
	frame: string,
	ra_offset: number,
	dec_offset: number,
	pm_ra: number,
	pm_dec: number,
	epoch: number,
	obstime: number,
	mag: Magnitude,
	wrap?: string,
	dra: number,
	ddec: number,
	comment?: string
}

export interface Magnitude {
	band: string,
	magnitude: number,
}

