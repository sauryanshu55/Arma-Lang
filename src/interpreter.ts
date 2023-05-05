import * as L from './lang'

/** The output of our programs: a list of strings that our program printed. */
export type Output = string[]

/** @returns the value that expression `e` evaluates to. */
export function evaluate(env: L.Env, e: L.Exp): L.Value {
  switch (e.tag) {
    case 'var': {
      if (env.has(e.value)) {
        return env.get(e.value)
      } else {
        throw new Error(`Runtime error: unbound variable '${e.value}'`)
      }
    }
    case 'num':
      return e
    case 'bool':
      return e
    case 'lam':
      return L.closure(e.params, e.body, env)
    case 'app': {
      const head = evaluate(env, e.head)
      const args = e.args.map((arg) => evaluate(env, arg))
      if (head.tag === 'closure') {
        if (args.length !== head.params.length) {
          throw new Error(
            `Runtime error: expected ${head.params.length} arguments, but found ${args.length}`
          )
        } else {
          return evaluate(head.env.extend(head.params, args), head.body)
        }
      } else if (head.tag === 'prim') {
        return head.fn(args)
      } else {
        throw new Error(
          `Runtime error: expected closure or primitive, but found '${L.prettyValue(
            head
          )}'`
        )
      }
    }
    case 'if': {
      const v = evaluate(env, e.e1)
      if (v.tag === 'bool') {
        return v.value ? evaluate(env, e.e2) : evaluate(env, e.e3)
      } else {
        throw new Error(
          `Type error: 'if' expects a boolean in guard position but a ${v.tag} was given.`
        )
      }
    }
    case 'null': {
      return e
    }
    case 'keyword': {
      return e
    }
    // case 'object': {
    //   return e
    // }
  }
}

/** @returns the result of executing program `prog` under environment `env` */
export function execute(env: L.Env, prog: L.Prog): Output {
  const output: Output = []
  for (const s of prog) {
    switch (s.tag) {
      case 'define': {
        const v = evaluate(env, s.exp)
        env.set(s.id, v)
        break
      }
      case 'print': {
        const v = evaluate(env, s.exp)
        output.push(L.prettyValue(v))
        break
      }
    }
  }
  return output
}
