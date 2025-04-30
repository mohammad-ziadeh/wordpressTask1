export default {
  data () {
    return {
      countries: [
        {
          'id': 1,
          'iso': 'af',
          'nicename': 'Afghanistan',
          'phonecode': 93,
          'format': '070 123 4567'
        },
        {
          'id': 2,
          'iso': 'al',
          'nicename': 'Albania',
          'phonecode': 355,
          'format': '066 123 4567'
        },
        {
          'id': 3,
          'iso': 'dz',
          'nicename': 'Algeria',
          'phonecode': 213,
          'format': '0551 23 45 67'
        },
        {
          'id': 4,
          'iso': 'as',
          'nicename': 'American Samoa',
          'phonecode': 1,
          'format': '(684) 733 1234'
        },
        {
          'id': 5,
          'iso': 'ad',
          'nicename': 'Andorra',
          'phonecode': 376,
          'format': '312 345'
        },
        {
          'id': 6,
          'iso': 'ao',
          'nicename': 'Angola',
          'phonecode': 244,
          'format': '923 123 456'
        },
        {
          'id': 7,
          'iso': 'ai',
          'nicename': 'Anguilla',
          'phonecode': 1,
          'format': '(264) 235 1234'
        },
        {
          'id': 8,
          'iso': 'ag',
          'nicename': 'Antigua and Barbuda',
          'phonecode': 1,
          'format': '(268) 464 1234'
        },
        {
          'id': 9,
          'iso': 'ar',
          'nicename': 'Argentina',
          'phonecode': 54,
          'format': '9 (11) 1234 567'
        },
        {
          'id': 10,
          'iso': 'am',
          'nicename': 'Armenia',
          'phonecode': 374,
          'format': '077 123 456'
        },
        {
          'id': 11,
          'iso': 'aw',
          'nicename': 'Aruba',
          'phonecode': 297,
          'format': '560 1234'
        },
        {
          'id': 12,
          'iso': 'au',
          'nicename': 'Australia',
          'phonecode': 61,
          'format': '0412 345 678'
        },
        {
          'id': 13,
          'iso': 'at',
          'nicename': 'Austria',
          'phonecode': 43,
          'format': '0664 123456'
        },
        {
          'id': 14,
          'iso': 'az',
          'nicename': 'Azerbaijan',
          'phonecode': 994,
          'format': '040 123 45 67'
        },
        {
          'id': 15,
          'iso': 'bs',
          'nicename': 'Bahamas',
          'phonecode': 1,
          'format': '(242) 359 1234'
        },
        {
          'id': 16,
          'iso': 'bh',
          'nicename': 'Bahrain',
          'phonecode': 973,
          'format': '3600 1234'
        },
        {
          'id': 17,
          'iso': 'bd',
          'nicename': 'Bangladesh',
          'phonecode': 880,
          'format': '018 1234 5678'
        },
        {
          'id': 18,
          'iso': 'bb',
          'nicename': 'Barbados',
          'phonecode': 1,
          'format': '(246) 250 1234'
        },
        {
          'id': 19,
          'iso': 'by',
          'nicename': 'Belarus',
          'phonecode': 375,
          'format': '029 491 1911'
        },
        {
          'id': 20,
          'iso': 'be',
          'nicename': 'Belgium',
          'phonecode': 32,
          'format': '0470 123 456'
        },
        {
          'id': 21,
          'iso': 'bz',
          'nicename': 'Belize',
          'phonecode': 501,
          'format': '622 1234'
        },
        {
          'id': 22,
          'iso': 'bj',
          'nicename': 'Benin',
          'phonecode': 229,
          'format': '90 123 456'
        },
        {
          'id': 23,
          'iso': 'bm',
          'nicename': 'Bermuda',
          'phonecode': 1,
          'format': '(441) 370 1234'
        },
        {
          'id': 24,
          'iso': 'bt',
          'nicename': 'Bhutan',
          'phonecode': 975,
          'format': '17 123 456'
        },
        {
          'id': 25,
          'iso': 'bo',
          'nicename': 'Bolivia',
          'phonecode': 591,
          'format': '7 123 4567'
        },
        {
          'id': 26,
          'iso': 'ba',
          'nicename': 'Bosnia and Herzegovina',
          'phonecode': 387,
          'format': '061 123 456'
        },
        {
          'id': 27,
          'iso': 'bw',
          'nicename': 'Botswana',
          'phonecode': 267,
          'format': '71 123 456'
        },
        {
          'id': 28,
          'iso': 'br',
          'nicename': 'Brazil',
          'phonecode': 55,
          'format': '(11) 9 1234 5678'
        },
        {
          'id': 29,
          'iso': 'vg',
          'nicename': 'British Virgin Islands',
          'phonecode': 1,
          'format': '(284) 300 1234'
        },
        {
          'id': 30,
          'iso': 'bn',
          'nicename': 'Brunei',
          'phonecode': 673,
          'format': '712 3456'
        },
        {
          'id': 31,
          'iso': 'bg',
          'nicename': 'Bulgaria',
          'phonecode': 359,
          'format': '087 123 4567'
        },
        {
          'id': 32,
          'iso': 'bf',
          'nicename': 'Burkina Faso',
          'phonecode': 226,
          'format': '70 12 34 56'
        },
        {
          'id': 33,
          'iso': 'bi',
          'nicename': 'Burundi',
          'phonecode': 257,
          'format': '79 56 12 34'
        },
        {
          'id': 34,
          'iso': 'kh',
          'nicename': 'Cambodia',
          'phonecode': 855,
          'format': '091 234 567'
        },
        {
          'id': 35,
          'iso': 'cm',
          'nicename': 'Cameroon',
          'phonecode': 237,
          'format': '6 71 23 45 67'
        },
        {
          'id': 36,
          'iso': 'ca',
          'nicename': 'Canada',
          'phonecode': 1,
          'format': '(204) 123 4567'
        },
        {
          'id': 37,
          'iso': 'cv',
          'nicename': 'Cape Verde',
          'phonecode': 238,
          'format': '991 12 34'
        },
        {
          'id': 38,
          'iso': 'ky',
          'nicename': 'Cayman Islands',
          'phonecode': 1,
          'format': '(345) 323 1234'
        },
        {
          'id': 39,
          'iso': 'cf',
          'nicename': 'Central African Republic',
          'phonecode': 236,
          'format': '70 01 23 45'
        },
        {
          'id': 40,
          'iso': 'td',
          'nicename': 'Chad',
          'phonecode': 235,
          'format': '63 01 23 45'
        },
        {
          'id': 41,
          'iso': 'cl',
          'nicename': 'Chile',
          'phonecode': 56,
          'format': '09 6123 4567'
        },
        {
          'id': 42,
          'iso': 'cn',
          'nicename': 'China',
          'phonecode': 86,
          'format': '131 2345 6789'
        },
        {
          'id': 43,
          'iso': 'co',
          'nicename': 'Colombia',
          'phonecode': 57,
          'format': '321 1234567'
        },
        {
          'id': 44,
          'iso': 'km',
          'nicename': 'Comoros',
          'phonecode': 269,
          'format': '321 23 45'
        },
        {
          'id': 45,
          'iso': 'cd',
          'nicename': 'Congo (DRC)',
          'phonecode': 243,
          'format': '0991 234 567'
        },
        {
          'id': 46,
          'iso': 'cg',
          'nicename': 'Congo (Republic)',
          'phonecode': 242,
          'format': '06 123 4567'
        },
        {
          'id': 47,
          'iso': 'ck',
          'nicename': 'Cook Islands',
          'phonecode': 682,
          'format': '71 234'
        },
        {
          'id': 48,
          'iso': 'cr',
          'nicename': 'Costa Rica',
          'phonecode': 506,
          'format': '8312 3456'
        },
        {
          'id': 49,
          'iso': 'ci',
          'nicename': 'Cote D\'Ivoire',
          'phonecode': 225,
          'format': '01 23 45 67'
        },
        {
          'id': 50,
          'iso': 'hr',
          'nicename': 'Croatia',
          'phonecode': 385,
          'format': '091 234 5678'
        },
        {
          'id': 51,
          'iso': 'cu',
          'nicename': 'Cuba',
          'phonecode': 53,
          'format': '05 1234567'
        },
        {
          'id': 57,
          'iso': 'cy',
          'nicename': 'Cyprus',
          'phonecode': 357,
          'format': '96 123456'
        },
        {
          'id': 58,
          'iso': 'cz',
          'nicename': 'Czech Republic',
          'phonecode': 420,
          'format': '601 123 456'
        },
        {
          'id': 59,
          'iso': 'dk',
          'nicename': 'Denmark',
          'phonecode': 45,
          'format': '20 12 34 56'
        },
        {
          'id': 60,
          'iso': 'dj',
          'nicename': 'Djibouti',
          'phonecode': 253,
          'format': '77 83 10 01'
        },
        {
          'id': 61,
          'iso': 'dm',
          'nicename': 'Dominica',
          'phonecode': 1,
          'format': '(767) 225 1234'
        },
        {
          'id': 62,
          'iso': 'do',
          'nicename': 'Dominican Republic',
          'phonecode': 1,
          'format': '(809) 234 5678'
        },
        {
          'id': 63,
          'iso': 'ec',
          'nicename': 'Ecuador',
          'phonecode': 593,
          'format': '099 123 4567'
        },
        {
          'id': 64,
          'iso': 'eg',
          'nicename': 'Egypt',
          'phonecode': 20,
          'format': '0100 123 4567'
        },
        {
          'id': 65,
          'iso': 'sv',
          'nicename': 'El Salvador',
          'phonecode': 503,
          'format': '7012 3456'
        },
        {
          'id': 66,
          'iso': 'gq',
          'nicename': 'Equatorial Guinea',
          'phonecode': 240,
          'format': '222 123 456'
        },
        {
          'id': 67,
          'iso': 'er',
          'nicename': 'Eritrea',
          'phonecode': 291,
          'format': '07 123 456'
        },
        {
          'id': 68,
          'iso': 'ee',
          'nicename': 'Estonia',
          'phonecode': 372,
          'format': '5123 4567'
        },
        {
          'id': 69,
          'iso': 'et',
          'nicename': 'Ethiopia',
          'phonecode': 251,
          'format': '091 123 4567'
        },
        {
          'id': 70,
          'iso': 'fk',
          'nicename': 'Falkland Islands (Malvinas)',
          'phonecode': 500,
          'format': '51234'
        },
        {
          'id': 71,
          'iso': 'fo',
          'nicename': 'Faroe Islands',
          'phonecode': 298,
          'format': '211234'
        },
        {
          'id': 72,
          'iso': 'fj',
          'nicename': 'Fiji',
          'phonecode': 679,
          'format': '701 2345'
        },
        {
          'id': 73,
          'iso': 'fi',
          'nicename': 'Finland',
          'phonecode': 358,
          'format': '041 2345678'
        },
        {
          'id': 74,
          'iso': 'fr',
          'nicename': 'France',
          'phonecode': 33,
          'format': '06 12 34 56 78'
        },
        {
          'id': 75,
          'iso': 'gf',
          'nicename': 'French Guiana',
          'phonecode': 594,
          'format': '0694 20 12 34'
        },
        {
          'id': 76,
          'iso': 'pf',
          'nicename': 'French Polynesia',
          'phonecode': 689,
          'format': '87 12 34 56'
        },
        {
          'id': 77,
          'iso': 'ga',
          'nicename': 'Gabon',
          'phonecode': 241,
          'format': '06 03 12 34'
        },
        {
          'id': 78,
          'iso': 'gm',
          'nicename': 'Gambia',
          'phonecode': 220,
          'format': '301 2345'
        },
        {
          'id': 79,
          'iso': 'ge',
          'nicename': 'Georgia',
          'phonecode': 995,
          'format': '555 12 34 56'
        },
        {
          'id': 80,
          'iso': 'de',
          'nicename': 'Germany',
          'phonecode': 49,
          'format': '01512 3456789'
        },
        {
          'id': 81,
          'iso': 'gh',
          'nicename': 'Ghana',
          'phonecode': 233,
          'format': '023 123 4567'
        },
        {
          'id': 82,
          'iso': 'gi',
          'nicename': 'Gibraltar',
          'phonecode': 350,
          'format': '57123456'
        },
        {
          'id': 83,
          'iso': 'gr',
          'nicename': 'Greece',
          'phonecode': 30,
          'format': '691 234 5678'
        },
        {
          'id': 84,
          'iso': 'gl',
          'nicename': 'Greenland',
          'phonecode': 299,
          'format': '22 12 34'
        },
        {
          'id': 85,
          'iso': 'gp',
          'nicename': 'Guadeloupe',
          'phonecode': 590,
          'format': '690 123 456'
        },
        {
          'id': 87,
          'iso': 'gu',
          'nicename': 'Guam',
          'phonecode': 1,
          'format': '(671) 300 1234'
        },
        {
          'id': 88,
          'iso': 'gt',
          'nicename': 'Guatemala',
          'phonecode': 502,
          'format': '5123 4567'
        },
        {
          'id': 89,
          'iso': 'gg',
          'nicename': 'Guernsey',
          'phonecode': 44,
          'format': '07781 123456'
        },
        {
          'id': 90,
          'iso': 'gn',
          'nicename': 'Guinea',
          'phonecode': 224,
          'format': '601 12 34 56'
        },
        {
          'id': 91,
          'iso': 'gw',
          'nicename': 'Guinea-Bissau',
          'phonecode': 245,
          'format': '955 012 345'
        },
        {
          'id': 92,
          'iso': 'gy',
          'nicename': 'Guyana',
          'phonecode': 592,
          'format': '609 1234'
        },
        {
          'id': 93,
          'iso': 'ht',
          'nicename': 'Haiti',
          'phonecode': 509,
          'format': '34 10 1234'
        },
        {
          'id': 94,
          'iso': 'hn',
          'nicename': 'Honduras',
          'phonecode': 504,
          'format': '9123 4567'
        },
        {
          'id': 95,
          'iso': 'hk',
          'nicename': 'Hong Kong',
          'phonecode': 852,
          'format': '5123 4567'
        },
        {
          'id': 96,
          'iso': 'hu',
          'nicename': 'Hungary',
          'phonecode': 36,
          'format': '(20) 123 4567'
        },
        {
          'id': 97,
          'iso': 'is',
          'nicename': 'Iceland',
          'phonecode': 354,
          'format': '611 1234'
        },
        {
          'id': 98,
          'iso': 'in',
          'nicename': 'India',
          'phonecode': 91,
          'format': '099876 54321'
        },
        {
          'id': 99,
          'iso': 'id',
          'nicename': 'Indonesia',
          'phonecode': 62,
          'format': '0812 345 678'
        },
        {
          'id': 100,
          'iso': 'ir',
          'nicename': 'Iran',
          'phonecode': 98,
          'format': '0912 345 6789'
        },
        {
          'id': 101,
          'iso': 'iq',
          'nicename': 'Iraq',
          'phonecode': 964,
          'format': '0791 234 5678'
        },
        {
          'id': 102,
          'iso': 'ie',
          'nicename': 'Ireland',
          'phonecode': 353,
          'format': '085 012 3456'
        },
        {
          'id': 103,
          'iso': 'im',
          'nicename': 'Isle of Man',
          'phonecode': 44,
          'format': '07924 123456'
        },
        {
          'id': 104,
          'iso': 'il',
          'nicename': 'Israel',
          'phonecode': 972,
          'format': '050 123 4567'
        },
        {
          'id': 105,
          'iso': 'it',
          'nicename': 'Italy',
          'phonecode': 39,
          'format': '312 345 6789'
        },
        {
          'id': 106,
          'iso': 'jm',
          'nicename': 'Jamaica',
          'phonecode': 1,
          'format': '(876) 210 1234'
        },
        {
          'id': 107,
          'iso': 'jp',
          'nicename': 'Japan',
          'phonecode': 81,
          'format': '090 1234 5678'
        },
        {
          'id': 108,
          'iso': 'je',
          'nicename': 'Jersey',
          'phonecode': 44,
          'format': '07797 123456'
        },
        {
          'id': 109,
          'iso': 'jo',
          'nicename': 'Jordan',
          'phonecode': 962,
          'format': '07 9012 3456'
        },
        {
          'id': 110,
          'iso': 'kz',
          'nicename': 'Kazakhstan',
          'phonecode': 7,
          'format': '(771) 123 4567'
        },
        {
          'id': 111,
          'iso': 'ke',
          'nicename': 'Kenya',
          'phonecode': 254,
          'format': '0712 123456'
        },
        {
          'id': 112,
          'iso': 'ki',
          'nicename': 'Kiribati',
          'phonecode': 686,
          'format': '72012345'
        },
        {
          'id': 241,
          'iso': 'xk',
          'nicename': 'Kosovo',
          'phonecode': 383,
          'format': '044 1234567'
        },
        {
          'id': 113,
          'iso': 'kw',
          'nicename': 'Kuwait',
          'phonecode': 965,
          'format': '500 12345'
        },
        {
          'id': 114,
          'iso': 'kg',
          'nicename': 'Kyrgyzstan',
          'phonecode': 996,
          'format': '0700 123 456'
        },
        {
          'id': 115,
          'iso': 'la',
          'nicename': 'Laos',
          'phonecode': 856,
          'format': '020 23 123 456'
        },
        {
          'id': 116,
          'iso': 'lv',
          'nicename': 'Latvia',
          'phonecode': 371,
          'format': '21 234 567'
        },
        {
          'id': 117,
          'iso': 'lb',
          'nicename': 'Lebanon',
          'phonecode': 961,
          'format': '71 123 456'
        },
        {
          'id': 118,
          'iso': 'ls',
          'nicename': 'Lesotho',
          'phonecode': 266,
          'format': '5012 3456'
        },
        {
          'id': 119,
          'iso': 'lr',
          'nicename': 'Liberia',
          'phonecode': 231,
          'format': '077 012 3456'
        },
        {
          'id': 120,
          'iso': 'ly',
          'nicename': 'Libya',
          'phonecode': 218,
          'format': '091 2345678'
        },
        {
          'id': 121,
          'iso': 'li',
          'nicename': 'Liechtenstein',
          'phonecode': 423,
          'format': '660 234 567'
        },
        {
          'id': 122,
          'iso': 'lt',
          'nicename': 'Lithuania',
          'phonecode': 370,
          'format': '612 345 67'
        },
        {
          'id': 123,
          'iso': 'lu',
          'nicename': 'Luxembourg',
          'phonecode': 352,
          'format': '628 123 456'
        },
        {
          'id': 124,
          'iso': 'mo',
          'nicename': 'Macao',
          'phonecode': 853,
          'format': '6612 3456'
        },
        {
          'id': 125,
          'iso': 'mk',
          'nicename': 'Macedonia (FYROM)',
          'phonecode': 389,
          'format': '072 345 678'
        },
        {
          'id': 126,
          'iso': 'mg',
          'nicename': 'Madagascar',
          'phonecode': 261,
          'format': '032 12 345 67'
        },
        {
          'id': 127,
          'iso': 'mw',
          'nicename': 'Malawi',
          'phonecode': 265,
          'format': '0991 23 45 67'
        },
        {
          'id': 128,
          'iso': 'my',
          'nicename': 'Malaysia',
          'phonecode': 60,
          'format': '012 345 6789'
        },
        {
          'id': 129,
          'iso': 'mv',
          'nicename': 'Maldives',
          'phonecode': 960,
          'format': '771 2345'
        },
        {
          'id': 130,
          'iso': 'ml',
          'nicename': 'Mali',
          'phonecode': 223,
          'format': '65 01 23 45'
        },
        {
          'id': 131,
          'iso': 'mt',
          'nicename': 'Malta',
          'phonecode': 356,
          'format': '9696 1234'
        },
        {
          'id': 132,
          'iso': 'mh',
          'nicename': 'Marshall Islands',
          'phonecode': 692,
          'format': '235 1234'
        },
        {
          'id': 133,
          'iso': 'mq',
          'nicename': 'Martinique',
          'phonecode': 596,
          'format': '0696 20 12 34'
        },
        {
          'id': 134,
          'iso': 'mr',
          'nicename': 'Mauritania',
          'phonecode': 222,
          'format': '22 12 34 56'
        },
        {
          'id': 135,
          'iso': 'mu',
          'nicename': 'Mauritius',
          'phonecode': 230,
          'format': '5251 2345'
        },
        {
          'id': 136,
          'iso': 'yt',
          'nicename': 'Mayotte',
          'phonecode': 269,
          'format': '0639 12 34 56'
        },
        {
          'id': 137,
          'iso': 'mx',
          'nicename': 'Mexico',
          'phonecode': 52,
          'format': '222 123 4567'
        },
        {
          'id': 138,
          'iso': 'fm',
          'nicename': 'Micronesia',
          'phonecode': 691,
          'format': '350 1234'
        },
        {
          'id': 139,
          'iso': 'md',
          'nicename': 'Moldova',
          'phonecode': 373,
          'format': '0621 12 345'
        },
        {
          'id': 140,
          'iso': 'mc',
          'nicename': 'Monaco',
          'phonecode': 377,
          'format': '06 12 34 56 78'
        },
        {
          'id': 141,
          'iso': 'mn',
          'nicename': 'Mongolia',
          'phonecode': 976,
          'format': '8812 3456'
        },
        {
          'id': 142,
          'iso': 'me',
          'nicename': 'Montenegro',
          'phonecode': 382,
          'format': '067 622 901'
        },
        {
          'id': 143,
          'iso': 'ms',
          'nicename': 'Montserrat',
          'phonecode': 1,
          'format': '(664) 492 3456'
        },
        {
          'id': 144,
          'iso': 'ma',
          'nicename': 'Morocco',
          'phonecode': 212,
          'format': '0650 123456'
        },
        {
          'id': 145,
          'iso': 'mz',
          'nicename': 'Mozambique',
          'phonecode': 258,
          'format': '82 123 4567'
        },
        {
          'id': 146,
          'iso': 'mm',
          'nicename': 'Myanmar',
          'phonecode': 95,
          'format': '09 212 3456'
        },
        {
          'id': 147,
          'iso': 'na',
          'nicename': 'Namibia',
          'phonecode': 264,
          'format': '081 123 4567'
        },
        {
          'id': 149,
          'iso': 'np',
          'nicename': 'Nepal',
          'phonecode': 977,
          'format': '984 1234567'
        },
        {
          'id': 150,
          'iso': 'nl',
          'nicename': 'Netherlands',
          'phonecode': 31,
          'format': '06 12345678'
        },
        {
          'id': 151,
          'iso': 'nc',
          'nicename': 'New Caledonia',
          'phonecode': 687,
          'format': '75 12 34'
        },
        {
          'id': 152,
          'iso': 'nz',
          'nicename': 'New Zealand',
          'phonecode': 64,
          'format': '021 123 4567'
        },
        {
          'id': 153,
          'iso': 'ni',
          'nicename': 'Nicaragua',
          'phonecode': 505,
          'format': '8123 4567'
        },
        {
          'id': 154,
          'iso': 'ne',
          'nicename': 'Niger',
          'phonecode': 227,
          'format': '93 12 34 56'
        },
        {
          'id': 155,
          'iso': 'ng',
          'nicename': 'Nigeria',
          'phonecode': 234,
          'format': '0802 123 4567'
        },
        {
          'id': 156,
          'iso': 'nu',
          'nicename': 'Niue',
          'phonecode': 683,
          'format': '1234'
        },
        {
          'id': 157,
          'iso': 'nf',
          'nicename': 'Norfolk Island',
          'phonecode': 672,
          'format': '3 81234'
        },
        {
          'id': 160,
          'iso': 'no',
          'nicename': 'Norway',
          'phonecode': 47,
          'format': '406 12 345'
        },
        {
          'id': 161,
          'iso': 'om',
          'nicename': 'Oman',
          'phonecode': 968,
          'format': '9212 3456'
        },
        {
          'id': 162,
          'iso': 'pk',
          'nicename': 'Pakistan',
          'phonecode': 92,
          'format': '0301 2345678'
        },
        {
          'id': 163,
          'iso': 'pw',
          'nicename': 'Palau',
          'phonecode': 680,
          'format': '620 1234'
        },
        {
          'id': 164,
          'iso': 'ps',
          'nicename': 'Palestine',
          'phonecode': 970,
          'format': '0599 123 456'
        },
        {
          'id': 165,
          'iso': 'pa',
          'nicename': 'Panama',
          'phonecode': 507,
          'format': '6001 2345'
        },
        {
          'id': 166,
          'iso': 'pg',
          'nicename': 'Papua New Guinea',
          'phonecode': 675,
          'format': '681 2345'
        },
        {
          'id': 167,
          'iso': 'py',
          'nicename': 'Paraguay',
          'phonecode': 595,
          'format': '0961 456789'
        },
        {
          'id': 168,
          'iso': 'pe',
          'nicename': 'Peru',
          'phonecode': 51,
          'format': '912 345 678'
        },
        {
          'id': 169,
          'iso': 'ph',
          'nicename': 'Philippines',
          'phonecode': 63,
          'format': '0905 123 4567'
        },
        {
          'id': 170,
          'iso': 'pl',
          'nicename': 'Poland',
          'phonecode': 48,
          'format': '512 345 678'
        },
        {
          'id': 171,
          'iso': 'pt',
          'nicename': 'Portugal',
          'phonecode': 351,
          'format': '912 345 678'
        },
        {
          'id': 172,
          'iso': 'pr',
          'nicename': 'Puerto Rico',
          'phonecode': 1,
          'format': '(787) 234 5678'
        },
        {
          'id': 173,
          'iso': 'qa',
          'nicename': 'Qatar',
          'phonecode': 974,
          'format': '3312 3456'
        },
        {
          'id': 174,
          'iso': 're',
          'nicename': 'Réunion',
          'phonecode': 262,
          'format': '639 123456'
        },
        {
          'id': 175,
          'iso': 'ro',
          'nicename': 'Romania',
          'phonecode': 40,
          'format': '0712 345 678'
        },
        {
          'id': 176,
          'iso': 'ru',
          'nicename': 'Russia',
          'phonecode': 7,
          'format': '(912) 123 4567',
          'priority': 1
        },
        {
          'id': 177,
          'iso': 'rw',
          'nicename': 'Rwanda',
          'phonecode': 250,
          'format': '0720 123 456'
        },
        {
          'id': 180,
          'iso': 'kn',
          'nicename': 'Saint Kitts and Nevis',
          'phonecode': 1,
          'format': '(869) 765 2917'
        },
        {
          'id': 181,
          'iso': 'lc',
          'nicename': 'Saint Lucia',
          'phonecode': 1,
          'format': '(758) 284 5678'
        },
        {
          'id': 184,
          'iso': 'vc',
          'nicename': 'Saint Vincent and the Grenadines',
          'phonecode': 1,
          'format': '(784) 430 1234'
        },
        {
          'id': 185,
          'iso': 'ws',
          'nicename': 'Samoa',
          'phonecode': 684,
          'format': '601234'
        },
        {
          'id': 186,
          'iso': 'sm',
          'nicename': 'San Marino',
          'phonecode': 378,
          'format': '66 66 12 12'
        },
        {
          'id': 187,
          'iso': 'st',
          'nicename': 'Sao Tome and Principe',
          'phonecode': 239,
          'format': '981 2345'
        },
        {
          'id': 188,
          'iso': 'sa',
          'nicename': 'Saudi Arabia',
          'phonecode': 966,
          'format': '051 234 5678'
        },
        {
          'id': 189,
          'iso': 'sn',
          'nicename': 'Senegal',
          'phonecode': 221,
          'format': '70 123 45 67'
        },
        {
          'id': 190,
          'iso': 'rs',
          'nicename': 'Serbia',
          'phonecode': 381,
          'format': '060 1234567'
        },
        {
          'id': 191,
          'iso': 'sc',
          'nicename': 'Seychelles',
          'phonecode': 248,
          'format': '2 510 123'
        },
        {
          'id': 192,
          'iso': 'sl',
          'nicename': 'Sierra Leone',
          'phonecode': 232,
          'format': '(025) 123456'
        },
        {
          'id': 193,
          'iso': 'sg',
          'nicename': 'Singapore',
          'phonecode': 65,
          'format': '8123 4567'
        },
        {
          'id': 195,
          'iso': 'sk',
          'nicename': 'Slovakia',
          'phonecode': 421,
          'format': '0912 123 456'
        },
        {
          'id': 196,
          'iso': 'si',
          'nicename': 'Slovenia',
          'phonecode': 386,
          'format': '031 234 567'
        },
        {
          'id': 197,
          'iso': 'sb',
          'nicename': 'Solomon Islands',
          'phonecode': 677,
          'format': '74 21234'
        },
        {
          'id': 198,
          'iso': 'so',
          'nicename': 'Somalia',
          'phonecode': 252,
          'format': '7 1123456'
        },
        {
          'id': 199,
          'iso': 'za',
          'nicename': 'South Africa',
          'phonecode': 27,
          'format': '071 123 4567'
        },
        {
          'id': 200,
          'iso': 'kr',
          'nicename': 'South Korea',
          'phonecode': 82,
          'format': '010 1234 567'
        },
        {
          'id': 201,
          'iso': 'ss',
          'nicename': 'South Sudan',
          'phonecode': 211,
          'format': '0977 123 456'
        },
        {
          'id': 202,
          'iso': 'es',
          'nicename': 'Spain',
          'phonecode': 34,
          'format': '612 34 56 78'
        },
        {
          'id': 203,
          'iso': 'lk',
          'nicename': 'Sri Lanka',
          'phonecode': 94,
          'format': '071 234 5678'
        },
        {
          'id': 204,
          'iso': 'sd',
          'nicename': 'Sudan',
          'phonecode': 249,
          'format': '091 123 1234'
        },
        {
          'id': 205,
          'iso': 'sr',
          'nicename': 'Suriname',
          'phonecode': 597,
          'format': '741 2345'
        },
        {
          'id': 207,
          'iso': 'sz',
          'nicename': 'Swaziland',
          'phonecode': 268,
          'format': '7612 3456'
        },
        {
          'id': 208,
          'iso': 'se',
          'nicename': 'Sweden',
          'phonecode': 46,
          'format': '070 123 45 67'
        },
        {
          'id': 209,
          'iso': 'ch',
          'nicename': 'Switzerland',
          'phonecode': 41,
          'format': '078 123 45 67'
        },
        {
          'id': 210,
          'iso': 'sy',
          'nicename': 'Syria',
          'phonecode': 963,
          'format': '0944 567 890'
        },
        {
          'id': 211,
          'iso': 'tw',
          'nicename': 'Taiwan',
          'phonecode': 886,
          'format': '0912 345 678'
        },
        {
          'id': 212,
          'iso': 'tj',
          'nicename': 'Tajikistan',
          'phonecode': 992,
          'format': '917 123 456'
        },
        {
          'id': 213,
          'iso': 'tz',
          'nicename': 'Tanzania',
          'phonecode': 255,
          'format': '740 123 456'
        },
        {
          'id': 214,
          'iso': 'th',
          'nicename': 'Thailand',
          'phonecode': 66,
          'format': '081 234 5678'
        },
        {
          'id': 215,
          'iso': 'tl',
          'nicename': 'Timor-Leste',
          'phonecode': 670,
          'format': '7721 2345'
        },
        {
          'id': 216,
          'iso': 'tg',
          'nicename': 'Togo',
          'phonecode': 228,
          'format': '90 11 23 45'
        },
        {
          'id': 218,
          'iso': 'to',
          'nicename': 'Tonga',
          'phonecode': 676,
          'format': '771 5123'
        },
        {
          'id': 219,
          'iso': 'tt',
          'nicename': 'Trinidad and Tobago',
          'phonecode': 868,
          'format': '(868) 291 1234'
        },
        {
          'id': 220,
          'iso': 'tn',
          'nicename': 'Tunisia',
          'phonecode': 216,
          'format': '20 123 456'
        },
        {
          'id': 221,
          'iso': 'tr',
          'nicename': 'Turkey',
          'phonecode': 90,
          'format': '0501 234 56 78'
        },
        {
          'id': 222,
          'iso': 'tm',
          'nicename': 'Turkmenistan',
          'phonecode': 7370,
          'format': '8 66 123456'
        },
        {
          'id': 223,
          'iso': 'tc',
          'nicename': 'Turks and Caicos Islands',
          'phonecode': 1,
          'format': '(649) 231 1234'
        },
        {
          'id': 224,
          'iso': 'tv',
          'nicename': 'Tuvalu',
          'phonecode': 688,
          'format': '901234'
        },
        {
          'id': 225,
          'iso': 'ug',
          'nicename': 'Uganda',
          'phonecode': 256,
          'format': '0712 345678'
        },
        {
          'id': 226,
          'iso': 'ua',
          'nicename': 'Ukraine',
          'phonecode': 380,
          'format': '039 123 4567'
        },
        {
          'id': 227,
          'iso': 'ae',
          'nicename': 'United Arab Emirates',
          'phonecode': 971,
          'format': '050 123 4567'
        },
        {
          'id': 228,
          'iso': 'gb',
          'nicename': 'United Kingdom',
          'phonecode': 44,
          'format': '07400 123456',
          'priority': 1
        },
        {
          'id': 229,
          'iso': 'us',
          'nicename': 'United States',
          'phonecode': 1,
          'format': '(201) 555 0123',
          'priority': 1
        },
        {
          'id': 230,
          'iso': 'uy',
          'nicename': 'Uruguay',
          'phonecode': 598,
          'format': '094 231 234'
        },
        {
          'id': 231,
          'iso': 'uz',
          'nicename': 'Uzbekistan',
          'phonecode': 998,
          'format': '8 91 234 56 78'
        },
        {
          'id': 232,
          'iso': 'vu',
          'nicename': 'Vanuatu',
          'phonecode': 678,
          'format': '591 2345'
        },
        {
          'id': 234,
          'iso': 've',
          'nicename': 'Venezuela',
          'phonecode': 58,
          'format': '0412 1234567'
        },
        {
          'id': 235,
          'iso': 'vn',
          'nicename': 'Vietnam',
          'phonecode': 84,
          'format': '091 234 56 78'
        },
        {
          'id': 236,
          'iso': 'vi',
          'nicename': 'Virgin Islands, U.S.',
          'phonecode': 1,
          'format': '(340) 642 1234'
        },
        {
          'id': 237,
          'iso': 'ye',
          'nicename': 'Yemen',
          'phonecode': 967,
          'format': '0712 345 678'
        },
        {
          'id': 238,
          'iso': 'zm',
          'nicename': 'Zambia',
          'phonecode': 260,
          'format': '095 5123456'
        },
        {
          'id': 239,
          'iso': 'zw',
          'nicename': 'Zimbabwe',
          'phonecode': 263,
          'format': '071 123 4567'
        },
        {
          'id': 240,
          'iso': 'ax',
          'nicename': 'Åland Islands',
          'phonecode': 358,
          'format': '041 2345678'
        }
      ]
    }
  }
}
