// utils
jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  warn: jest.fn()
}))
import { warn } from '../../src/utils'

import { createRuntimeContext as context, translate, TRANSLATE_NOT_REOSLVED } from '../../src/runtime'

describe('features', () => {
  test('simple text', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' }
      }
    })
    expect(translate(ctx, 'hi')).toEqual('hi kazupon !')
  })

  test('list', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi {0} !' }
      }
    })
    expect(translate(ctx, 'hi', { list: ['kazupon']})).toEqual('hi kazupon !')
  })

  test('named', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi {name} !' }
      }
    })
    expect(translate(ctx, 'hi', { named: { name: 'kazupon' } })).toEqual('hi kazupon !')
  })

  test('linked', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {
          name: 'kazupon',
          hi: 'hi @.upper:name !'
        }
      }
    })
    expect(translate(ctx, 'hi')).toEqual('hi KAZUPON !')
  })

  test('plural', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { apple: 'no apples | one apple | {count} apples' }
      }
    })
    expect(translate(ctx, 'apple', { plural: 0 })).toEqual('no apples')
    expect(translate(ctx, 'apple', { plural: 1 })).toEqual('one apple')
    expect(translate(ctx, 'apple', { plural: 10 })).toEqual('10 apples')
    expect(translate(ctx, 'apple', { plural: 10, named: { count: 20 } })).toEqual('20 apples')
  })
})

describe('locale', () => {
  test('option', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: { hi: 'hi kazupon !' },
        ja: { hi: 'こんにちは　かずぽん！'}
      }
    })
    expect(translate(ctx, 'hi', { locale: 'ja' })).toEqual('こんにちは　かずぽん！')
  })
})

describe('default message', () => {
  test('string message option', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })
    expect(
      translate(ctx, 'hello', { default: 'hello, default message!' })
    ).toEqual(
      'hello, default message!'
    )
  })

  test('true option', () => {
    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })
    expect(
      translate(ctx, 'hi {name}!', {
        named: { name: 'kazupon' },
        default: true
      })
    ).toEqual(
      'hi kazupon!'
    )
  })
})

describe('missing', () => {
  test('none missing handler', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn.mock.calls[0][0])
      .toEqual(`Cannot translate the value of 'hello'. Use the value of key as default.`)
  })

  test('missing handler', () => {
    const ctx = context({
      locale: 'en',
      missing: (c, locale, key) => {
        expect(c).toEqual(ctx)
        expect(locale).toEqual('en')
        expect(key).toEqual('hello')
        return 'HELLO'
      },
      messages: {
        en: {}
      }
    })
    expect(translate(ctx, 'hello')).toEqual('HELLO')
  })
})

describe('missingWarn', () => {
  test('false', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      missingWarn: false,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('regex', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      missingWarn: /^hi/,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hi kazupon!')).toEqual('hi kazupon!')
    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn).toHaveBeenCalledTimes(1)
  })

  test('missingWarn option', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello', { missingWarn: false })).toEqual('hello')
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

describe('fallbackWarn', () => {
  test('not specify fallbackLocales', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      missingWarn: false,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hello')).toEqual('hello')
    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('specify fallbackLocales', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja'],
      missingWarn: false,
      messages: {
        en: {},
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    expect(translate(ctx, 'hello')).toEqual('こんにちは！')
    expect(mockWarn).toHaveBeenCalled()
    expect(mockWarn.mock.calls[0][0])
      .toEqual(`Fall back to translate 'hello' with 'ja' locale.`)
  })

  test('not found fallback message', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja', 'fr'],
      missingWarn: false,
      messages: {
        en: {},
        ja: {}
      }
    })

    expect(translate(ctx, 'hello.world')).toEqual('hello.world')
    expect(mockWarn).toHaveBeenCalledTimes(2)
    expect(mockWarn.mock.calls[0][0])
      .toEqual(`Fall back to translate 'hello.world' with 'ja,fr' locale.`)
    expect(mockWarn.mock.calls[1][0])
      .toEqual(`Fall back to translate 'hello.world' with 'fr' locale.`)
  })

  test('false', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja', 'fr'],
      missingWarn: false,
      fallbackWarn: false,
      messages: {
        en: {},
        ja: {}
      }
    })

    expect(translate(ctx, 'hello.world')).toEqual('hello.world')
    expect(mockWarn).toHaveBeenCalledTimes(0)
  })

  test('regex', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja', 'fr'],
      missingWarn: false,
      fallbackWarn: /^hello/,
      messages: {
        en: {},
        ja: {}
      }
    })

    expect(translate(ctx, 'hello.world')).toEqual('hello.world')
    expect(mockWarn).toHaveBeenCalledTimes(2)
  })

  test('fallbackWarn option', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja'],
      missingWarn: false,
      messages: {
        en: {},
        ja: {
          hello: 'こんにちは！'
        }
      }
    })

    expect(translate(ctx, 'hello')).toEqual('こんにちは！')
    expect(translate(ctx, 'hi', { fallbackWarn: false })).toEqual('hi')
    expect(mockWarn).toHaveBeenCalledTimes(1)
  })
})

