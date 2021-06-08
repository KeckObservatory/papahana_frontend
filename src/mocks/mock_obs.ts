import { ObservationBlock } from './../typings/papahana'

export const mock_observation_blocks: ObservationBlock[] = [
    {
      "_id": "60a44779ac7448cc67b636ff",
      "associations": [
        "giwsg",
        "ogqfd",
        "etezj",
        "fjmnt"
      ],
      "comment": "I?ve made a huge tiny mistake.",
      "priority": 20.00236677111804,

      "acquisition": {
        "guider_gs_dec": 42.93914644025938,
        "guider_gs_mode": "User",
        "guider_gs_ra": 12.148353538469799,
        "guider_po": "IFU",
        "name": "KCWI_ifu_acq_direct",
        "script": "KCWI_ifu_acq_direct",
        "version": "0.1"
      },

      "science": [{
        "cfg_cam_cwave": 8723,
        "cfg_cam_grating": "BH1",
        "cfg_slicer": "Large",
        "det1_exptime": 1646,
        "det1_nexp": 53,
        "det2_exptime": 3455,
        "det2_nexp": 69,
        "name": "invalid",
        "version": "0.1"
      }],
      "signature": {
        "instrument": "KCWI",
        "name": "standard stars #5",
        "pi_id": 1144,
        "sem_id": "2019A"
      },
      "status": {
        "executions": [
          "2019-08-02 17:45:17",
          "2019-03-18 10:29:17",
          "2019-01-11 03:43:17",
          "2018-01-23 13:52:17",
          "2018-08-27 14:39:17"
        ],

        "state": "completed"
      },
      "version": "0.1"
    },
    {
      "_id": "60a44779ac7448cc67b63700",
      "associations": [
        "ixvto",
        "dfltd",
        "kcjsq",
        "huymp",
        "ykxiz"
      ],
      "comment": "I am one of the few honest people I have ever known.",
      "priority": 40.88159693151091,
      "acquisition": {
        "guider_gs_dec": 42.93914644025938,
        "guider_gs_mode": "User",
        "guider_gs_ra": 12.148353538469799,
        "guider_po": "IFU",
        "name": "KCWI_ifu_acq_direct",
        "script": "KCWI_ifu_acq_direct",
        "version": "0.1"
      },

      "signature": {
        "instrument": "KCWI",
        "name": "standard stars #1",
        "pi_id": 8899,
        "sem_id": "2020A"
      },
      "status": {
        "executions": [
          "2018-02-16 23:01:17"
        ],
        "state": "inqueue"
      },
      "target": {
        "d_dec": 4.658719505767072,
        "d_ra": 2.978060745424566,
        "dec": "+64 33 14",
        "dec_offset": 9.721465009354247,
        "epoch": 5.511653477158189,
        "equinox": 7.163331384275883,
        "frame": "abzt",
        "mag": [
          {
            "band": "J",
            "mag": 0.6330921368526228
          },
          {
            "band": "J",
            "mag": 0.03087970816334873
          }
        ],
        "name": "okoe",
        "obstime": 6.699888776222621,
        "pa": 23,
        "pm_dec": 4.670963454970466,
        "pm_ra": 2.1313228192733535,
        "ra": "338 25 28",
        "ra_offset": 6.2742209861666165,
        "wrap": "south"
      },
      "version": "0.1"
    },
    {
      "_id": "60a4477aac7448cc67b63719",
      "associations": [
        "reery"
      ],
      "comment": "I don?t understand the question and I won?t respond to it.",
      "priority": 78.04319845411808,
      "acquisition": {
        "guider_gs_dec": 42.93914644025938,
        "guider_gs_mode": "User",
        "guider_gs_ra": 12.148353538469799,
        "guider_po": "IFU",
        "name": "KCWI_ifu_acq_direct",
        "script": "KCWI_ifu_acq_direct",
        "version": "0.1"
      },
      "science": [{
        "cfg_cam_cwave": 8488,
        "cfg_cam_grating": "BM",
        "cfg_slicer": "Medium",
        "det1_exptime": 2912,
        "det1_nexp": 9,
        "det2_exptime": 2521,
        "det2_nexp": 7,
        "name": "undefined",
        "version": "0.1"
      }],
      "signature": {
        "instrument": "KCWI",
        "name": "standard stars #3",
        "pi_id": 8899,
        "sem_id": "2020B"
      },
      "status": {
        "executions": [
          "2018-01-21 01:20:18",
          "2018-03-10 02:22:18",
          "2018-04-09 18:19:18",
          "2019-01-07 16:03:18"
        ],
        "state": "undefined"
      },
      "version": "0.1"
    },
    {
      "_id": "60a4477aac7448cc67b63736",
      "acquisition": {
        "guider_gs_dec": 42.93914644025938,
        "guider_gs_mode": "User",
        "guider_gs_ra": 12.148353538469799,
        "guider_po": "IFU",
        "name": "KCWI_ifu_acq_direct",
        "script": "KCWI_ifu_acq_direct",
        "version": "0.1"
      },
      "associations": [
        "zidkz"
      ],
      "priority": 11.193813405942398,
      "science": [{
        "cfg_cam_cwave": 8077,
        "cfg_cam_grating": "RM",
        "cfg_slicer": "Small",
        "det1_exptime": 1836,
        "det1_nexp": 11,
        "det2_exptime": 3102,
        "det2_nexp": 58,
        "name": "undefined",
        "version": "0.1"
      }],
      "signature": {
        "instrument": "KCWI",
        "name": "standard stars #9",
        "pi_id": 1144,
        "sem_id": "2021A"
      },
      "status": {
        "executions": [
          "2020-07-25 06:28:18",
          "2018-05-26 19:01:18",
          "2018-02-26 22:46:18",
          "2018-09-15 17:24:18",
          "2018-07-03 15:06:18",
          "2018-09-23 14:11:18"
        ],
        "state": "undefined"
      },
      "target": {
        "comment": "I?ve made a huge tiny mistake.",
        "d_dec": 8.388622339445076,
        "d_ra": 1.1323559799150062,
        "dec": "-89 24 33",
        "dec_offset": 5.665268547881834,
        "epoch": 1.166637782561858,
        "equinox": 3.740135556723115,
        "frame": "gyom",
        "mag": [
          {
            "band": "I",
            "mag": 0.4964027761091101
          }
        ],
        "name": "ikpl",
        "obstime": 6.288883130069395,
        "pa": 85,
        "pm_dec": 3.0225056221506676,
        "pm_ra": 7.668726083179381,
        "ra": "125 11 33",
        "ra_offset": 6.241280318100345,
        "wrap": "south"
      },
      "version": "0.1"
    },
    {
      "_id": "60a4477aac7448cc67b6373c",
      "associations": [
        "vvmns"
      ],
      "priority": 56.782896270336295,
      "science": [{
        "cfg_cam_cwave": 9817,
        "cfg_cam_grating": "RL",
        "cfg_slicer": "Medium",
        "det1_exptime": 3142,
        "det1_nexp": 51,
        "det2_exptime": 884,
        "det2_nexp": 49,
        "name": "progressing",
        "version": "0.1"
      }],
      "acquisition": {
        "guider_gs_dec": 42.93914644025938,
        "guider_gs_mode": "User",
        "guider_gs_ra": 12.148353538469799,
        "guider_po": "IFU",
        "name": "KCWI_ifu_acq_direct",
        "script": "KCWI_ifu_acq_direct",
        "version": "0.1"
      },
      "signature": {
        "instrument": "KCWI",
        "name": "standard stars #9",
        "pi_id": 7644,
        "sem_id": "2021A"
      },
      "status": {
        "executions": [
          "2021-01-11 02:53:18",
          "2019-01-17 21:01:18",
          "2019-09-02 19:22:18",
          "2019-11-15 22:50:18"
        ],
        "state": "undefined"
      },
      "version": "0.1"
    },
    {
      "_id": "60a4477aac7448cc67b6374d",
      "acquisition": {
        "guider_gs_dec": 977.3418036290066,
        "guider_gs_mode": "User",
        "guider_gs_ra": 15.61421505200176,
        "guider_po": "REF",
        "name": "KCWI_ifu_acq_direct",
        "script": "KCWI_ifu_acq_direct",
        "version": "0.1"
      },
      "associations": [
        "brmte",
        "cipab",
        "nhxbj",
        "urzsy"
      ],
      "comment": "I am one of the few honest people I have ever known.",
      "priority": 7.532658841189111,
      "signature": {
        "comment": "I hear the jury?s still out on science.",
        "instrument": "KCWI",
        "name": "standard stars #9",
        "pi_id": 1144,
        "sem_id": "2020A"
      },
      "status": {
        "executions": [
          "2018-09-05 02:40:18",
          "2018-09-10 21:31:18",
          "2019-07-14 03:52:18",
          "2020-03-11 05:04:18",
          "2019-11-07 10:04:18"
        ],
        "state": "completed"
      },
      "version": "0.1"
    }
  ]