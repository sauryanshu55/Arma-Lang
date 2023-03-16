/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as L from './lang'

function expectedTypeMsg (expected: string, pos: number, fn: string, found: string): string {
  return `Type error: Expected ${expected} in position ${pos} of ${fn} but found ${found}`
}

/** @return the type of expression `e` */
export function typecheck (ctx: L.Ctx, e: L.Exp): L.Typ {
  switch (e.tag) {
    case 'var': {
      if (ctx.has(e.value)) {
        return ctx.get(e.value)!
      } else {
        throw new Error(`Type error: unbound variable: ${e.value}`)
      }
    }
    case 'num':
      return L.tynat
    case 'bool':
      return L.tybool
    case 'lam': {
      const outTy = typecheck(L.extendCtx(e.param, e.typ, ctx), e.body)
      return L.tyarr([e.typ], outTy)
    }
    case 'app': {
      const thead = typecheck(ctx, e.head)
      const targs = e.args.map(arg => typecheck(ctx, arg))
      if (thead.tag !== 'arr') {
        throw new Error(`Type error: expected arrow type but found '${L.prettyTyp(thead)}'`)
      } else if (thead.inputs.length !== targs.length) {
        throw new Error(`Type error: expected ${thead.inputs.length} arguments but found ${targs.length}`)
      } else {
        thead.inputs.forEach((t, i) => {
          if (!L.typEquals(t, targs[i])) {
            throw new Error(`Type error: expected ${L.prettyTyp(t)} but found ${L.prettyTyp(targs[i])}`)
          }
        })
        return thead.output
      }
    }
    case 'if': {
      const t1 = typecheck(ctx, e.e1)
      const t2 = typecheck(ctx, e.e2)
      const t3 = typecheck(ctx, e.e3)
      if (t1.tag !== 'bool') {
        throw new Error(expectedTypeMsg('bool', 1, 'if', t1.tag))
      } else if (t2.tag !== t3.tag) {
        throw new Error(expectedTypeMsg(t2.tag, 3, 'if', t3.tag))
      }
      return t3
    }
  }
}

export function checkWF (ctx: L.Ctx, prog: L.Prog): void {
  prog.forEach((s) => {
    switch (s.tag) {
      case 'define': {
        const t = typecheck(ctx, s.exp)
        ctx = L.extendCtx(s.id, t, ctx)
        break
      }
      case 'assign': {
        const t = typecheck(ctx, s.exp)
        if (s.loc.tag !== 'var') {
          throw new Error(`Type Error: assignment to non-location '${L.prettyExp(s.loc)}'`)
        } else if (!ctx.has(s.loc.value)) {
          throw new Error(`Type Error: unbound variable '${s.loc.value}'`)
        } else if (!L.typEquals(t, ctx.get(s.loc.value)!)) {
          throw new Error(`Type Error: expected ${L.prettyTyp(ctx.get(s.loc.value)!)} but found ${L.prettyTyp(t)}`)
        }
        break
      }
      case 'print': {
        typecheck(ctx, s.exp)
        break
      }
    }
  })
}
