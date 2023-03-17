/* eslint-disable spaced-comment */

/***** Abstract Syntax Tree ***************************************************/

// Types

// TODO: add the type of records here!
export type Typ = TyNat | TyBool | TyArr | TyRec | TyField | TyMat | TyDir | TyImg | TyCharseq
export type TyNat = { tag: 'nat' }
export type TyBool = { tag: 'bool' }
export type TyArr = { tag: 'arr'; inputs: Typ[]; output: Typ }
export type TyRec = { tag: 'rec'; values: Map<string, Typ> }
export type TyField = { tag: 'field'; e: TyRec; field: string }
export type TyMat = { tag: 'mat' }
export type TyImg = { tag: 'img' }
export type TyDir = { tag: 'dir' }
export type TyCharseq = { tag: 'charseq' }

export const tynat: Typ = { tag: 'nat' }
export const tybool: Typ = { tag: 'bool' }
export const tyarr = (inputs: Typ[], output: Typ): TyArr => ({ tag: 'arr', inputs, output })
export const tyimg: TyImg = { tag: 'img' }
export const tydir: TyDir = { tag: 'dir' }
export const tymat: TyMat = { tag: 'mat' }
export const tycharseq: TyCharseq = { tag: 'charseq' }

// Expressions
export type Exp = Var | Num | Bool | Lam | App | If | Matrix | Charseq | Dir | Img
export type Var = { tag: 'var'; value: string }
export type Num = { tag: 'num'; value: number }
export type Bool = { tag: 'bool'; value: boolean }
export type Lam = { tag: 'lam'; param: string; typ: Typ; body: Exp }
export type App = { tag: 'app'; head: Exp; args: Exp[] }
export type If = { tag: 'if'; e1: Exp; e2: Exp; e3: Exp }
export type Img = { tag: 'img', loc: string }
export type Dir = { tag: 'dir', loc: string }
export type Charseq = { tag: 'charseq', value: string }
export type Matrix = { tag: 'matrix', dims: number[], data: number[], value: number[][] }

export const evar = (value: string): Var => ({ tag: 'var', value })
export const num = (value: number): Num => ({ tag: 'num', value })
export const bool = (value: boolean): Bool => ({ tag: 'bool', value })
export const lam = (param: string, typ: Typ, body: Exp): Lam => ({ tag: 'lam', param, typ, body, })
export const app = (head: Exp, args: Exp[]): App => ({ tag: 'app', head, args })
export const ife = (e1: Exp, e2: Exp, e3: Exp): If => ({ tag: 'if', e1, e2, e3, })
export const img = (loc: string): Img => ({ tag: 'img', loc })
export const dir = (loc: string): Dir => ({ tag: 'dir', loc })
export const charseq = (value: string): Charseq => ({ tag: 'charseq', value })
export const matrix = (dims: number[], data: number[], value: number[][]): Matrix => ({ tag: 'matrix', dims, data, value })

// TODO: add record literals here!
export type Value = Num | Bool | Prim | Closure | Matrix | Charseq | Dir | Img
export type Prim = { tag: 'prim'; name: string; fn: (args: Value[]) => Value }
export type Closure = { tag: 'closure'; param: string; body: Exp; env: Env }

export const prim = (name: string, fn: (args: Value[]) => Value): Prim => ({ tag: 'prim', name, fn, })
export const closure = (param: string, body: Exp, env: Env): Closure => ({ tag: 'closure', param, body, env, })

// Statements

export type Stmt = SDefine | SAssign | SPrint
export type SDefine = { tag: 'define'; id: string; exp: Exp }
export type SAssign = { tag: 'assign'; loc: Exp; exp: Exp }
export type SPrint = { tag: 'print'; exp: Exp }

export const sdefine = (id: string, exp: Exp): SDefine => ({ tag: 'define', id, exp, })
export const sassign = (loc: Exp, exp: Exp): SAssign => ({ tag: 'assign', loc, exp, })
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
}

/***** Typechecking Context ***************************************************/

/** A context maps names of variables to their types. */
export type Ctx = Map<string, Typ>

/** @returns a copy of `ctx` with the additional binding `x:t` */
export function extendCtx(x: string, t: Typ, ctx: Ctx): Ctx {
  const ret = new Map(ctx.entries())
  ret.set(x, t)
  return ret
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
      return `(lambda ${e.param} ${prettyTyp(e.typ)} ${prettyExp(e.body)})`
    case 'app':
      return `(${prettyExp(e.head)} ${e.args.map(prettyExp).join(' ')})`
    case 'if':
      return `(if ${prettyExp(e.e1)} ${prettyExp(e.e2)} ${prettyExp(e.e3)})`
    case 'matrix':
      throw new Error()
    case 'img':
      throw new Error()
    case 'charseq':
      throw new Error()
    case 'dir':
      throw new Error()

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
    case 'matrix':
      throw new Error()
    case 'img':
      throw new Error()
    case 'charseq':
      throw new Error()
    case 'dir':
      throw new Error()
  }
}

/** @returns a pretty version of the type `t`. */
export function prettyTyp(t: Typ): string {
  switch (t.tag) {
    case 'nat':
      return 'nat'
    case 'bool':
      return 'bool'
    case 'arr':
      return `(-> ${t.inputs.map(prettyTyp).join(' ')} ${prettyTyp(t.output)})`
    case 'rec':
      return 'rec'
    case 'field':
      return 'field'
    case 'dir':
      return 'dir'
    case 'img':
      return 'img'
    case 'charseq':
      return 'charseq'
    case 'mat':
      return 'mat'
  }
}

/** @returns a pretty version of the statement `s`. */
export function prettyStmt(s: Stmt): string {
  switch (s.tag) {
    case 'define':
      return `(define ${s.id} ${prettyExp(s.exp)})`
    case 'assign':
      return `(assign ${prettyExp(s.loc)} ${prettyExp(s.exp)}))`
    case 'print':
      return `(print ${prettyExp(s.exp)})`
  }
}

/** @returns a pretty version of the program `p`. */
export function prettyProg(p: Prog): string {
  return p.map(prettyStmt).join('\n')
}

/***** Equality ***************************************************************/

/** @returns true iff t1 and t2 are equivalent types */
export function typEquals(t1: Typ, t2: Typ): boolean {
  // N.B., this could be collapsed into a single boolean expression. But we
  // maintain this more verbose form because you will want to follow this
  // pattern of (a) check the tags and (b) recursively check sub-components
  // if/when you add additional types to the language.
  if (t1.tag === 'nat' && t2.tag === 'nat') {
    return true
  } else if (t1.tag === 'bool' && t2.tag === 'bool') {
    return true
  } else if (t1.tag === 'arr' && t2.tag === 'arr') {
    return (
      typEquals(t1.output, t2.output) &&
      t1.inputs.length === t2.inputs.length &&
      t1.inputs.every((t, i) => typEquals(t, t2.inputs[i]))
    )
    // TODO: add an equality case for record types here!
  } else {
    return false
  }
}
