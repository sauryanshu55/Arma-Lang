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

export type Matrix = { tag: 'matrix', dimensions: number[], values: number[] }
export const matrix = (dimensions: number[], values: number[]): Matrix => ({ tag: 'matrix', dimensions, values })

export type Image = ({ tag: 'image', loc: String })
export const image = (loc: String): Image => ({ tag: 'image', loc })

export type Directory = ({ tag: 'directory', loc: String })
export const directory = (loc: String): Directory => ({ tag: 'directory', loc })

export type Exp = Num | Bool | Not | Plus | Eq | And | Or | If | Directory | Image | Matrix
export type Value = Num | Bool | Directory | Image


/**Typechecking lang */
export type TyNat = { tag: 'nat' }
export const tynat: Typ = ({ tag: 'nat' })

export type TyBool = { tag: 'bool' }
export const tybool: Typ = ({ tag: 'bool' })

export type TyUnit = { tag: 'unit' }
export const tyunit: Typ = ({ tag: 'unit' })

export type TyPair = { tag: 'pair', t1: Typ, t2: Typ }
export const typair = (t1: Typ, t2: Typ): Typ => ({ tag: 'pair', t1, t2 })

export type TyPairval = { tag: 'pairval' }
export const typairval: Typ = ({ tag: 'pairval' })

export type TyFst = { tag: 'fst' }
export const tyfst: Typ = ({ tag: 'fst' })

export type TyScn = { tag: 'scn' }
export const tyscn: Typ = ({ tag: 'scn' })

export type Typ = TyNat | TyBool | TyUnit | TyPair | TyFst | TyScn | TyPairval



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
        case 'matrix': return ''
        case 'directory': return ''
        case 'image': return ''
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
        case 'directory':
            throw new Error('Unimplemented!')
        case 'matrix':
            throw new Error('Unimplemented!')
        case 'image':
            throw new Error('Unimplemented!')
    }
}

