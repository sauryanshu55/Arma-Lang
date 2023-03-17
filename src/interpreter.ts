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
      return L.closure(e.param, e.body, env)
    case 'app': {
      const head = evaluate(env, e.head)
      const args = e.args.map(arg => evaluate(env, arg))
      if (head.tag === 'closure') {
        if (args.length !== 1) {
          throw new Error(`Runtime error: closure expects 1 argument but ${args.length} were given`)
        } else {
          return evaluate(head.env.extend1(head.param, args[0]), head.body)
        }
      } else if (head.tag === 'prim') {
        return head.fn(args)
      } else {
        throw new Error(`Runtime error: expected closure or primitive, but found '${L.prettyExp(head)}'`)
      }
    }
    case 'if': {
      const v = evaluate(env, e.e1)
      if (v.tag === 'bool') {
        return v.value ? evaluate(env, e.e2) : evaluate(env, e.e3)
      } else {
        throw new Error(`Type error: 'if' expects a boolean in guard position but a ${v.tag} was given.`)
      }
    }
    case 'matrix':
      return L.matrix(e.dims,e.data,createMatrix(e.data))
    case 'img':
      return L.img(e.loc)
    case 'charseq':
      return L.charseq(e.value)
    case 'dir':
      return L.dir(e.loc)
  }
}

/**
 * Creates a 2x2 matrix from an array of numbers.
 *
 * @param data The array of numbers to be filled into the matrix.
 * @returns A 2x2 matrix created from the input array.
 * @throws An error if the input array does not have exactly four elements.
 */

function createMatrix(stringData: string): number[][] {
  var data=convertParamToArray(stringData)
  if (data.length !== 4) {
    throw new Error("Input array must contain exactly 4 numbers");
  }
  const matrix: number[][] = [];
  for (let i = 0; i < 2; i++) {
    matrix.push([]);
    for (let j = 0; j < 2; j++) {
      matrix[i].push(data[i * 2 + j]);
    }
  }
  return matrix;
}

/**
 * Converts a string representation of an array of numbers to an actual array of numbers.
 *
 * @param data The input string representing an array of numbers.
 * @returns An array of numbers parsed from the input string.
 * @throws An error if the input string contains no numbers.
 */
function convertParamToArray(data: string): number[] {
  const regex = /\d+/g;
  const matches = data.match(regex);
  if (!matches) {
    throw new Error("Input string contains no numbers");
  }
  return matches.map(Number);
}


// function createNDimMatrix(dimensions: number[], data: number[]): number[] {
//   const result: number[] = [];

//   if (dimensions.length === 1) {
//     // Base case: create a 1-dimensional array of data elements
//     for (let i = 0; i < dimensions[0]; i++) {
//       result.push(data[i]);
//     }
//   } else {
//     // Recursive case: create a nested array for each element
//     const innerDimensions = dimensions.slice(1);
//     const innerSize = innerDimensions.reduce((acc, val) => acc * val, 1);

//     for (let i = 0; i < dimensions[0]; i++) {
//       const innerData = data.slice(i * innerSize, (i + 1) * innerSize);
//       result.push(createNDimMatrix(innerDimensions, innerData));
//     }
//   }

//   return result;
// }


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
      case 'assign': {
        const rhs = evaluate(env, s.exp)
        if (s.loc.tag === 'var') {
          if (env.has(s.loc.value)) {
            env.update(s.loc.value, rhs)
          } else {
            throw new Error(`Runtime error: unbound variable: ${s.loc.value}`)
          }
        } else {
          throw new Error(`Runtime error: cannot assign to non-location '${L.prettyExp(s.loc)}'}`)
        }
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