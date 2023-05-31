import { createI18nComposer, MissingHandler } from '../src/composition'
import { watch } from 'vue'

describe('locale', () => {
  test('default value', () => {
    const { locale } = createI18nComposer({})
    expect(locale.value).toEqual('en-US')
  })

  test('initialize at composer creating', () => {
    const { locale } = createI18nComposer({ locale: 'ja' })
    expect(locale.value).toEqual('ja')
  })

  test('reactivity', done => {
    const { locale } = createI18nComposer({})
    watch(locale, () => {
      expect(locale.value).toEqual('en')
      done()
    })
    locale.value = 'en'
  })
})

describe('fallbackLocales', () => {
  test('default value', () => {
    const { fallbackLocales } = createI18nComposer({})
    expect(fallbackLocales.value).toEqual([])
  })

  test('initialize at composer creating', () => {
    const { fallbackLocales } = createI18nComposer({ fallbackLocales: ['ja'] })
    expect(fallbackLocales.value).toEqual(['ja'])
  })
})

describe('availableLocales', () => {
  test('not initialize messages at composer creating', () => {
    const { availableLocales } = createI18nComposer({})
    expect(availableLocales).toEqual(['en-US'])
  })

  test('initialize messages at composer creating', () => {
    const { availableLocales } = createI18nComposer({
      messages: {
        en: {},
        ja: {},
        ru: {},
        fr: {}
      }
    })
    expect(availableLocales).toEqual(['en', 'ja', 'ru', 'fr'].sort())
  })
})

describe('messages', () => {
  test('default value', () => {
    const { messages } = createI18nComposer({})
    expect(messages.value).toEqual({
      'en-US': {}
    })
  })

  test('initialize at composer creating', () => {
    const { messages } = createI18nComposer({
      messages: {
        en: { hello: 'Hello,world!' },
        ja: {
          hello: 'こんにちは、世界！',
          nest: {
            foo: {
              bar: 'ばー'
            }
          }
        }
      }
    })
    expect(messages.value).toEqual({
      en: { hello: 'Hello,world!' },
      ja: {
        hello: 'こんにちは、世界！',
        nest: {
          foo: {
            bar: 'ばー'
          }
        }
      }
    })
  })
})

describe('datetimeFormats', () => {
  test('default value', () => {
    const { datetimeFormats } = createI18nComposer({})
    expect(datetimeFormats.value).toEqual({
      'en-US': {}
    })
  })

  test('initialize at composer creating', () => {
    const { datetimeFormats } = createI18nComposer({
      datetimeFormats: {
        'en-US': {
          short: {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
          }
        },
        'ja-JP': {
          short: {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
          }
        }
      }
    })
    expect(datetimeFormats.value).toEqual({
      'en-US': {
        short: {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit'
        }
      },
      'ja-JP': {
        short: {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit'
        }
      }
    })
  })
})

describe('numberFormats', () => {
  test('default value', () => {
    const { numberFormats } = createI18nComposer({})
    expect(numberFormats.value).toEqual({
      'en-US': {}
    })
  })

  test('initialize at composer creating', () => {
    const { numberFormats } = createI18nComposer({
      numberFormats: {
        'en-US': {
          currency: {
            style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
          }
        },
        'ja-JP': {
          currency: {
            style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
          }
        }
      }
    })
    expect(numberFormats.value).toEqual({
      'en-US': {
        currency: {
          style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
        }
      },
      'ja-JP': {
        currency: {
          style: 'currency', currency: 'JPY', currencyDisplay: 'symbol'
        }
      }
    })
  })
})

describe('modifiers', () => {
  test('default', () => {
    const { modifiers } = createI18nComposer({})
    expect(modifiers).toEqual({})
  })

  test('initialize at composer creating', () => {
    const _modifiers = {
      kebab: (str: string) => str.replace(/\s+/g, '-').toLowerCase()
    }
    const { modifiers, t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: {
          hello: 'hello world',
          hi: 'hi @.kebab:hello'
        }
      },
      modifiers: _modifiers
    })
    expect(modifiers).toEqual(_modifiers)
    expect(t('hi')).toEqual('hi hello-world')
  })
})

