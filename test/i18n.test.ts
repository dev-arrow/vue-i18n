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
  expect(i18n.missing).toBeUndefined()
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

test('messages', () => {
  const i18n = createI18n()
  expect(i18n.messages).toEqual({
    'en-US': {}
  })
})
