import { KCWIScience, InstrumentPackage, Acquisition } from './papahana.d';

export interface Container {
	_id: string,
	semester: string,
	name: string,
	observation_blocks: string[],
	comment?: string
}

export interface Semester {
    _id: string
    comment?: string
    container_list: string[]
    name: string
    sem_id: string
}
export type Method = 'get' | 'put' | 'post' | 'remove'
export type Document = ObservationBlock | Group | object
export type SourceAPI = 'papahana_demo' | 'papahana_local' | 'papahana_docker'

export type OBComponent = Target | Acquisition | Observation | Signature

export interface Base {
	comment?: string
}

export interface Status extends Base {
	executions: string[]
	state: string
}

export interface Scoby {
	row_id?: string
	sem_id?: string
	container_id?: string
	ob_id?: string
    name?: string
}

export interface ObservationBlock extends Base {
	_id: string,
	target?: Target,
	instrument?: Instruement,
	version?: string,
	science?: Science[],
	acquisition: Acquisition,
	associations: string[],
	observation_type?: string[],
	signature: Signature
	priority?: number
	status: Status 
}

export type Acquisition = DefaultAcquisition | KCWIAcquisition

export interface DefaultAcquisition extends Base {
	name: string,
	instrumental_setup: string,
	acquisition_method: string,
	guider_selection?: string,
	ao_modes?: string[],
	offset_stars?: string[],
	slitmasks?: string[],
	position_angles: string[],
}

export type GSMode = 'Automatic' | 'Operator' | 'User'
export type PO = 'REF' | 'IFU'
export type Slicer = 'Small' | 'Medium' | 'Large'
export type Grating = 'BL' | 'BM' | 'BH1' | 'BH2' | 'RL' | 'RM' | 'RH1' | 'RH2'
export type Instrument = 'KCWI' | 'DEIMOS' | 'MOSFIRE'

export interface KCWIAcquisition extends Base {
	name: string
	version: string
	script: string,
	guider_po: PO,
	guider_gs_ra: number,
	guider_gs_dec: number,
	guider_gs_mode: GSMode
}

export interface Dither extends Base {
	'min': number,
	'max': number,
	'letter': string,
}

export type Science = KCWIScience

export interface KCWIScience extends Base {
	name: string,
	version: string,
	det1_exptime: number,
	det1_nexp: number,
	det2_exptime: number,
	det2_nexp: number,
	seq_ditarray?: Dither,
	seq_ndither?: number,
	cfg_cam_grating: Grating,
	cfg_cam_cwave: number,
	cfg_slicer: Slicer
}

export interface DefaultScience extends Base{
	instrument: string,
	exposure_sequences: string[],
	associations: string[],
}

export interface Observation extends Base {
	exposure_sequences: string[],
	associations: string[],
}

export interface Signature extends Base {
	name: string,
	instrument: Instrument,
	pi_id: number,
	sem_id: string,
	observer_ids?: string[],
}

export interface Target {
	name: string,
	ra: string,
	dec: string,
	equinox: number,
	frame: string,
	ra_offset: number,
	dec_offset: number,
	pa: number,
	pm_ra: number,
	pm_dec: number,
	d_ra: number,
	d_dec: number,
	epoch: number,
	obstime: number,
	mag: Magnitude[],
	wrap?: string,
	comment?: string
}

export interface Magnitude extends Base {
	band: string,
	mag: number,
}


export type InstrumentPackage = KCWIInstrumentPackage

interface KCWIInstrumentPackage extends Base {
  instrument: Instrument
  version: string
  modes: string[]
  cameras: Cameras[]
  templates: InstrumentPackageTemplates
}

export type CameraName = "BLUE" | "RED"
export type CameraItentifier = "CAM1" | "CAM2"

export interface Cameras extends object {
  name: CameraName 
  type: string
  identifier: CameraIdentifier
  detector: string
}

export interface InstrumentPackageTemplates {
  [key: string]: Template[] 
}

export type TemplateType = "acq" | "sci" | "config"

export interface Template {
  name: string,
  instrument: Instrument,
  type: TemplateType,
  schema: JsonSchema
  version: number
  wrap?: string
  rotmode?: string
}
