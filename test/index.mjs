import { suite, test } from 'node:test'
import assert from 'node:assert/strict'

import { serialize, deserialize } from '../src/index.mjs'

suite('json', () => {
  test('serialize', () => {
    const d = new Date()
    const from = {
      arr: [1, 2, undefined, 4],
      obj: {
        when: d,
        maybe: true,
        ifnot: null,
        and: 'only if',
        any: 1,
        really: ['cares']
      }
    }

    const to = serialize(from, { date: true, undef: true })

    const exp = {
      arr: [1, 2, { $undefined$: true }, 4],
      obj: {
        when: { $date$: d.toISOString() },
        maybe: true,
        ifnot: null,
        and: 'only if',
        any: 1,
        really: ['cares']
      }
    }

    assert.deepStrictEqual(to, exp)
  })

  test('serialize', () => {
    const d = new Date()
    const from = {
      arr: [1, 2, { $undefined$: true }, 4],
      obj: {
        when: { $date$: d.toISOString() },
        maybe: true,
        ifnot: null,
        and: 'only if',
        any: 1,
        really: ['cares']
      }
    }

    const to = deserialize(from, { date: true, undef: true })

    const exp = {
      arr: [1, 2, undefined, 4],
      obj: {
        when: d,
        maybe: true,
        ifnot: null,
        and: 'only if',
        any: 1,
        really: ['cares']
      }
    }

    assert.deepStrictEqual(to, exp)
  })

  test('No options', () => {
    const d = new Date()
    let src = [1, 2, undefined, d, 3]

    let exp = [1, 2, undefined, d.toISOString(), 3]
    let act = serialize(src)
    assert.deepStrictEqual(act, exp)

    src = [...exp]
    exp = [...src]
    act = deserialize(src)
    assert.deepStrictEqual(act, exp)
  })
})
