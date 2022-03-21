#!/usr/bin/python
# -*- coding: latin-1 -*-
import argparse
import datetime
import yaml
import json
import numpy as np
import random
import string
from itertools import product
import pdb
from functools import wraps
import urllib
import copy
seed = 1984739
random.seed(seed)


INST_MAPPING = {
    'DEIMOS': {'DE', 'DF'},
    'ESI': {'EI'},
    'HIRES': {'HI'},
    'KCWI': {'KB', 'KF'},
    'LRIS': {'LB', 'LR'},
    'MOSFIRE': {'MF'},
    'OSIRIS': {'OI', 'OS'},
    'NIRES': {'NR', 'NI', 'NS'},
    'NIRC2': {'N2', 'NC'},
}

pis = {
    "Michael Bluth": 5555,
    "Lindsay Bluth-F�nke": 7766,
    "Gob Bluth": 8877,
    "George Michael Bluth": 8899,
    "Maeby F�nke": 7799,
    "Buster Bluth": 8765,
    "Tobias F�nke": 9998,
    "George Bluth Sr.": 1144,
    "Lucille Bluth": 7644,
}

observers = [
    "Narrator",
    "Oscar Bluth",
    "Lucille Austero",
    "Barry Zuckerkorn",
    "Kitty Sanchez",
    "Steve Holt",
    "Lupe",
    "Annyong Bluth",
    "Carl Weathers",
    "Maggie Lizer",
    "Stefan Gentles",
    "Marta Estrella",
    "Cindi Lightballoon",
    "John Beard",
    "Ann Veal",
    "Wayne Jarvis",
    "Dr. Fishman",
    "Stan Sitwell",
    "Sally Sitwell",
    "Mort Meyers",
    "Starla",
    "Tony Wonder",
    "Gene Parmesan",
    "Terry Veal",
    "Rita Leeds",
    "Larry Middleman",
    "Bob Loblaw",
    "Ron Howard",
    "DeBrie Bardeaux",
    "Rebel Alley",
    "Herbert Love",
    "Marky Bark",
    "Argyle Austero",
    "Paul 'P-Hound' Huan",
    "Mark Cherry",
    "Murphy Brown F�nke",
    "Lottie Dottie Da",
    "Dusty Radler"
]

comments = [
    "Here?s some money. Go see a star war.",
    "I don?t understand the question and I won?t respond to it.",
    "I am one of the few honest people I have ever known.",
    "I?m a scholar. I enjoy scholarly pursuits.",
    "I?ve made a huge tiny mistake.",
    "I hear the jury?s still out on science.",
]

wrap_str = ['north', 'south']

status = [
    "Started",
    "Executed",
    "Completed",
    "Failed",
    "Terminated",
    "Stopped",
]

timeConstraint = [
    None, [['2021-01-01 08:00:00', '2021-01-01 10:00:00'],
           ['2021-02-02 09:00:00', '2021-02-03 18:00:00'],
           ['2021-05-01 08:00:00', '2021-06-01 10:00:00'],
           ['2021-06-01 08:00:00', '2021-06-07 10:00:00']
           ]]

spectral_types = ['V', 'R', 'I', 'J', 'H', 'K']

sem_ids = [
    "2017A_U033",
    "2017A_U050",
    "2017B_U042",
    "2017B_U043",
    "2018A_U042",
    "2018A_U043",
    "2018A_U044",
    "2018A_U045",
    "2018B_U016",
    "2018B_U064",
    "2019A_N020",
    "2019A_U123",
    "2019A_U124",
    "2019B_U158",
    "2019B_U159",
    "2019B_U160",
    "2020A_N028",
    "2020A_U169",
    "2020B_U048",
    "2020B_U049",
    "2020B_U082",
    "2020B_N133",
    "2021A_U046",
    "2021A_U073",
    "2021A_N140",
    "2021B_U056",
    "2021B_N057"
]

kcwi_science = ['KCWI_ifu_sci_dither', 'KCWI_ifu_sci_stare']

