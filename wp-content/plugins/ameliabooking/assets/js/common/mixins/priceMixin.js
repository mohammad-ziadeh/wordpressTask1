export default {

  data () {
    return {
      currencies: [
        {
          symbol: '$',
          name: 'US Dollar',
          symbol_native: '$',
          code: 'USD',
          iso: 'us'
        },
        {
          symbol: '€',
          name: 'Euro',
          symbol_native: '€',
          code: 'EUR',
          iso: 'eu'
        },
        {
          symbol: '£',
          name: 'British Pound Sterling',
          symbol_native: '£',
          code: 'GBP',
          iso: 'gb'
        },
        {
          symbol: 'CA$',
          name: 'Canadian Dollar',
          symbol_native: '$',
          code: 'CAD',
          iso: 'ca'
        },
        {
          symbol: 'FCFP',
          name: 'CFP Franc',
          symbol_native: 'FCFP',
          code: 'XPF',
          iso: 'fr'
        },
        {
          symbol: 'CHF',
          name: 'Swiss Franc',
          symbol_native: 'CHF',
          code: 'CHF',
          iso: 'ch'
        },
        {
          symbol: 'RUB',
          name: 'Russian Ruble',
          symbol_native: 'руб.',
          code: 'RUB',
          iso: 'ru'
        },
        {
          symbol: '¥',
          name: 'Japanese Yen',
          symbol_native: '￥',
          code: 'JPY',
          iso: 'jp'
        },
        {
          symbol: 'Af',
          name: 'Afghan Afghani',
          symbol_native: '؋',
          code: 'AFN',
          iso: 'af'
        },
        {
          symbol: 'ALL',
          name: 'Albanian Lek',
          symbol_native: 'Lek',
          code: 'ALL',
          iso: 'al'
        },
        {
          symbol: 'DA',
          name: 'Algerian Dinar',
          symbol_native: 'د.ج.‏',
          code: 'DZD',
          iso: 'dz'
        },
        {
          symbol: 'AR$',
          name: 'Argentine Peso',
          symbol_native: '$',
          code: 'ARS',
          iso: 'ar'
        },
        {
          symbol: 'AMD',
          name: 'Armenian Dram',
          symbol_native: 'դր.',
          code: 'AMD',
          iso: 'am'
        },
        {
          symbol: 'AU$',
          name: 'Australian Dollar',
          symbol_native: '$',
          code: 'AUD',
          iso: 'au'
        },
        {
          symbol: 'man.',
          name: 'Azerbaijani Manat',
          symbol_native: 'ман.',
          code: 'AZN',
          iso: 'az'
        },
        {
          symbol: 'BD',
          name: 'Bahraini Dinar',
          symbol_native: 'د.ب.‏',
          code: 'BHD',
          iso: 'bh'
        },
        {
          symbol: 'Tk',
          name: 'Bangladeshi Taka',
          symbol_native: '৳',
          code: 'BDT',
          iso: 'bd'
        },
        {
          symbol: 'BYR',
          name: 'Belarusian Ruble',
          symbol_native: 'BYR',
          code: 'BYR',
          iso: 'by'
        },
        {
          symbol: 'BZ$',
          name: 'Belize Dollar',
          symbol_native: '$',
          code: 'BZD',
          iso: 'bz'
        },
        {
          symbol: 'Bs',
          name: 'Bolivian Boliviano',
          symbol_native: 'Bs',
          code: 'BOB',
          iso: 'bo'
        },
        {
          symbol: 'KM',
          name: 'Bosnia-Herzegovina Convertible Mark',
          symbol_native: 'KM',
          code: 'BAM',
          iso: 'ba'
        },
        {
          symbol: 'BWP',
          name: 'Botswanan Pula',
          symbol_native: 'P',
          code: 'BWP',
          iso: 'bw'
        },
        {
          symbol: 'R$',
          name: 'Brazilian Real',
          symbol_native: 'R$',
          code: 'BRL',
          iso: 'br'
        },
        {
          symbol: 'BN$',
          name: 'Brunei Dollar',
          symbol_native: '$',
          code: 'BND',
          iso: 'bn'
        },
        {
          symbol: 'BGN',
          name: 'Bulgarian Lev',
          symbol_native: 'лв.',
          code: 'BGN',
          iso: 'bg'
        },
        {
          symbol: 'FBu',
          name: 'Burundian Franc',
          symbol_native: 'FBu',
          code: 'BIF',
          iso: 'bi'
        },
        {
          symbol: 'CFA',
          name: 'CFA Franc BCEAO',
          symbol_native: 'CFA',
          code: 'XOF',
          iso: 'auto'
        },
        {
          symbol: 'FCFA',
          name: 'CFA Franc BEAC',
          symbol_native: 'FCFA',
          code: 'XAF',
          iso: 'auto'
        },
        {
          symbol: 'KHR',
          name: 'Cambodian Riel',
          symbol_native: '៛',
          code: 'KHR',
          iso: 'kh'
        },
        {
          symbol: 'CV$',
          name: 'Cape Verdean Escudo',
          symbol_native: 'CV$',
          code: 'CVE',
          iso: 'cv'
        },
        {
          symbol: 'CLP',
          name: 'Chilean Peso',
          symbol_native: '$',
          code: 'CLP',
          iso: 'cl'
        },
        {
          symbol: 'CN¥',
          name: 'Chinese Yuan',
          symbol_native: 'CN¥',
          code: 'CNY',
          iso: 'cn'
        },
        {
          symbol: 'COP',
          name: 'Colombian Peso',
          symbol_native: '$',
          code: 'COP',
          iso: 'co'
        },
        {
          symbol: 'CF',
          name: 'Comorian Franc',
          symbol_native: 'FC',
          code: 'KMF',
          iso: 'km'
        },
        {
          symbol: 'CDF',
          name: 'Congolese Franc',
          symbol_native: 'FrCD',
          code: 'CDF',
          iso: 'cd'
        },
        {
          symbol: '₡',
          name: 'Costa Rican Colón',
          symbol_native: '₡',
          code: 'CRC',
          iso: 'cr'
        },
        {
          symbol: 'kn',
          name: 'Croatian Kuna',
          symbol_native: 'kn',
          code: 'HRK',
          iso: 'hr'
        },
        {
          symbol: 'Kč',
          name: 'Czech Republic Koruna',
          symbol_native: 'Kč',
          code: 'CZK',
          iso: 'cz'
        },
        {
          symbol: 'Dkk',
          name: 'Danish Krone',
          symbol_native: 'kr',
          code: 'DKK',
          iso: 'dk'
        },
        {
          symbol: 'Fdj',
          name: 'Djiboutian Franc',
          symbol_native: 'Fdj',
          code: 'DJF',
          iso: 'dj'
        },
        {
          symbol: 'RD$',
          name: 'Dominican Peso',
          symbol_native: 'RD$',
          code: 'DOP',
          iso: 'do'
        },
        {
          symbol: 'EGP',
          name: 'Egyptian Pound',
          symbol_native: 'ج.م.‏',
          code: 'EGP',
          iso: 'eg'
        },
        {
          symbol: 'Nfk',
          name: 'Eritrean Nakfa',
          symbol_native: 'Nfk',
          code: 'ERN',
          iso: 'er'
        },
        {
          symbol: 'Ekr',
          name: 'Estonian Kroon',
          symbol_native: 'kr',
          code: 'EEK',
          iso: 'ee'
        },
        {
          symbol: 'Br',
          name: 'Ethiopian Birr',
          symbol_native: 'Br',
          code: 'ETB',
          iso: 'et'
        },
        {
          symbol: 'GEL',
          name: 'Georgian Lari',
          symbol_native: 'GEL',
          code: 'GEL',
          iso: 'ge'
        },
        {
          symbol: 'GH₵',
          name: 'Ghanaian Cedi',
          symbol_native: 'GH₵',
          code: 'GHS',
          iso: 'gh'
        },
        {
          symbol: 'GTQ',
          name: 'Guatemalan Quetzal',
          symbol_native: 'Q',
          code: 'GTQ',
          iso: 'gt'
        },
        {
          symbol: 'FG',
          name: 'Guinean Franc',
          symbol_native: 'FG',
          code: 'GNF',
          iso: 'gn'
        },
        {
          symbol: 'HNL',
          name: 'Honduran Lempira',
          symbol_native: 'L',
          code: 'HNL',
          iso: 'hn'
        },
        {
          symbol: 'HK$',
          name: 'Hong Kong Dollar',
          symbol_native: '$',
          code: 'HKD',
          iso: 'hk'
        },
        {
          symbol: 'Ft',
          name: 'Hungarian Forint',
          symbol_native: 'Ft',
          code: 'HUF',
          iso: 'hu'
        },
        {
          symbol: 'kr',
          name: 'Icelandic Króna',
          symbol_native: 'kr',
          code: 'ISK',
          iso: 'is'
        },
        {
          symbol: 'INR',
          name: 'Indian Rupee',
          symbol_native: 'টকা',
          code: 'INR',
          iso: 'in'
        },
        {
          symbol: 'Rp',
          name: 'Indonesian Rupiah',
          symbol_native: 'Rp',
          code: 'IDR',
          iso: 'id'
        },
        {
          symbol: 'IRR',
          name: 'Iranian Rial',
          symbol_native: '﷼',
          code: 'IRR',
          iso: 'ir'
        },
        {
          symbol: 'IQD',
          name: 'Iraqi Dinar',
          symbol_native: 'د.ع.‏',
          code: 'IQD',
          iso: 'iq'
        },
        {
          symbol: '₪',
          name: 'Israeli New Sheqel',
          symbol_native: '₪',
          code: 'ILS',
          iso: 'il'
        },
        {
          symbol: 'J$',
          name: 'Jamaican Dollar',
          symbol_native: '$',
          code: 'JMD',
          iso: 'jm'
        },
        {
          symbol: 'JD',
          name: 'Jordanian Dinar',
          symbol_native: 'د.أ.‏',
          code: 'JOD',
          iso: 'jo'
        },
        {
          symbol: 'KZT',
          name: 'Kazakhstani Tenge',
          symbol_native: 'тңг.',
          code: 'KZT',
          iso: 'kz'
        },
        {
          symbol: 'Ksh',
          name: 'Kenyan Shilling',
          symbol_native: 'Ksh',
          code: 'KES',
          iso: 'ke'
        },
        {
          symbol: 'KD',
          name: 'Kuwaiti Dinar',
          symbol_native: 'د.ك.‏',
          code: 'KWD',
          iso: 'kw'
        },
        {
          symbol: 'Ls',
          name: 'Latvian Lats',
          symbol_native: 'Ls',
          code: 'LVL',
          iso: 'lv'
        },
        {
          symbol: 'LB£',
          name: 'Lebanese Pound',
          symbol_native: 'ل.ل.‏',
          code: 'LBP',
          iso: 'lb'
        },
        {
          symbol: 'LD',
          name: 'Libyan Dinar',
          symbol_native: 'د.ل.‏',
          code: 'LYD',
          iso: 'ly'
        },
        {
          symbol: 'Lt',
          name: 'Lithuanian Litas',
          symbol_native: 'Lt',
          code: 'LTL',
          iso: 'lt'
        },
        {
          symbol: 'MOP$',
          name: 'Macanese Pataca',
          symbol_native: 'MOP$',
          code: 'MOP',
          iso: 'mo'
        },
        {
          symbol: 'MKD',
          name: 'Macedonian Denar',
          symbol_native: 'MKD',
          code: 'MKD',
          iso: 'mk'
        },
        {
          symbol: 'MGA',
          name: 'Malagasy Ariary',
          symbol_native: 'MGA',
          code: 'MGA',
          iso: 'mg'
        },
        {
          symbol: 'RM',
          name: 'Malaysian Ringgit',
          symbol_native: 'RM',
          code: 'MYR',
          iso: 'my'
        },
        {
          symbol: 'MURs',
          name: 'Mauritian Rupee',
          symbol_native: 'MURs',
          code: 'MUR',
          iso: 'mu'
        },
        {
          symbol: 'MX$',
          name: 'Mexican Peso',
          symbol_native: '$',
          code: 'MXN',
          iso: 'mx'
        },
        {
          symbol: 'MDL',
          name: 'Moldovan Leu',
          symbol_native: 'MDL',
          code: 'MDL',
          iso: 'md'
        },
        {
          symbol: 'MAD',
          name: 'Moroccan Dirham',
          symbol_native: 'د.م.‏',
          code: 'MAD',
          iso: 'ma'
        },
        {
          symbol: 'MTn',
          name: 'Mozambican Metical',
          symbol_native: 'MTn',
          code: 'MZN',
          iso: 'mz'
        },
        {
          symbol: 'MMK',
          name: 'Myanma Kyat',
          symbol_native: 'K',
          code: 'MMK',
          iso: 'mm'
        },
        {
          symbol: 'N$',
          name: 'Namibian Dollar',
          symbol_native: 'N$',
          code: 'NAD',
          iso: 'na'
        },
        {
          symbol: 'NPRs',
          name: 'Nepalese Rupee',
          symbol_native: 'नेरू',
          code: 'NPR',
          iso: 'np'
        },
        {
          symbol: 'NT$',
          name: 'New Taiwan Dollar',
          symbol_native: 'NT$',
          code: 'TWD',
          iso: 'tw'
        },
        {
          symbol: 'NZ$',
          name: 'New Zealand Dollar',
          symbol_native: '$',
          code: 'NZD',
          iso: 'nz'
        },
        {
          symbol: 'C$',
          name: 'Nicaraguan Córdoba',
          symbol_native: 'C$',
          code: 'NIO',
          iso: 'ni'
        },
        {
          symbol: '₦',
          name: 'Nigerian Naira',
          symbol_native: '₦',
          code: 'NGN',
          iso: 'ng'
        },
        {
          symbol: 'kr',
          name: 'Norwegian Krone',
          symbol_native: 'kr',
          code: 'NOK',
          iso: 'no'
        },
        {
          symbol: 'OMR',
          name: 'Omani Rial',
          symbol_native: 'ر.ع.‏',
          code: 'OMR',
          iso: 'om'
        },
        {
          symbol: 'PKRs',
          name: 'Pakistani Rupee',
          symbol_native: '₨',
          code: 'PKR',
          iso: 'pk'
        },
        {
          symbol: 'B/.',
          name: 'Panamanian Balboa',
          symbol_native: 'B/.',
          code: 'PAB',
          iso: 'pa'
        },
        {
          symbol: '₲',
          name: 'Paraguayan Guarani',
          symbol_native: '₲',
          code: 'PYG',
          iso: 'py'
        },
        {
          symbol: 'S/.',
          name: 'Peruvian Nuevo Sol',
          symbol_native: 'S/.',
          code: 'PEN',
          iso: 'pe'
        },
        {
          symbol: '₱',
          name: 'Philippine Peso',
          symbol_native: '₱',
          code: 'PHP',
          iso: 'ph'
        },
        {
          symbol: 'zł',
          name: 'Polish Zloty',
          symbol_native: 'zł',
          code: 'PLN',
          iso: 'pl'
        },
        {
          symbol: 'QR',
          name: 'Qatari Rial',
          symbol_native: 'ر.ق.‏',
          code: 'QAR',
          iso: 'qa'
        },
        {
          symbol: 'RON',
          name: 'Romanian Leu',
          symbol_native: 'RON',
          code: 'RON',
          iso: 'ro'
        },
        {
          symbol: 'RWF',
          name: 'Rwandan Franc',
          symbol_native: 'FR',
          code: 'RWF',
          iso: 'rw'
        },
        {
          symbol: 'SR',
          name: 'Saudi Riyal',
          symbol_native: 'ر.س.‏',
          code: 'SAR',
          iso: 'sa'
        },
        {
          symbol: 'rsd.',
          name: 'Serbian Dinar',
          symbol_native: 'дин.',
          code: 'RSD',
          iso: 'rs'
        },
        {
          symbol: 'S$',
          name: 'Singapore Dollar',
          symbol_native: '$',
          code: 'SGD',
          iso: 'sg'
        },
        {
          symbol: 'Ssh',
          name: 'Somali Shilling',
          symbol_native: 'Ssh',
          code: 'SOS',
          iso: 'so'
        },
        {
          symbol: 'R',
          name: 'South African Rand',
          symbol_native: 'R',
          code: 'ZAR',
          iso: 'za'
        },
        {
          symbol: '₩',
          name: 'South Korean Won',
          symbol_native: '₩',
          code: 'KRW',
          iso: 'kr'
        },
        {
          symbol: '₭',
          name: 'Lao kip',
          symbol_native: '₭',
          code: 'LAK',
          iso: 'la'
        },
        {
          symbol: 'SLRs',
          name: 'Sri Lankan Rupee',
          symbol_native: 'SL Re',
          code: 'LKR',
          iso: 'lk'
        },
        {
          symbol: 'SDG',
          name: 'Sudanese Pound',
          symbol_native: 'SDG',
          code: 'SDG',
          iso: 'sd'
        },
        {
          symbol: 'kr',
          name: 'Swedish Krona',
          symbol_native: 'kr',
          code: 'SEK',
          iso: 'se'
        },
        {
          symbol: 'SY£',
          name: 'Syrian Pound',
          symbol_native: 'ل.س.‏',
          code: 'SYP',
          iso: 'sy'
        },
        {
          symbol: 'TSh',
          name: 'Tanzanian Shilling',
          symbol_native: 'TSh',
          code: 'TZS',
          iso: 'tz'
        },
        {
          symbol: '฿',
          name: 'Thai Baht',
          symbol_native: '฿',
          code: 'THB',
          iso: 'th'
        },
        {
          symbol: 'T$',
          name: 'Tongan Paʻanga',
          symbol_native: 'T$',
          code: 'TOP',
          iso: 'to'
        },
        {
          symbol: 'TT$',
          name: 'Trinidad and Tobago Dollar',
          symbol_native: '$',
          code: 'TTD',
          iso: 'tt'
        },
        {
          symbol: 'DT',
          name: 'Tunisian Dinar',
          symbol_native: 'د.ت.‏',
          code: 'TND',
          iso: 'tn'
        },
        {
          symbol: 'TL',
          name: 'Turkish Lira',
          symbol_native: 'TL',
          code: 'TRY',
          iso: 'tr'
        },
        {
          symbol: 'USh',
          name: 'Ugandan Shilling',
          symbol_native: 'USh',
          code: 'UGX',
          iso: 'ug'
        },
        {
          symbol: '₴',
          name: 'Ukrainian Hryvnia',
          symbol_native: '₴',
          code: 'UAH',
          iso: 'ua'
        },
        {
          symbol: 'AED',
          name: 'United Arab Emirates Dirham',
          symbol_native: 'د.إ.‏',
          code: 'AED',
          iso: 'ae'
        },
        {
          symbol: '$U',
          name: 'Uruguayan Peso',
          symbol_native: '$',
          code: 'UYU',
          iso: 'uy'
        },
        {
          symbol: 'UZS',
          name: 'Uzbekistan Som',
          symbol_native: 'UZS',
          code: 'UZS',
          iso: 'uz'
        },
        {
          symbol: 'Bs.S.',
          name: 'Venezuelan Bolívar',
          symbol_native: 'Bs.S.',
          code: 'VES',
          iso: 've'
        },
        {
          symbol: '₫',
          name: 'Vietnamese Dong',
          symbol_native: '₫',
          code: 'VND',
          iso: 'vn'
        },
        {
          symbol: 'YR',
          name: 'Yemeni Rial',
          symbol_native: 'ر.ي.‏',
          code: 'YER',
          iso: 'ye'
        },
        {
          symbol: 'ZK',
          name: 'Zambian Kwacha',
          symbol_native: 'ZK',
          code: 'ZMK',
          iso: 'zm'
        }
      ],

      thousandSeparatorMap: {
        1: ',',
        2: '.',
        3: ' ',
        4: ' '
      },

      decimalSeparatorMap: {
        1: '.',
        2: ',',
        3: '.',
        4: ','
      }
    }
  },

  methods: {

    getCurrencySymbol (isBackend = false) {
      let defaultCurrency = this.currencies.find(c => c.code === this.$root.settings.payments.currencyCode)
      // fix for "Indian Rupee" - show INR on backend pages instead of defaultCurrency.symbol_native (টকা)
      return (defaultCurrency && isBackend && defaultCurrency.code !== 'INR') ? defaultCurrency.symbol_native
        : (isBackend && defaultCurrency.code === 'INR') ? defaultCurrency.code : this.$root.settings.payments.currency
    },

    getPriceThousandSeparator () {
      return this.thousandSeparatorMap[this.$root.settings.payments.priceSeparator]
    },

    getPriceDecimalSeparator () {
      return this.decimalSeparatorMap[this.$root.settings.payments.priceSeparator]
    },

    getPriceNumberOfDecimalPlaces () {
      return this.$root.settings.payments.priceNumberOfDecimals
    },

    getPricePrefix (isBackend = false) {
      if (this.$root.settings.payments.priceSymbolPosition === 'after' || this.$root.settings.payments.priceSymbolPosition === 'afterWithSpace') {
        return ''
      } else if (this.$root.settings.payments.priceSymbolPosition === 'before') {
        return this.getCurrencySymbol(isBackend)
      } else {
        return this.getCurrencySymbol(isBackend) + ' '
      }
    },

    getPriceSuffix (isBackend = false) {
      if (this.$root.settings.payments.priceSymbolPosition === 'before' || this.$root.settings.payments.priceSymbolPosition === 'beforeWithSpace') {
        return ''
      } else if (this.$root.settings.payments.priceSymbolPosition === 'after') {
        return this.getCurrencySymbol(isBackend)
      } else {
        return ' ' + this.getCurrencySymbol(isBackend)
      }
    },

    getFormattedPrice (price, showCurrency = true) {
      let decimalPlaces = this.getPriceNumberOfDecimalPlaces()
      let thousandSeparator = this.getPriceThousandSeparator()
      let decimalSeparator = this.getPriceDecimalSeparator()
      let pricePrefix = this.getPricePrefix()
      let priceSuffix = this.getPriceSuffix()

      let i = parseInt(price = Math.abs(+price || 0).toFixed(decimalPlaces)) + ''
      let j = i.length > 3 ? i.length % 3 : 0

      return (showCurrency ? pricePrefix : '') + (j ? i.substr(0, j) + thousandSeparator : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandSeparator) + (decimalPlaces ? decimalSeparator + Math.abs(price - i).toFixed(decimalPlaces).slice(2) : '') + (showCurrency ? priceSuffix : '')
    },

    getPercentage (amount, percentage) {
      return amount * percentage / 100
    },
  },

  computed: {

    moneyComponentData () {
      return {
        decimal: this.getPriceDecimalSeparator(),
        thousands: this.getPriceThousandSeparator(),
        prefix: this.getPricePrefix(true),
        suffix: this.getPriceSuffix(true),
        precision: this.getPriceNumberOfDecimalPlaces(),
        masked: false
      }
    }

  }

}
