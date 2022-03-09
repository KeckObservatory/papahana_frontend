export type CatalogRow = Array< number | string >

export interface Container {
	_id: string,
	sem_id: string,
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

export type OBSequence = Acquisition | Science
export type OBComponent = Target | OBSequence | OBMetadata | CommonParameters | TimeConstraints | Status
export type OBSeqNames = 'acquisition' | 'signature' | 'target' | 'observations'

export interface Status {
	state: string;
	priority: number;
	current_seq: number;
	current_step: number;
	current_exp: number;
}

export type TimeConstraints = Array<[string, string]>

export interface CommonParameters {
	metadata: { [key:string]: any },
	instrument_parameters: { [key:string]: any },
	detector_parameters: { [key:string]: any },
	tcs_parameters: { [key:string]: any }
}

export type OBType = 'science' | 'engineering' | 'calibration'
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
	container_id: string
	ob_id?: string
    name?: string
}

export interface OBCell {
	target?: Target;
	id: string;
	name: string;
	type: 'ob' | 'container'
	ra?: number | string;
	dec?: number | string;
	cid?: string
}

export interface OBMetadata {
	name: string;
	version: string | number;
	priority: number;
	ob_type: OBType; 
	pi_id: number;
	sem_id: string;
	instrument: Instrument;
	comment: string
}


export interface ObservationBlock extends Base {
	_id: string,
	metadata: OBMetadata;
	target?: Target;
	time_constraints: string[] | string[][];
	comment: string;
	observations?: Science[];
	acquisition: Acquisition;
	associations: string[];
	status: Status;
}

export type Acquisition = DefaultAcquisition | KCWIAcquisition

export interface AcquisitionMetadata extends Metadata {

}

export interface BaseSequence extends Base {
	metadata: Metadata;
	parameters: { [key:string]: any }
}

export interface DefaultAcquisition extends BaseSequence{
    metadata: AcquisitionMetadata;
	template_id: string;
}

export type GSMode = 'Automatic' | 'Operator' | 'User'
export type PO = 'REF' | 'IFU'
export type Slicer = 'Small' | 'Medium' | 'Large'
export type Grating = 'BL' | 'BM' | 'BH1' | 'BH2' | 'RL' | 'RM' | 'RH1' | 'RH2'
export type Instrument = 'KCWI' | 'DEIMOS' | 'MOSFIRE'

export interface KCWIAcquisition extends BaseSequence {
	parameters: KCWIAcquisitionParameters
}

export interface KCWIAcquisitionParameters extends Base {
	guider_po: string,
	wrap: string,
	ra_offset: number,
	dec_offset
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

export interface KCWIScienceParameters {
    [key: string]: number | string | Slicer | Grating | any
}

export interface Metadata {
	name: string,
	version: string,
	ui_name: string,
	instrument?: Instrument,
    template_type: string,
	script?: string
}

export interface SequenceMetadata {
	[key: string]: any
}

export interface ScienceMetadata extends SequenceMetadata {
	sequence_number: number
}

export interface AcquisitionMetadata extends SequenceMetadata {
}

export interface KCWIScience extends Base {
	metadata: ScienceMetadata;
	parameters: KCWIScienceParameters;
}

export interface Observation extends Base {
	exposure_observations: string[],
	associations: string[],
}

export interface Target {
	name: string,
	target_coord_ra: string,
	target_coord_dec: string,
	ra_deg?: number,
	dec_deg?: number,
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

export interface IP_METADATA {
	_id: string,
	name: string,
	ui_name: string
	version: string
	instrument: string
	observing_modes: string[]
}

export interface OPICAL_PARAMETERS {
	field_of_view: number[],
	slit_length: 4
}

export interface GUIDER {
	name: string,
	fov: number[],
	pixel_scale: number,
	pa_offset: any,
	read_noise: any,
	gain: any,
	zero_points: any,
	sensitivity: any,
	filters: any
}

export type InstrumentPackage = KCWIInstrumentPackage

interface KCWIInstrumentPackage extends Base {
	metadata: IP_METADATA
	optical_parameters: OPICAL_PARAMETERS
	guider: GUIDER
	configurable_elements: string[]
	pointing_origins: string[]
	common_parameters: string
	template_list: {[key: string]: string}
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
  [key: string]: string 
}

export type TemplateType = "acq" | "sci" | "config"

export interface TemplateMetadata extends Metadata {

}

export interface TemplateParameter {
  ui_name: string;
  option: string;
  allowed: string[] | number[] | object[];
  default: string | number | null;
  type: string;
  optionality: string;
}

export interface Template {
	template_id: string;
	metadata: TemplateMetadata;
	parameters: {[key: string]: TemplateParameter};
    name: string,
}