describe('fallbackFormat', () => {
  test('specify true', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackFormat: true,
      messages: {
        en: {}
      }
    })

    expect(translate(ctx, 'hi, {name}!', { named: { name: 'kazupon' } })).toEqual('hi, kazupon!')
    expect(mockWarn).not.toHaveBeenCalled()
  })

  test('overrided with default option', () => {
    const mockWarn = warn as jest.MockedFunction<typeof warn>
    mockWarn.mockImplementation(() => {}) // eslint-disable-line @typescript-eslint/no-empty-function

    const ctx = context({
      locale: 'en',
      fallbackFormat: true,
      messages: {
        en: {}
      }
    })

    expect(
      translate(
        ctx,
        'hi, {name}!',
        { named: { name: 'kazupon' }, default: 'hello, {name}!' })
    ).toEqual('hello, kazupon!')
    expect(mockWarn).not.toHaveBeenCalled()
  })
})

describe('unresolving', () => {
  test('fallbackWarn is true', () => {
    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja', 'fr'],
      missingWarn: false,
      fallbackWarn: /^hello/,
      unresolving: true,
      messages: {
        en: {},
        ja: {}
      }
    })
    expect(translate(ctx, 'hello.world')).toEqual(TRANSLATE_NOT_REOSLVED)
  })

  test('fallbackWarn is false', () => {
    const ctx = context({
      locale: 'en',
      fallbackLocales: ['ja', 'fr'],
      missingWarn: false,
      fallbackWarn: false,
      unresolving: true,
      messages: {
        en: {},
        ja: {}
      }
    })
    expect(translate(ctx, 'hello.world')).toEqual(TRANSLATE_NOT_REOSLVED)
  })
})

describe('pluralRule', () => {
  test('basic', () => {
    const pluralRules = {
      ru: (choice, choicesLength, orgRule) => {
        if (choice === 0) { return 0 }

        const teen = choice > 10 && choice < 20
        const endsWithOne = choice % 10 === 1
        if (!teen && endsWithOne) { return 1 }
        if (!teen && choice % 10 >= 2 && choice % 10 <= 4) { return 2 }

        return (choicesLength < 4) ? 2 : 3
      }
    }
    const ctx = context({
      locale: 'ru',
      pluralRules,
      messages: {
        ru: {
          car: '0 машин | {n} машина | {n} машины | {n} машин'
        }
      }
    })
    expect(translate(ctx, 'car', { plural: 1 })).toEqual('1 машина')
    expect(translate(ctx, 'car', { plural: 2 })).toEqual('2 машины')
    expect(translate(ctx, 'car', { plural: 4 })).toEqual('4 машины')
    expect(translate(ctx, 'car', { plural: 12 })).toEqual('12 машин')
    expect(translate(ctx, 'car', { plural: 21 })).toEqual('21 машина')
  })
})

describe('edge cases', () => {
  test('multi bytes key', () => {
    const ctx = context({
      locale: 'ja',
      messages: {
        ja: {
          'こんにちは': 'こんにちは！'
        }
      }
    })
    expect(translate(ctx, 'こんにちは')).toEqual('こんにちは！')
  })
})
