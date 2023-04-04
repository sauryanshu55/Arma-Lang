import { describe, expect, test } from '@jest/globals'
import * as L from '../src/lang'
import * as Sexp from '../src/sexp'
import * as Trans from '../src/translator'
import * as TC from '../src/typechecker'
import * as Interp from '../src/interpreter'
import * as Runtime from '../src/runtime'


function compile (src: string, typecheck: boolean = false): L.Prog {
  const prog = Trans.translateProg(Sexp.parse(src))
  if (typecheck) {
    TC.checkWF(Runtime.initialCtx, prog)
  }
  return prog
}

function compileAndPrint (src: string, typecheck: boolean = false): string {
  return L.prettyProg(compile(src, typecheck))
}

function compileAndInterpret (src: string, typecheck: boolean = false): Interp.Output {
  return Interp.execute(Runtime.makeInitialEnv(), compile(src, typecheck))
}

const prog1 = `
  (define x 1)
  (define y 1)
  (print (+ x y))
  (assign x 10)
  (print (+ x y))
`

const prog2 = `
  (define result 0)
  (define factorial
    (lambda n Nat
      (if (zero? n)
          1
          (* n (factorial (- n 1))))))
  (assign result (factorial 5))
  (print result)
`
describe('interpretation', () => {
  test('prog1', () => {
    expect(compileAndInterpret(prog1, true)).toStrictEqual(['2', '11'])
  })
  test('prog2', () => {
    expect(compileAndInterpret(prog2, false)).toStrictEqual(['120'])
  })
  
  // test('prog3', () => {
  //   expect(compileAndInterpret(prog3, true)).toStrictEqual(['6'])
  // })

  // test('prog4', () => {
  //   expect(compileAndInterpret(prog5, true)).toStrictEqual(['2'])
  // })
  // test('Print', () => {
  //   expect(compileAndPrint(prog2, false)).toStrictEqual('(define result 0)(define factorial (lambda n Nat (if (zero? n) 1 (* n (factorial (- n 1))))))(assign result (factorial 5))(print result)')
  // })
})