describe('pluralRules', () => {
  test('default', () => {
    const { pluralRules } = createI18nComposer({})
    expect(pluralRules).toBeUndefined()
  })

  test('initialize at composer creating', () => {
    const _pluralRules = {
      en: () => { return 0 }
    }
    const { pluralRules } = createI18nComposer({
      pluralRules: _pluralRules
    })
    expect(pluralRules).toEqual(_pluralRules)
  })
})

describe('missingWarn', () => {
  test('default', () => {
    const { missingWarn } = createI18nComposer({})
    expect(missingWarn).toEqual(true)
  })

  test('initialize at composer creating: boolean', () => {
    const { missingWarn } = createI18nComposer({ missingWarn: false })
    expect(missingWarn).toEqual(false)
  })

  test('initialize at composer creating: regexp', () => {
    const { missingWarn } = createI18nComposer({ missingWarn: /^(hi|hello)/ })
    expect(missingWarn).toEqual(/^(hi|hello)/)
  })
})

describe('fallbackWarn', () => {
  test('default', () => {
    const { fallbackWarn } = createI18nComposer({})
    expect(fallbackWarn).toEqual(true)
  })

  test('initialize at composer creating: boolean', () => {
    const { fallbackWarn } = createI18nComposer({ fallbackWarn: false })
    expect(fallbackWarn).toEqual(false)
  })

  test('initialize at composer creating: regexp', () => {
    const { fallbackWarn } = createI18nComposer({ fallbackWarn: /^(hi|hello)/ })
    expect(fallbackWarn).toEqual(/^(hi|hello)/)
  })
})

describe('fallbackFormat', () => {
  test('default', () => {
    const { fallbackFormat } = createI18nComposer({})
    expect(fallbackFormat).toEqual(false)
  })

  test('initialize at composer creating', () => {
    const { fallbackFormat } = createI18nComposer({ fallbackFormat: true })
    expect(fallbackFormat).toEqual(true)
  })
})

describe('postTranslation', () => {
  test('default', () => {
    const { getPostTranslationHandler, setPostTranslationHandler, t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { hello: ' hello world! ' }
      }
    })
    expect(getPostTranslationHandler()).toEqual(null)

    const handler = (str: string) => str.trim()
    setPostTranslationHandler(handler)
    expect(t('hello')).toEqual('hello world!')
    expect(getPostTranslationHandler()).toEqual(handler)
  })

  test('initialize at composer creating', () => {
    const handler = (str: string) => str.trim()
    const { getPostTranslationHandler, t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { hello: ' hello world! ' }
      },
      postTranslation: handler
    })
    expect(t('hello')).toEqual('hello world!')
    expect(getPostTranslationHandler()).toEqual(handler)
  })
})

describe('getMissingHandler / setMissingHandler', () => {
  test('default', () => {
    const { getMissingHandler, setMissingHandler } = createI18nComposer({})
    expect(getMissingHandler()).toEqual(null)

    const missing = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
    setMissingHandler(missing as MissingHandler)
    expect(getMissingHandler()).toEqual(missing)
  })

  test('initialize at composer creating', () => {
    const missing = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
    const { getMissingHandler } = createI18nComposer({ missing })
    expect(getMissingHandler()).toEqual(missing)
  })
})

describe('t', () => {
  test('basic', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' }
      }
    })
    expect(t('hi')).toEqual('hi kazupon !')
  })

  test('list', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { hi: 'hi {0} !' }
      }
    })
    expect(t('hi', { list: ['kazupon']})).toEqual('hi kazupon !')
  })

  test('named', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { hi: 'hi {name} !' }
      }
    })
    expect(t('hi', { named: { name: 'kazupon' } })).toEqual('hi kazupon !')
  })

  test('linked', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hi: 'hi @.upper:name !'
        }
      }
    })
    expect(t('hi')).toEqual('hi KAZUPON !')
  })

  test('plural', () => {
    const { t } = createI18nComposer({
      locale: 'en',
      messages: {
        en: { apple: 'no apples | one apple | {count} apples' }
      }
    })
    expect(t('apple', { plural: 0 })).toEqual('no apples')
    expect(t('apple', { plural: 1 })).toEqual('one apple')
    expect(t('apple', { plural: 10 })).toEqual('10 apples')
    expect(t('apple', { plural: 10, named: { count: 20 } })).toEqual('20 apples')
  })
})