filled_sci_templates = [
    {
        "metadata": {
            "name": "KCWI_ifu_sci_stare",
            "ui_name": "KCWI stare",
            "instrument": "KCWI",
            "template_type": "science",
            "version": 0.1,
            "script": "KCWI_ifu_sci_stare",
            "sequence_number": 1
        },
        "parameters": {
            "det1_exp_time": 30,
            "det1_exp_number": 4,
            "det2_exp_time": 24,
            "det2_exp_number": 6
        }
    },
    {
        "metadata": {
            "name": "KCWI_ifu_sci_dither",
            "ui_name": "KCWI dither",
            "instrument": "KCWI",
            "template_type": "science",
            "version": 0.1,
            "script": "KCWI_ifu_sci_stare",
            "sequence_number": 1
        },
        "parameters": {
            "det1_exptime": 60.0,
            "det1_nexp": 2,
            "det2_exptime": 121.0,
            "det2_nexp": 4,
            "seq_ndither": 4,
            "seq_ditarray": [
                {"ra_offset": 0, "dec_offset": 0, "position": 'T', "guided": True}, {
                    "ra_offset": 5, "dec_offset": 5, "position": 'S', "guided": False},
                {"ra_offset": 0, "dec_offset": 0, "position": 'T', "guided": True}, {
                    "ra_offset": 5, "dec_offset": 5, "position": 'S', "guided": False}
            ]
        }
    }
]

filled_acq_templates = [{
    "metadata": {
        "name": "KCWI_ifu_acq_direct",
        "ui_name": "KCWI direct",
        "instrument": "KCWI",
        "type": "acquisition",
        "version": 0.1,
        "script": "KCWI_ifu_acq_direct"},
    "parameters": {
        "rot_cfg_wrap": "auto",
        "rot_cfg_mode": "PA",
        "tcs_coord_po": "IFU",
        "tcs_coord_raoff": 12,
        "tcs_coord_decoff": 10, 
        "guider1_coord_ra": '45:28:10.9',
        "guider1_coord_dec": '35:12:09.4',
        "guider1_cfg_mode": "auto"}
}]

containers = ['Army', 'The Alliance of Magicians', 'Tantamount Studios', 'Orange County Prison',
              'Milford School', 'Dr. F�nke\'s 100% Natural Good-Time Family-Band Solution']
NOBS = 20# number of observation blocks
def randContainerName(): return random.choice(containers)


def randOBIds(x=5): return [int(x) for x in list(np.random.choice(
    range(0, NOBS+1), size=random.randint(0, x), replace=False))]


semesters = [str(x)+y for x, y in product(range(2019, 2022), ['A', 'B'])]
letters = string.ascii_lowercase

# random generators


def randString(x=4): return ''.join(random.choice(letters) for i in range(x))


def randFloat(mag=10): return mag * random.uniform(0, 1)
def randBool(): return bool(random.choice([0, 1, None]))
def randInt(lr=0, ur=100): return random.randint(lr, ur)
def randArrStr(x=1, y=1): return [randString(x)
                                  for _ in range(random.randint(1, y))]


def optionalRandString(x=4): return random.choice([None, randString(x)])
def optionalRandArrString(x, y=1): return random.choice(
    [None, randArrStr(x, y)])


def sampleInst(): return random.choice(list(INST_MAPPING.keys()))
def randPI(): return random.choice(list(pis))
def randObserver(): return random.choice(observers)
def randSemester(): return random.choice(semesters)
def randSemId(): return random.choice(sem_ids)


def randPIList(x=1): return lambda x=1: list(np.random.choice(
    list(pis), size=random.randint(1, x), replace=False))
def randObserverList(x=1): return list(np.random.choice(
    observers, size=random.randint(1, x), replace=False))


def randComment(): return random.choice(comments)
def optionalRandComment(): return random.choice([None, randComment()])
def randSemesterList(x=3): return list(np.random.choice(
    semesters, size=random.randint(0, x), replace=False))


def rand_kcwi_science(): return random.choice(kcwi_science)
def z_fill_number(x, zf=2): return str(x).zfill(2)


raDeg = z_fill_number(randInt(0, 360))
arcMinutes = z_fill_number(randInt(0, 60))
arcSeconds = z_fill_number(randInt(0, 60))

decDeg = z_fill_number(randInt(0, 90))
elevation = random.choice(['+', '-'])


