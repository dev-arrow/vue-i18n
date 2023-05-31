// utils
jest.mock('../src/utils', () => ({
  ...jest.requireActual('../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../src/utils'

import { createI18n } from '../src/i18n'

test('locale', () => {
  const i18n = createI18n()
  expect(i18n.locale).toEqual('en-US')
  i18n.locale = 'ja'
  expect(i18n.locale).toEqual('ja')
})

test('fallbackLocale', () => {
  const i18n = createI18n()
  expect(i18n.fallbackLocale).toEqual('en-US')
  i18n.fallbackLocale = 'ja'
  expect(i18n.fallbackLocale).toEqual('ja')
})

test('availableLocales', () => {
  const i18n = createI18n({
    messages: {
      en: {},
      ja: {},
      ru: {},
      fr: {}
    }
  })
  expect(i18n.availableLocales).toEqual(['en', 'ja', 'ru', 'fr'].sort())
})

test('formatter', () => {
  const mockWarn = warn as jest.MockedFunction<typeof warn>
  mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

  const i18n = createI18n({
    formatter: { interpolate () { return [] } }
  })

  expect(i18n.formatter).not.toBeUndefined()
  i18n.formatter = { interpolate () { return [] } }
  expect(mockWarn).toHaveBeenCalledTimes(3)
  expect(mockWarn.mock.calls[0][0])
    .toEqual(`not supportted 'formatter' option`)
  expect(mockWarn.mock.calls[1][0])
    .toEqual(`not support 'formatter' property`)
  expect(mockWarn.mock.calls[2][0])
    .toEqual(`not support 'formatter' property`)
})

test('missing', () => {
  const i18n = createI18n()
  expect(i18n.missing).toEqual(null)
  const handler = () => { return '' }
  i18n.missing = handler
  expect(i18n.missing).toEqual(handler)
})

test('silentTranslationWarn', () => {
  const i18n = createI18n()
  expect(i18n.silentTranslationWarn).toEqual(false)
  i18n.silentTranslationWarn = true
  expect(i18n.silentTranslationWarn).toEqual(true)
  i18n.silentTranslationWarn = /^hi.*$/
  expect(i18n.silentTranslationWarn).toEqual(/^hi.*$/)
})

test('silentFallbackWarn', () => {
  const i18n = createI18n()
  expect(i18n.silentFallbackWarn).toEqual(false)
  i18n.silentFallbackWarn = true
  expect(i18n.silentFallbackWarn).toEqual(true)
  i18n.silentFallbackWarn = /^hi.*$/
  expect(i18n.silentFallbackWarn).toEqual(/^hi.*$/)
})

test('formatFallbackMessages', () => {
  const i18n = createI18n()
  expect(i18n.formatFallbackMessages).toEqual(false)
  i18n.formatFallbackMessages = true
  expect(i18n.formatFallbackMessages).toEqual(true)
})

test('postTranslation', () => {
  const i18n = createI18n()
  expect(i18n.postTranslation).toEqual(null)
  const postTranslation = (str: string) => str.trim()
  i18n.postTranslation = postTranslation
  expect(i18n.postTranslation).toEqual(postTranslation)
})

test('messages', () => {
  const i18n = createI18n()
  expect(i18n.messages).toEqual({
    'en-US': {}
  })
})

test('t', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        name: 'kazupon',
        hello: 'Hello!',
        hi: 'hi {name}!',
        morning: 'good morning {0}',
        linked: 'hi @.upper:name'
      }
    }
  })

  expect(i18n.t('hello')).toEqual('Hello!')
  expect(i18n.t('hi', { name: 'kazupon' })).toEqual('hi kazupon!')
  expect(i18n.t('morning', ['kazupon'])).toEqual('good morning kazupon')
  expect(i18n.t('linked')).toEqual('hi KAZUPON')
})

test('tc', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        apple: 'no apples | one apple | {count} apples'
      }
    }
  })

  expect(i18n.tc('apple', 4)).toEqual('4 apples')
})

test('te', () => {
  const i18n = createI18n({
    locale: 'en',
    messages: {
      en: {
        message: {
          hello: 'Hello!'
        }
      }
    }
  })

  expect(i18n.te('message.hello')).toEqual(true)
  expect(i18n.te('message.hallo')).toEqual(false)
  expect(i18n.te('message.hallo', 'ja')).toEqual(false)
})

test('getLocaleMessage / setLocaleMessage / mergeLocaleMessage', () => {
  const i18n = createI18n({
    messages: {
      en: { hello: 'Hello!' }
    }
  })
  expect(i18n.getLocaleMessage('en')).toEqual({ hello: 'Hello!' })

  i18n.setLocaleMessage('en', { hi: 'Hi!'})
  expect(i18n.getLocaleMessage('en')).toEqual({ hi: 'Hi!' })

  i18n.mergeLocaleMessage('en', { hello: 'Hello!' })
  expect(i18n.getLocaleMessage('en')).toEqual({
    hello: 'Hello!',
    hi: 'Hi!'
  })
})
