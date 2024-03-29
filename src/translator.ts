import * as S from './sexp'
import * as L from './lang'

/** @returns the expression parsed from the given s-expression. */
export function translateExp(e: S.Sexp): L.Exp {
  if (e.tag === 'atom') {
    if (e.value === 'true') {
      return L.bool(true)
    } else if (e.value === 'false') {
      return L.bool(false)
    } else if (/\d+$/.test(e.value)) {
      return L.num(parseInt(e.value))
    } else if (e.value[0] === ':') {
      return L.keyword(e.value.slice(1))
    } else {
      // N.B., any other chunk of text will be considered a variable
      return L.evar(e.value)
    }
  } else if (e.exps.length === 0) {
    throw new Error('Parse error: empty expression list encountered')
  } else {
    const head = e.exps[0]
    const args = e.exps.slice(1)
    if (head.tag === 'atom' && head.value === 'lambda') {
      if (args.length === 0) {
        throw new Error(
          `Parse error: 'lambda' expects at least 1 argument but ${args.length} were given`
        )
      }
      const params = args.slice(0, args.length - 1)
      const body = args[args.length - 1]
      for (const p of params) {
        if (p.tag !== 'atom') {
          throw new Error(
            `Parse error: 'lambda' expects its arguments to be identifiers but ${S.sexpToString(
              p
            )} was given`
          )
        }
      }
      return L.lam(
        params.map((p) => (p as S.Atom).value),
        translateExp(body)
      )
    } else if (head.tag === 'atom' && head.value === 'if') {
      if (args.length !== 3) {
        throw new Error(
          `Parse error: 'if' expects 3 arguments but ${args.length} were given`
        )
      } else {
        return L.ife(
          translateExp(args[0]),
          translateExp(args[1]),
          translateExp(args[2])
        )
      }
    } else {
      return L.app(translateExp(head), args.map(translateExp))
    }
  }
}

export function translateStmt(e: S.Sexp): L.Stmt {
  if (e.tag === 'atom') {
    throw new Error(`Parse error: an atom cannot be a statement: '${e.value}'`)
  } else {
    const head = e.exps[0]
    const args = e.exps.slice(1)
    if (head.tag !== 'atom') {
      throw new Error(
        'Parse error: identifier expected at head of operator/form'
      )
    } else if (head.value === 'define') {
      if (args.length !== 2) {
        throw new Error(
          `Parse error: 'define' expects 2 argument but ${args.length} were given`
        )
      } else if (args[0].tag !== 'atom') {
        throw new Error(
          "Parse error: 'define' expects its first argument to be an identifier"
        )
      } else {
        return L.sdefine(args[0].value, translateExp(args[1]))
      }
    } else if (head.value === 'print') {
      if (args.length !== 1) {
        throw new Error(
          `Parse error: 'print' expects 1 argument but ${args.length} were given`
        )
      } else {
        return L.sprint(translateExp(args[0]))
      }
    } else {
      throw new Error(
        `Parse error: unknown statement form '${S.sexpToString(e)}'`
      )
    }
  }
}

export function translateProg(es: S.Sexp[]): L.Prog {
  return es.map(translateStmt)
}
