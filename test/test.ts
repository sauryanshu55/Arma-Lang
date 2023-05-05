import { describe, expect, test } from '@jest/globals'
import * as L from '../src/lang'
import * as Sexp from '../src/sexp'
import * as Trans from '../src/translator'
import * as Interp from '../src/interpreter'
import * as Runtime from '../src/runtime'

function compile(src: string, typecheck: boolean = false): L.Prog {
  return Trans.translateProg(Sexp.parse(src))
}

function compileAndPrint(src: string, typecheck: boolean = false): string {
  return L.prettyProg(compile(src, typecheck))
}

function compileAndInterpret(
  src: string,
  typecheck: boolean = false
): Interp.Output {
  return Interp.execute(Runtime.makeInitialEnv(), compile(src, typecheck))
}

const prog1 = `
  (define x 1)
  (define y 1)
  (print (+ x y))
`

const prog2 = `
  (define result 0)
  (define factorial
    (lambda n
      (if (zero? n)
          1
          (* n (factorial (- n 1))))))
  (print (factorial 5))
`
const prog3 = `
  (define o (obj :x 10 :y (obj :z 1000 :q true)))
  (print (field (field o :y) :q))
`

describe('interpretation', () => {
  test('prog1', () => {
    expect(compileAndInterpret(prog1, true)).toStrictEqual(['2'])
  })
  test('prog2', () => {
    expect(compileAndInterpret(prog2, false)).toStrictEqual(['120'])
  })
  test('prog3', () => {
    expect(compileAndInterpret(prog3, false)).toStrictEqual(['true'])
  })
})