def randStatus():
    rstat = random.choice(status)
    executions = []
    for x in range(0, randInt(0, 6)):
        executions.append(generate_random_executions())

    schema = {
        'state': randInt(5),
        'priority': randFloat(100),
        'current_seq': randInt(4),
        'current_step': randInt(4),
        'current_exp': randInt(4),
        'executions': executions,
        'deleted': False
        }
    return schema


def randTimeConstraint():
    return random.choice(timeConstraint)


def generate_container(ob_blocks):
    ob_set = set()
    n_ob = random.randint(0, 9)
    for indx in range(0, n_ob):
        ob_val = random.randint(0, len(ob_blocks)-1)
        ob_set.update({ob_blocks[ob_val]})

    schema = {
        "sem_id": randSemId(),
        "name": randContainerName(),
        "observation_blocks": list(ob_set),
        "comment": randComment()
    }

    return schema


def generate_inst_package():

    schema = {
        "instrument": "KCWI",
        "version": 0.1,
        "modes": ["ifu", "img"],
        "cameras": [
            {
                "name": "BLUE",
                "type": "spectrograph",
                "detector": "4kx4k EE2V",
                "identifier": "CAM1"
            },
            {
                "name": "RED",
                "type": "spectrograph",
                "detector": "None",
                "identifier": "CAM2"
            }],
        "templates": {
            "acquisition": [
                {"name": "KCWI_ifu_acq_direct",
                 "version": "0.1"},
                {"name": "KCWI_ifu_acq_offsetStar",
                 "version": 0.1}],
            "science": [
                {"name": "KCWI_ifu_sci_stare",
                 "version": "0.1"},
                {"name": "KCWI_ifu_sci_dither",
                 "version": 0.1}]
        },
        "configuration_parameters": [
            {"parameter": "CFG.CAM1.GRATING",
             "ui_string": "Blue Grating",
             "values": ["BL", "BM", "BH1", "BH2"],
             "range": None,
             "type": "dropdown",
             "optionality": "required"},
            {"parameter": "CFG.CAM1.CWAVE",
             "ui_string": "Blue Central Wavelength",
             "values": None,
             "range": [3500, 6500],
             "type": "continuum",
             "optionality": "required"},
            {"parameter": "CFG.CAM2.GRATING",
             "ui_string": "Red Grating",
             "values": ["RL", "RM", "RH1", "RH2"],
             "range": None,
             "type": "dropdown",
             "optionality": "optional"},
            {"parameter": "CFG.CAM2.CWAVE",
             "ui_string": "Red Central Wavelength",
             "values": None,
             "range": [6500, 10000],
             "type": "continuum",
             "optionality": "optional"},
            {"parameter": "CFG.SLICER",
             "ui_string": "Image Slicer",
             "values": ["Small", "Medium", "Large"],
             "range": None,
             "type": "dropdown",
             "optionality": "required"}]
    }

    return schema


def random_dates():
    start_date = datetime.date(2018, 1, 1)
    end_date = datetime.date(2021, 2, 1)

    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + datetime.timedelta(days=random_number_of_days)

    return random_date


def generate_ra():
    raDeg = z_fill_number(randInt(0, 24))
    arcMinutes = z_fill_number(randInt(0, 60))
    arcSeconds = z_fill_number(randInt(0, 60))
    ra = ":".join([raDeg, arcMinutes, arcSeconds])
    return ra


def generate_dec():
    arcMinutes = z_fill_number(randInt(0, 60))
    arcSeconds = z_fill_number(randInt(0, 60))
    decDeg = z_fill_number(randInt(0, 90))
    elevation = random.choice(['+', '-'])
    dec = elevation+":".join([decDeg, arcMinutes, arcSeconds])
    return dec


def remove_none_values_in_dict(method):
    """
    None values in dict returned by method are removed
    """

    @wraps(method)
    def remove_none(*args, **kw):
        result = method(*args, **kw)
        if type(result) is dict:
            return {key: val for key, val in result.items() if val is not None}
        else:
            return result
    return remove_none


def generate_semester(sem, nLen, maxLen=6):
    return {'_id': sem,
            'semester': sem,
            'obs_id': randObserverList(maxLen),
            'comment': optionalRandComment()
            }


