/* eslint-disable spaced-comment */

/***** Abstract Syntax Tree ***************************************************/

// Expressions

export type Exp = Var | Num | Bool | Lam | App | If | Null | Keyword
export type Var = { tag: 'var'; value: string }
export type Num = { tag: 'num'; value: number }
export type Bool = { tag: 'bool'; value: boolean }
export type Lam = { tag: 'lam'; params: string[]; body: Exp }
export type App = { tag: 'app'; head: Exp; args: Exp[] }
export type If = { tag: 'if'; e1: Exp; e2: Exp; e3: Exp }
export type Null = { tag: 'null'; value: null }
export type Keyword = { tag: 'keyword'; value: string }
export type VObject = { tag: 'object'; fields: Map<string, Value> }

export const evar = (value: string): Var => ({ tag: 'var', value })
export const keyword = (value: string): Keyword => ({ tag: 'keyword', value })
export const num = (value: number): Num => ({ tag: 'num', value })
export const bool = (value: boolean): Bool => ({ tag: 'bool', value })
export const lam = (params: string[], body: Exp): Lam => ({
  tag: 'lam',
  params,
  body,
})
export const app = (head: Exp, args: Exp[]): App => ({ tag: 'app', head, args })
export const ife = (e1: Exp, e2: Exp, e3: Exp): If => ({
  tag: 'if',
  e1,
  e2,
  e3,
})
export const nulle = (): Null => ({ tag: 'null', value: null })
export const vobject = (fields: Map<string, Value>): VObject => ({
  tag: 'object',
  fields,
})

export type Value = Num | Bool | Prim | Closure | Null | Keyword | VObject
export type Prim = { tag: 'prim'; name: string; fn: (args: Value[]) => Value }
export type Closure = { tag: 'closure'; params: string[]; body: Exp; env: Env }

export const prim = (name: string, fn: (args: Value[]) => Value): Prim => ({
  tag: 'prim',
  name,
  fn,
})
export const closure = (params: string[], body: Exp, env: Env): Closure => ({
  tag: 'closure',
  params,
  body,
  env,
})

// Statements

export type Stmt = SDefine | SPrint
export type SDefine = { tag: 'define'; id: string; exp: Exp }
export type SPrint = { tag: 'print'; exp: Exp }

export const sdefine = (id: string, exp: Exp): SDefine => ({
  tag: 'define',
  id,
  exp,
})
export const sprint = (exp: Exp): SPrint => ({ tag: 'print', exp })

// Programs

export type Prog = Stmt[]

/***** Runtime Environment ****************************************************/

export class Env {
  private outer?: Env
  private bindings: Map<string, Value>

  constructor(bindings?: Map<string, Value>) {
    this.bindings = bindings || new Map()
  }

  has(x: string): boolean {
    return (
      this.bindings.has(x) || (this.outer !== undefined && this.outer.has(x))
    )
  }

  get(x: string): Value {
    if (this.bindings.has(x)) {
      return this.bindings.get(x)!
    } else if (this.outer !== undefined) {
      return this.outer.get(x)
    } else {
      throw new Error(`Runtime error: unbound variable '${x}'`)
    }
  }

  set(x: string, v: Value): void {
    if (this.bindings.has(x)) {
      throw new Error(`Runtime error: redefinition of variable '${x}'`)
    } else {
      this.bindings.set(x, v)
    }
  }

  update(x: string, v: Value): void {
    this.bindings.set(x, v)
    if (this.bindings.has(x)) {
      this.bindings.set(x, v)
    } else if (this.outer !== undefined) {
      return this.outer.update(x, v)
    } else {
      throw new Error(`Runtime error: unbound variable '${x}'`)
    }
  }

  extend1(x: string, v: Value): Env {
    const ret = new Env()
    ret.outer = this
    ret.bindings = new Map([[x, v]])
    return ret
  }

  extend(xs: string[], vs: Value[]): Env {
    const ret = new Env()
    ret.outer = this
    ret.bindings = new Map(xs.map((x, i) => [x, vs[i]]))
    return ret
  }
}

/***** Pretty-printer *********************************************************/

/** @returns a pretty version of the expression `e`, suitable for debugging. */
export function prettyExp(e: Exp): string {
  switch (e.tag) {
    case 'var':
      return `${e.value}`
    case 'num':
      return `${e.value}`
    case 'bool':
      return e.value ? 'true' : 'false'
    case 'lam':
      return `(lambda ${e.params.join(' ')} ${prettyExp(e.body)})`
    case 'app':
      return `(${prettyExp(e.head)} ${e.args.map(prettyExp).join(' ')})`
    case 'if':
      return `(if ${prettyExp(e.e1)} ${prettyExp(e.e2)} ${prettyExp(e.e3)})`
    case 'null':
      return `null`
    case 'keyword':
      return `:${e.value}`
  }
}

/** @returns a pretty version of the value `v`, suitable for debugging. */
export function prettyValue(v: Value): string {
  switch (v.tag) {
    case 'num':
      return `${v.value}`
    case 'bool':
      return v.value ? 'true' : 'false'
    case 'closure':
      return `<closure>`
    case 'prim':
      return `<prim ${v.name}>`
    case 'null':
      return `null`
    case 'keyword':
      return `:${v.value}`
    case 'object':
      const flatMap = [...v.fields.entries()].flat()
      return `(obj ${flatMap})`
  }
}
/** @returns a pretty version of the statement `s`. */
export function prettyStmt(s: Stmt): string {
  switch (s.tag) {
    case 'define':
      return `(define ${s.id} ${prettyExp(s.exp)})`
    case 'print':
      return `(print ${prettyExp(s.exp)})`
  }
}

/** @returns a pretty version of the program `p`. */
export function prettyProg(p: Prog): string {
  return p.map(prettyStmt).join('\n')
}
