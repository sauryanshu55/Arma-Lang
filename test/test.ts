import { describe, expect, test } from '@jest/globals'
import * as L from '../src/lang'
import * as Sexp from '../src/sexp'

const prog1=`
  (define x 10)
`
describe('an example test suite', () => {
  test('basic addition', () => {
    expect(1 + 1).toBe(2)
  })
})

describe('Lexer Test suite', () => {
  test('Lexing test 1', () => {
    var lexer=new Sexp.Lexer(prog1)
    expect(lexer.tokenize()).toStrictEqual(['(','define','x','10',')'])
  })
})