test('d', () => {
  const { d } = createI18nComposer({
    locale: 'en-US',
    fallbackLocales: ['ja-JP'],
    datetimeFormats: {
      'en-US': {
        short: {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York'
        }
      },
      'ja-JP': {
        long: {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tokyo'
        },
        short: {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo'
        }
      }
    }
  })
  const dt = new Date(Date.UTC(2012, 11, 20, 3, 0, 0))
  expect(d(dt, { key: 'long', fallbackWarn: false })).toEqual('2012/12/20 12:00:00')
})

test('n', () => {
  const { n } = createI18nComposer({
    locale: 'en-US',
    fallbackLocales: ['ja-JP'],
    numberFormats: {
      'en-US': {
        currency: {
          style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
        },
        decimal: {
          style: 'decimal', useGrouping: false
        }
      },
      'ja-JP': {
        currency: {
          style: 'currency', currency: 'JPY'/*, currencyDisplay: 'symbol'*/
        },
        numeric: {
          style: 'decimal', useGrouping: false
        },
        percent: {
          style: 'percent', useGrouping: false
        }
      }
    }
  })
  expect(n(0.99, { key: 'percent', fallbackWarn: false })).toEqual('99%')
})

describe('getLocaleMessage / setLocaleMessage / mergeLocaleMessage', () => {
  test('basic', () => {
    const { getLocaleMessage, setLocaleMessage, mergeLocaleMessage } = createI18nComposer({
      messages: {
        en: { hello: 'Hello!' }
      }
    })
    expect(getLocaleMessage('en')).toEqual({ hello: 'Hello!' })

    setLocaleMessage('en', { hi: 'Hi!'})
    expect(getLocaleMessage('en')).toEqual({ hi: 'Hi!' })

    mergeLocaleMessage('en', { hello: 'Hello!' })
    expect(getLocaleMessage('en')).toEqual({
      hello: 'Hello!',
      hi: 'Hi!'
    })
  })
})

describe('getDateTimeFormat / setDateTimeFormat / mergeDateTimeFormat', () => {
  test('basci', () => {
    const { getDateTimeFormat, setDateTimeFormat, mergeDateTimeFormat } = createI18nComposer({
      datetimeFormats: {
        'en-US': {
          short: {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
          }
        }
      }
    })
    expect(getDateTimeFormat('en-US')).toEqual({
      short: {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }
    })

    setDateTimeFormat('en-US', {
      long: {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }
    })
    expect(getDateTimeFormat('en-US')).toEqual({
      long: {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }
    })

    mergeDateTimeFormat('en-US', {
      short: {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }
    })
    expect(getDateTimeFormat('en-US')).toEqual({
      short: {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      },
      long: {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }
    })
  })
})

describe('getNumberFormat / setNumberFormat / mergeNumberFormat', () => {
  test('basic', () => {
    const { getNumberFormat, setNumberFormat, mergeNumberFormat } = createI18nComposer({
      numberFormats: {
        'en-US': {
          currency: {
            style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
          }
        }
      }
    })
    expect(getNumberFormat('en-US')).toEqual({
      currency: {
        style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
      }
    })

    setNumberFormat('en-US', {
      decimal: {
        style: 'decimal', useGrouping: false
      }
    })
    expect(getNumberFormat('en-US')).toEqual({
      decimal: {
        style: 'decimal', useGrouping: false
      }
    })

    mergeNumberFormat('en-US', {
      currency: {
        style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
      }
    })
    expect(getNumberFormat('en-US')).toEqual({
      currency: {
        style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
      },
      decimal: {
        style: 'decimal', useGrouping: false
      }
    })
  })
})