def generate_semesters(nSem, nLen=5, maxLen=6):
    return [generate_semester(sem, nLen, maxLen) for sem in semesters[0:nSem]]


def generate_mag(nLen=2):
    return {'target_info_band': spectral_types[random.randint(0, len(spectral_types)-1)],
            'target_info_mag': randFloat(nLen)}


def generate_mags(maxMags=2):
    return [generate_mag() for _ in range(random.randint(1, maxMags))]


@remove_none_values_in_dict
def generate_observation(nLen, maxArr):
    '''not used atm'''
    schema = {
        'instrument': sampleInst(),
        'exposure_sequences': randArrStr(nLen, maxArr),
        'associations': randArrStr(nLen, maxArr),
        'comment': optionalRandComment()
    }
    return schema


@remove_none_values_in_dict
def generate_metadata(maxArr):
    pi_name = randPI()
    schema = {
        'name': 'standard stars #' + str(random.randint(0, 9)),
        'version': 0.1,
        'priority': randInt(100),
        'ob_type': 'science',
        'pi_id': pis[pi_name],
        'sem_id': str(randSemId()),
        'instrument': 'KCWI',
        'comment': optionalRandComment()
    }
    return schema


@remove_none_values_in_dict
def generate_program(container_list):
    observers = []
    for i in range(0, random.randint(0, 9)):
        pi_name = randPI()
        observers.append(pis[pi_name])

    pi_name = str(randPI())
    while pi_name in observers:
        observers.remove(pi_name)

    ob_set = set()
    n_ob = random.randint(0, 9)
    for indx in range(0, n_ob):
        ob_val = random.randint(0, len(container_list)-1)
        ob_set.update({container_list[ob_val]})

    schema = {
        'name': 'Program #' + str(random.randint(0, 99)),
        'sem_id': str(randSemId()),
        'container_list': list(ob_set),
        'comment': optionalRandComment()
    }
    return schema


def generate_dither():
    dmin, dmax = [random.randint(-15, 15), random.randint(-15, 15)].sort()
    schema = {
        'min': dmin,
        'max': dmax,
        'letter': random.choice(string.ascii_lowercase).upper(),
        'guide': 'Guided'
    }
    return schema

def generate_kcwi_science():
    schema = []
    n_templates = random.randint(0, 5)
    for indx in range(0, n_templates):
        tmp_list = copy.deepcopy(filled_sci_templates)
        filled_template = random.choice(tmp_list)
        filled_template['metadata']['sequence_number'] = indx
        schema.append(filled_template)

    return schema


def generate_kcwi_acquisiton(nLen, maxArr):
    acq = random.choice(filled_acq_templates)
    return acq


def generate_science(inst='KCWI'):
    if inst == 'KCWI':
        schema = generate_kcwi_science()
    else:
        schema = generate_kcwi_science()  # fill this in later
    return schema


def generate_acquisition(nLen, maxArr, inst='KCWI'):
    if inst == 'KCWI':
        schema = generate_kcwi_acquisiton(nLen, maxArr)
    else:
        schema = {
            'instrument_setup': randString(),
            'acquisition_method': randString(),
            'guider_selection': optionalRandString(),
            'ao_modes': optionalRandArrString(nLen, maxArr),
            'offset_stars': optionalRandArrString(nLen, maxArr),
            'slitmasks': optionalRandArrString(nLen, maxArr),
            'position_angles': optionalRandArrString(nLen, maxArr),
            'comment': optionalRandComment()
        }
    return schema


def generate_random_executions():
    rdate = random_dates()
    random_time = datetime.datetime.now().replace(hour=random.randint(0, 23),
                                                  minute=random.randint(0, 59))

    random_date = f'{(rdate)} {random_time.strftime("%H:%M:%S")}'

    return random_date


