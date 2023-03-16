import { describe, expect, test } from '@jest/globals'
import * as L from '../src/lang'
import * as P from '../src/parser'
import * as T from '../src/typechecker'

const pangram = `
  (if (and true false) 1 (if (or (= 11 50) (= 672 672)) (not (= (+ 35 (+ 1 1)) 37)) (= 1 1)))
`.trim()

describe('Typechecker', () => {
  test('num', () => {
    expect(T.typecheck(L.num(42))).toStrictEqual(L.tynat)
  })

  test('plus - valid', () => {
    expect(T.typecheck(L.plus(L.num(1), L.num(2)))).toStrictEqual(L.tynat)
  })

  test('plus - invalid', () => {
    expect(() => T.typecheck(L.plus(L.num(1), L.bool(true)))).toThrow(
      new Error('Invalid addition types')
    )
  })

  test('bool', () => {
    expect(T.typecheck(L.bool(true))).toStrictEqual(L.tybool)
  })

  test('and - valid', () => {
    expect(T.typecheck(L.and(L.bool(true), L.bool(false)))).toStrictEqual(L.tybool)
  })

  test('and - invalid', () => {
    expect(() => T.typecheck(L.and(L.bool(true), L.num(42)))).toThrow(
      new Error('Invalid and types')
    )
  })

  test('or - valid', () => {
    expect(T.typecheck(L.or(L.bool(true), L.bool(false)))).toStrictEqual(L.tybool)
  })

  test('or - invalid', () => {
    expect(() => T.typecheck(L.or(L.bool(true), L.num(42)))).toThrow(
      new Error('Invalid or types')
    )
  })

  test('not - valid', () => {
    expect(T.typecheck(L.not(L.bool(true)))).toStrictEqual(L.tybool)
  })

  test('not - invalid', () => {
    expect(() => T.typecheck(L.not(L.num(42)))).toThrow(new Error('Invalid not type'))
  })

  test('if - valid', () => {
    expect(T.typecheck(L.ife(L.bool(true), L.num(42), L.num(43)))).toStrictEqual(L.tynat)
  })

  test('if - invalid', () => {
    expect(() => T.typecheck(L.ife(L.num(42), L.bool(true), L.num(43)))).toThrow(
      new Error('Invalid if types')
    )
  })

  test('eq - valid', () => {
    expect(T.typecheck(L.eq(L.bool(true), L.bool(false)))).toStrictEqual(L.tybool)
  })

  test('eq - invalid', () => {
    expect(() => T.typecheck(L.eq(L.bool(true), L.num(42)))).toThrow(
      new Error('Invalid and types')
    )
  })
  test('unit', () => {
    expect(T.typecheck(L.unit)).toStrictEqual(L.tyunit)
  })
  test('pair - valid', () => {
    expect(T.typecheck(L.pair(L.num(8), L.bool(false)))).toStrictEqual(
      L.typair(L.tynat, L.tybool)
    )
  })
  test('fst - valid', () => {
    expect(T.typecheck(L.fst(L.pair(L.num(8), L.bool(false))))).toStrictEqual(L.tynat)
  })
  
  test('fst - invalid', () => {
    expect(() => T.typecheck(L.fst(L.num(8)))).toThrow(`Invalid fst types`)
  })
  
  test('scn - valid', () => {
    expect(T.typecheck(L.scn(L.pair(L.num(8), L.bool(false))))).toStrictEqual(L.tybool)
  })
  
  test('scn - invalid', () => {
    expect(() => T.typecheck(L.scn(L.num(8)))).toThrow(`Invalid scn types`)
  })
})




describe('Lexer and Parser', () => {
  test('pangram (pretty)', () => {
    expect(L.prettyExp(P.parse(pangram))).toStrictEqual(pangram)
  })
  test('pangram (eval)', () => {
    expect(L.evaluate(P.parse(pangram))).toStrictEqual(L.bool(false))
  })
})
