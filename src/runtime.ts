import * as L from './lang'
import * as E from './interpreter'

function throwArityError(fn: string, expected: number, found: number): never {
  throw new Error(
    `Runtime error: '${fn}' expects ${expected} argument(s) but ${found} were given`
  )
}

function throwUnexpectedError(
  fn: string,
  expected: string,
  pos: number,
  found: string
): never {
  throw new Error(
    `Type error: primitive '${fn}' expected ${expected} in position ${pos} but a ${found} was given`
  )
}

function checkBinaryArithOp(op: string, args: L.Value[]): [number, number] {
  if (args.length !== 2) {
    throwArityError('+', 2, args.length)
  } else {
    const v1 = args[0]
    const v2 = args[1]
    if (v1.tag !== 'num') {
      throwUnexpectedError('+', 'number', 1, v1.tag)
    } else if (v2.tag !== 'num') {
      throwUnexpectedError('+', 'number', 2, v2.tag)
    } else {
      return [v1.value, v2.value]
    }
  }
}

function plusPrim(args: L.Value[]): L.Value {
  const [n1, n2] = checkBinaryArithOp('+', args)
  return L.num(n1 + n2)
}

function subPrim(args: L.Value[]): L.Value {
  const [n1, n2] = checkBinaryArithOp('-', args)
  return L.num(n1 - n2)
}

function timesPrim(args: L.Value[]): L.Value {
  const [n1, n2] = checkBinaryArithOp('*', args)
  return L.num(n1 * n2)
}

function divPrim(args: L.Value[]): L.Value {
  const [n1, n2] = checkBinaryArithOp('/', args)
  return L.num(n1 / n2)
}

function objPrim(args: L.Value[]): L.Value {
  let objPrimMap = new Map<string, L.Value>()
  objPrimMap.set('__proto__', L.nulle())
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]
    if (key.tag !== 'keyword') {
      throw new Error(`Expect a keyword, received ${args[i].tag}`)
    } else {
      objPrimMap.set(key.value, args[i + 1])
    }
  }
  return L.vobject(objPrimMap)
}

function fieldPrim(args: L.Value[]): L.Value {
  const o: L.Value = args[0]
  const f: L.Value = args[1]
  if (o.tag !== 'object') {
    throw new Error(`Object Expected, received a ${o.tag}`)
  } else if (f.tag !== 'keyword') {
    throw new Error(`Keyword Expected, received a ${f.tag}`)
  } else {
    if (o.fields.has(f.value)) {
      return o.fields.get(f.value)!
    }
    const objectToCheck = o.fields.get('__proto__')!
    if (objectToCheck.tag === 'null') {
      throw new Error(`Invalid record lookup, __proto__ field was null`)
    } else {
      return fieldPrim([objectToCheck, f])
    }
  }
}

// let recValMap = new Map<string, L.Value>
//       for (let [key, value] of e.exps.entries()) {
//         recValMap.set(key, evaluate(env, value))
//       }
//       return L.recVal(recValMap)

function zeroPrim(args: L.Value[]): L.Value {
  if (args.length !== 1) {
    throwArityError('zero?', 1, args.length)
  } else {
    const v = args[0]
    if (v.tag !== 'num') {
      throwUnexpectedError('zero?', 'number', 1, v.tag)
    } else {
      return L.bool(v.value === 0)
    }
  }
}

export function makeInitialEnv(): L.Env {
  return new L.Env(
    new Map([
      ['+', L.prim('+', plusPrim)],
      ['-', L.prim('-', subPrim)],
      ['*', L.prim('*', timesPrim)],
      ['/', L.prim('/', divPrim)],
      ['zero?', L.prim('zero?', zeroPrim)],
      ['obj', L.prim('obj', objPrim)],
      ['field', L.prim('field', fieldPrim)],
    ])
  )
}