@remove_none_values_in_dict
def generate_common_parameters():
    schema = {
        "metadata": {
            "name": "KCWI_common_parameters",
            "ui_name": "KCWI Common parameters",
            "instrument": "KCWI",
            "template_type": "common_parameters",
            "version": "0.1.1",
        },
        "instrument_parameters": {
            "inst_cfg_slicer": random.choice(["slicer1", "slicer2"]),
            "inst_cfg_blockingfilter": random.choice(["filter1", "filter2"]),
            "inst_cfg_hatch": random.choice(["open", "closed"]),
            "inst_cfg_polarimeter": random.choice(["Sky", "Polar", "Lense"]),
            "inst_cfg_ifu":  random.choice([ "Home", "Large", "Medium", "Small", "FPCam", "Aux" ]),
            "inst_cfg1_filter": random.choice([ "Home", "Large", "Medium", "Small", "FPCam", "Aux" ]),
            "inst_cfg2_filter": random.choice([ "Home", "Large", "Medium", "Small", "FPCam", "Aux" ]),
            "inst_cfg1_grating": random.choice([ "None", "RH3", "RL", "RH2", "BM", "GGTrg"]),
            "inst_cfg2_grating": random.choice([ "None", "RH3", "RL", "RH2", "BM", "GGTrg"]),
            "inst_ns_mask": random.choice(["open", "Dark", "Mask"]),
            "inst_ns_direction": randInt(0,5),
            "inst_kmirror_mode": random.choice(["Tracking", "Stationary"]),
            "inst_kmirror_angle": randInt(0,360),
            "inst_wavelength1_central": randInt(350,1050),
            "inst_wavelength2_central": randInt(350,1050),
            "inst_wavelength1_peak": randInt(350,1050),
            "inst_wavelength2_peak": randInt(350,1050)
        },
        "detector_parameters": {
            "det1_mode_binning": random.choice(['1x1', '2x2']),
            "det2_mode_binning": random.choice(['1x1', '2x2']),
            "det1_mode_amp":  randInt(1,10),
            "det2_mode_amp":  randInt(1,10),
            "det1_mode_read": randInt(0,1),
            "det2_mode_read": randInt(0,1),
            "det1_mode_gain": random.choice([1,2,5,10]),
            "det2_mode_gain": random.choice([1,2,5,10]),
        },
        "tcs_parameters": {
        },
    }
    return schema


@remove_none_values_in_dict
def generate_sidereal_target():
    schema = {
        'target_info_name': randString(),
        'target_coord_ra': generate_ra(),
        'target_coord_dec': generate_dec(),
        'rot_cfg_pa': randFloat(),
        'target_coord_pm_ra': randFloat(),
        'target_coord_pm_dec': randFloat(),
        'target_coord_epoch': randInt(1900,2100),
        'seq_constraint_obstime': '2021-04-22 15:08:04',
        'target_info_magnitude': generate_mags(),
        'target_info_comment': optionalRandComment()
    }
    return schema


@remove_none_values_in_dict
def generate_nonsidereal_target():
    schema = generate_sidereal_target()
    schema['target_coord_dra'] = randFloat()
    schema['target_coord_ddec'] = randFloat()

    return schema


@remove_none_values_in_dict
def generate_mos_target():
    schema = generate_sidereal_target()
    schema['inst_cfg_mask'] = "Science Mask 101"

    return schema


@remove_none_values_in_dict
def generate_observation_block(nLen, maxArr, inst='KCWI', _id=None):
    schema = {
        '_id': str(randInt(1000000, 9999999)),
        'metadata': generate_metadata(maxArr),
        'target': random.choice([None, generate_sidereal_target(),
                                 generate_nonsidereal_target(),
                                 generate_mos_target()]),
        'acquisition': generate_acquisition(nLen, maxArr, inst),
        'observations': generate_science(inst),
        'associations': randArrStr(nLen, maxArr),
        'common_parameters': generate_common_parameters(),
        'status': randStatus(),
        'time_constraints': randTimeConstraint(),
    }
    if _id:
        schema['_id'] = _id
    return schema


if __name__ == '__main__':

    seed = 1984739
    random.seed(seed)


    # Create ob_blocks collection
    print("...generating OBs")
    nLen = 5
    maxArr = 5
    inst = 'KCWI'
    ob_blocks = []
    docs = []
    for idx in range(NOBS):
        doc = generate_observation_block(nLen, maxArr, inst)
        docs.append(doc)

    json_string = json.dumps(docs)
    with open('ob.json', 'w') as outfile:
        json.dump(docs, outfile, indent=4)