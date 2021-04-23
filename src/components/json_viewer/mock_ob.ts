import { ObservationBlock, Acquisition, Signature, TargetDescription, Magnitude, Observation } from './../../papahana'

export const mock_acquisition: Acquisition = {
    'instrumental_setup': 'ahat',
    'acquisition_method': 'eqge',
    'guider_selection': 'jyjq',
    'slitmasks': ['pcm', 'aqi', 'qoz'],
    'position_angles': ['erz', 'mes']
}

export const mock_signature: Signature = {
    'pi': 'Melkyl kindpast',
    'semester': '2003A',
    'program': 3,
    'observers': ['Blubberwhale Crimpysnitch',
      'Buckingham Countryside',
      'Snorkeldink Crackerdong'],
    'container': 3
}

export const mock_mag: Magnitude = {
  'band': 'xt', 'magnitude': 0.879848723377521
}

export const mock_target: TargetDescription = {
    'name': 'bbld',
    'ra': 'pbjl',
    'dec': 'cagu',
    'equinox': 8.767539464748392,
    'frame': 'ssvy',
    'ra_offset': 8.761157206767493,
    'dec_offset': 4.232845528759242,
    'pm_ra': 2.3085846545274205,
    'pm_dec': 4.13885202709376,
    'epoch': 7.919164865462428,
    'obstime': 6.48924613435922,
    'mag': mock_mag,
    'dra': 7.058626329182294,
    'ddec': 8.301396133073016
}

export const mock_observations: Observation = {
    'instrument': 'HIRES',
    'exposure_sequences': ['rzy'],
    'associations': ['wpf']
}

export const mock_ob: ObservationBlock = {
  '_id': "1_mock",
  'signature': mock_signature, 
  'target': mock_target,
  'acquisition': mock_acquisition,
  'observations': [mock_observations],
  'associations': ['vvs'],
  'observation_type': ['asdfe'],
  'priority': 46.00345040437236
}