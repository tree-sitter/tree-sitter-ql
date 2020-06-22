(classlessPredicate
  name: (predicateName) @name
  (#not-eq? @name "")) @definition.function

(memberPredicate
  name: (predicateName) @name
  (#not-eq? @name "")) @definition.method

(aritylessPredicateExpr
  name: (literalId) @name
  (#not-eq? @name "")) @reference.call

(module
  name: (moduleName) @name
  (#not-eq? @name "")) @definition.module

(dataclass
 name: (className) @name
 (#not-eq? @name "")) @definition.class

(datatype
  name: (className) @name
  (#not-eq? @name "")) @definition.class

(datatypeBranch
  name: (className) @name
  (#not-eq? @name "")) @definition.class

(qualifiedRhs
  name: (predicateName) @name) @reference.call

(typeExpr
  name: (className) @name) @reference.type
