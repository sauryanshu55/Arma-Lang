## Arma Lang

Named after my favorite video game Arma 3, Arma Lang is a programming language with the following design features:
+ Syntax: S-exp
+ Paradigm: Functional
+ Prototype Based Object Oriented Programming
+ All basic primitive data types
+ All basic control structures
+ Methods and method parameters
+ 

This compiler is written in TypeScript, and the project is based using Node.js runtime environment.

Here's a code snippet written in Arma-Lang that defines a variable, calculates the factorial, and prints the result
```
(define result 0)
  (define factorial
    (lambda n Nat
      (if (zero? n)
          1
          (* n (factorial (- n 1))))))
  (assign result (factorial 5))
  (print result)
```
Here's another one, where an oobject 'dummy-object' is defined:
```
  (define dummy-object (obj :x 10 :y (obj :z 1000 :q true)))
  (print (field (field dummy-object :y) :q))
```
