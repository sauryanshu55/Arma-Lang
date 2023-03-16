/***** Abstract Syntax Tree ***************************************************/

export type Num = { tag: 'num', value: number }
export const num = (value: number): Num => ({ tag: 'num', value })

export type Bool = { tag: 'bool', value: boolean }
export const bool = (value: boolean): Bool => ({ tag: 'bool', value })

export type Not = { tag: 'not', exp: Exp }
export const not = (exp: Exp): Exp => ({ tag: 'not', exp })

export type Plus = { tag: 'plus', e1: Exp, e2: Exp }
export const plus = (e1: Exp, e2: Exp): Exp => ({ tag: 'plus', e1, e2 })

export type Eq = { tag: 'eq', e1: Exp, e2: Exp }
export const eq = (e1: Exp, e2: Exp): Exp => ({ tag: 'eq', e1, e2 })

export type And = { tag: 'and', e1: Exp, e2: Exp }
export const and = (e1: Exp, e2: Exp): Exp => ({ tag: 'and', e1, e2 })

export type Or = { tag: 'or', e1: Exp, e2: Exp }
export const or = (e1: Exp, e2: Exp): Exp => ({ tag: 'or', e1, e2 })

export type If = { tag: 'if', e1: Exp, e2: Exp, e3: Exp }
export const ife = (e1: Exp, e2: Exp, e3: Exp): Exp =>
  ({ tag: 'if', e1, e2, e3 })

export type Unit = { tag: 'unit'}
export const unit:Unit = { tag: 'unit' }

export type Exp = Num | Bool | Not | Plus | Eq | And | Or | If | Unit | Pair | Fst | Scn
export type Value = Num | Bool | Unit | Pairval 

export type Pair = { tag: 'pair', t1: Exp, t2: Exp }
export const pair = (t1: Exp, t2: Exp): Exp => ({ tag: 'pair', t1, t2 })

export type Pairval = { tag: 'pairval', t1: Value, t2: Value }
export const pairval = (t1: Value, t2: Value): Value => ({ tag: 'pairval', t1, t2 })

export type Fst = { tag: 'fst', pair: Exp }
export const fst = (pair: Exp): Exp => ({ tag: 'fst', pair })

export type Scn={tag:'scn',pair:Exp}
export const scn = (pair: Exp): Exp => ({ tag: 'scn', pair })


/**Typechecking lang */
export type TyNat = { tag: 'nat' }
export const tynat: Typ = ({ tag: 'nat' })

export type TyBool = { tag: 'bool' }
export const tybool: Typ = ({ tag: 'bool' })

export type TyUnit = { tag: 'unit' }
export const tyunit: Typ = ({ tag: 'unit' })

export type TyPair= {tag: 'pair', t1: Typ, t2: Typ}
export const typair = (t1: Typ, t2: Typ): Typ => ({ tag: 'pair', t1, t2 })

export type TyPairval = { tag: 'pairval' }
export const typairval: Typ = ({ tag: 'pairval' })

export type TyFst={tag:'fst'}
export const tyfst:Typ=({tag:'fst'})

export type TyScn={tag:'scn'}
export const tyscn:Typ=({tag:'scn'})

export type Typ = TyNat | TyBool | TyUnit | TyPair |TyFst | TyScn | TyPairval



/***** Pretty-printer *********************************************************/

/**
 * @returns a pretty version of the expression `e`, suitable for debugging.
 */
export function prettyExp(e: Exp): string {
  switch (e.tag) {
    case 'num': return `${e.value}`
    case 'bool': return e.value ? 'true' : 'false'
    case 'not': return `(not ${prettyExp(e.exp)})`
    case 'plus': return `(+ ${prettyExp(e.e1)} ${prettyExp(e.e2)})`
    case 'eq': return `(= ${prettyExp(e.e1)} ${prettyExp(e.e2)})`
    case 'and': return `(and ${prettyExp(e.e1)} ${prettyExp(e.e2)})`
    case 'or': return `(or ${prettyExp(e.e1)} ${prettyExp(e.e2)})`
    case 'if': return `(if ${prettyExp(e.e1)} ${prettyExp(e.e2)} ${prettyExp(e.e3)})`
    case 'unit': return `unit`
    case 'pair': return `(pair ${prettyExp(e.t1)} ${prettyExp(e.t2)})`
    case 'fst': return `(fst ${prettyExp(e.pair)}))`
    case 'scn': return `(scn ${prettyExp(e.pair)}))`
  }
}

/**
 * @returns a pretty version of the type `t`.
 */
export function prettyTyp(t: Typ): string {
  switch (t.tag) {
    case 'nat': return 'nat'
    case 'bool': return 'bool'
    case 'unit': return 'unit'
    case 'pair': return 'pair'
    case 'fst': return 'fst'
    case 'scn': return 'scn'
    case 'pairval': return 'pair'
  }
}

/***** Evaluator **************************************************************/

/**
 * @returns the value that expression `e` evaluates to.
 */
export function evaluate(e: Exp): Value {
  switch (e.tag) {
    case 'num':
      return e
    case 'bool':
      return e
    case 'not': {
      const v = evaluate(e.exp)
      if (v.tag === 'bool') {
        return bool(!v.value)
      } else {
        throw new Error(`Type error: negation expects a boolean but a ${v.tag} was given.`)
      }
    }
    case 'plus': {
      const v1 = evaluate(e.e1)
      const v2 = evaluate(e.e2)
      if (v1.tag === 'num' && v2.tag === 'num') {
        return num(v1.value + v2.value)
      } else {
        throw new Error(`Type error: plus expects two numbers but a ${v1.tag} and ${v2.tag} was given.`)
      }
    }
    case 'eq': {
      const v1 = evaluate(e.e1)
      const v2 = evaluate(e.e2)
      return bool(v1 === v2)
    }
    case 'and': {
      const v1 = evaluate(e.e1)
      const v2 = evaluate(e.e2)
      if (v1.tag === 'bool' && v2.tag === 'bool') {
        return bool(v1.value && v2.value)
      } else {
        throw new Error(`Type error: && expects two booleans but a ${v1.tag} and ${v2.tag} was given.`)
      }
    }
    case 'or': {
      const v1 = evaluate(e.e1)
      const v2 = evaluate(e.e2)
      if (v1.tag === 'bool' && v2.tag === 'bool') {
        return bool(v1.value || v2.value)
      } else {
        throw new Error(`Type error: || expects two booleans but a ${v1.tag} and ${v2.tag} was given.`)
      }
    }
    case 'if': {
      const v = evaluate(e.e1)
      if (v.tag === 'bool') {
        return v.value ? evaluate(e.e2) : evaluate(e.e3)
      } else {
        throw new Error(`Type error: if expects a boolean in guard position but a ${v.tag} was given.`)
      }
    }
    case 'pair': {
      const elt1 = evaluate(e.t1)
      const elt2 = evaluate(e.t2)
      return pairval(elt1, elt2)
    }
    case 'fst':{      
      const elt1=evaluate(e.pair)
      if (elt1.tag==="pairval"){
        return elt1.t1
      }
      else{
        throw new Error(`Type error: fst expects a boolean in guard position but a ${e.tag} was given.`)
      }
    }

    case 'scn':{
      const elt2=evaluate(e.pair)
      if (elt2.tag==="pairval"){
        return elt2.t2
      }
      else{
        throw new Error(`Type error: scn expects a boolean in guard position but a ${e.tag} was given.`)
      }
    }
    
    case 'unit': return e
  }
}

