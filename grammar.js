module.exports = grammar({
  name: 'ql',
  conflicts: $ => [
    [$.simpleId, $.typeExpr],
    [$.simpleId, $.literalId],
    [$.varDecl, $.returnType],
  ],
  word: $ => $.lowerId,
  extras: $ => [
    /[ \t\r\n]/,
    $.line_comment,
    $.block_comment,
  ],


  rules: {

    ql: $ => repeat($.moduleMember),

    module: $ => seq('module', $.moduleName, choice(seq($.obrace, repeat($.moduleMember), $.cbrace), $.moduleAliasBody)),

    moduleMember: $ => choice(
      seq(
        repeat($.annotation),
        choice($.imprt, $.classlessPredicate, $.dataclass, $.datatype, $.select, $.module)
      ), 
      $.qldoc
    ),

    imprt: $ => seq($.import, $.importModuleExpr, optional(seq($.as, $.moduleName))),

    moduleAliasBody: $ => seq($.eq, $.moduleExpr, $.semi),
    predicateAliasBody: $ => seq($.eq, $.predicateExpr, $.semi),
    typeAliasBody: $ => seq($.eq, $.typeExpr, $.semi),

    classlessPredicate: $ => seq(
      $.returnType,
      $.predicateName,
      choice(
        seq($.opar, sep($.varDecl, $.comma), $.cpar, $.optbody),
        $.predicateAliasBody
      )
    ),

    datatype: $ => seq($.newtype, $.className, $.eq, $.datatypeBranches),
    datatypeBranches: $ => sep1($.datatypeBranch, $.or),

    datatypeBranch: $ => seq(
      optional($.qldoc),
      optional($.annotation),
      $.className,
      $.opar,
      sep($.varDecl, $.comma),
      $.cpar,
      optional($.body)
    ),

    select: $ => seq(
      optional(seq($.from, sep($.varDecl, $.comma))),
      optional(seq($.where, $.exprOrTerm)),
      seq('select', $.asExprs, optional($.orderBys))
    ),

    dataclass: $ => seq(
      $.class, $.className,
      choice(
        seq($.extends, sep1($.typeExpr, $.comma), $.obrace, repeat($.classMember), $.cbrace),
        $.typeAliasBody
      )
    ),

    classMember: $ => choice(
      seq(
        repeat($.annotation),
        choice($.charpred, $.memberPredicate, $.field)
      ),
      $.qldoc
    ),

    charpred: $ => seq($.className, $.opar, $.cpar, $.obrace, $.exprOrTerm, $.cbrace),

    memberPredicate: $ => seq($.returnType, $.predicateName, $.opar, sep($.varDecl, $.comma), $.cpar, $.optbody),

    field: $ => seq($.varDecl, $.semi),

    optbody: $ => choice(
      $.empty,
      $.body,
      $.higherOrderTerm
      ),

    empty: $ => $.semi,

    body: $ => seq($.obrace, $.exprOrTerm, $.cbrace),

    higherOrderTerm: $ => seq(
      $.eq,
      field('name', $.literalId),
      $.opar,
      sep($.predicateExpr, $.comma),
      $.cpar,
      $.opar,
      sep($.callArg, $.comma),
      $.cpar
    ),

    exprOrTerm: $ => choice(
      seq($.specialId, $.opar, $.cpar),                                        // SpecialCall
      prec.dynamic(10, seq($.opar, $.typeExpr, $.cpar, $.exprOrTerm)),                             // Cast
      $.primary,                                                           // PrimaryTerm
      seq($.unop, $.exprOrTerm),                                             // Unary
      prec.left(9,                                                       // MulOperation
        seq(
          field('left', $.exprOrTerm),
          $.mulop,
          field('right', $.exprOrTerm)
        )
      ),
      prec.left(8,                                                       // AddOperation
        seq(
          field('left', $.exprOrTerm),
          $.addop,
          field('right', $.exprOrTerm)
        )
      ),
      prec(7,                                                            // In
        seq(
          field('target', $.exprOrTerm),
          $.in,
          field('range', $.primary)
        )
      ),
      prec.left(6,                                                       // Comparison
        seq(
          field('left', $.exprOrTerm),
          $.compop,
          field('right', $.exprOrTerm)
        )
      ),
      prec(5, seq($.exprOrTerm, $.instanceof, $.typeExpr)),                         // Instanceof
      prec(4, seq($.not, $.exprOrTerm)),                                            // Not
      seq(                                                               // If
        $.if, field('cond', $.exprOrTerm),
        $.then, field('first', $.exprOrTerm),
        $.else, field('second', $.exprOrTerm)
      ),
      prec.left(3,                                                       // Conjunction
        seq(
          field('left', $.exprOrTerm),
          $.and,
          field('right', $.exprOrTerm)
        )
      ),
      prec.left(2,                                                       // Disjunction
        seq(
          field('left', $.exprOrTerm),
          $.or,
          field('right', $.exprOrTerm)
        )
      ),
      prec.right(1,                                                      // Implies
        seq(
          field('left', $.exprOrTerm),
          $.implies,
          field('right', $.exprOrTerm)
        )
      ),
      seq($.quantifier, $.opar,
        choice(
          seq(
            sep($.varDecl, $.comma),
            optional(seq($.bar, $.exprOrTerm, optional(seq($.bar, $.exprOrTerm))))
          ),
          $.exprOrTerm
        ),
        $.cpar)                         // QuantifiedTerm
    ),

    specialId: $ => $.none,

    quantifier: $ => choice($.exists, $.forall, $.forex),

    callArg: $ => choice(
      $.exprOrTerm,  // ExprArg
      $.underscore  // DontCare
    ),

    qualifiedRhs: $ => choice(
      seq($.predicateName, optional($.closure), $.opar, sep($.callArg, $.comma), $.cpar), //QualCall
      seq($.opar, $.typeExpr, $.cpar)                                        // QualCast
    ),
    
    primary: $ => choice(
      seq($.aritylessPredicateExpr, optional($.closure), $.opar, sep($.callArg, $.comma), $.cpar), // PredicateAtomExpr
      seq($.primary, $.dot, $.qualifiedRhs),                                        // QualifiedExpr
      $.literal,                                                                  // Lit
      $.variable,                                                                 // Var
      seq(optional(seq($.typeExpr, $.dot)), $.super),                                 // Super
      seq($.aggId,                                                                // Agg
        optional(
          seq($.oblock, sep1($.exprOrTerm, $.comma), $.cblock)
        ),
        $.opar,
        choice(
          seq(sep($.varDecl, $.comma),                                // FullAggBody
            optional(
              seq(
                $.bar,
                optional($.exprOrTerm),
                optional(seq($.bar, $.asExprs, optional($.orderBys)))
              )
            )
          ),
          seq($.asExprs, optional($.orderBys))           // ExprAggBody
        ),
        $.cpar
      ),
      seq(                                                                        // Range
        $.oblock,
        field('lower', $.exprOrTerm), $.range, field('upper', $.exprOrTerm),
        $.cblock
      ),
      seq($.opar, $.exprOrTerm, $.cpar)                                                 // ParExpr
    ),
    
    literal: $ => choice(
      $.integer,     // IntLit
      $.float,       // FloatLit
      $.bool,        // BoolLit
      $.string       // StringLit
    ),


    bool: $ => choice($.true, $.false),

    variable: $ => choice($.this, $.result, $.varName),

    compop: $ => choice($.eq, $.ne, $.lt, $.gt, $.le, $.ge),

    unop: $ => choice($.plus, $.minus),

    mulop: $ => choice($.star, $.slash, $.mod),

    addop : $ => choice($.plus, $.minus),

    closure : $ => choice($.star, $.plus),

    direction: $ => choice($.asc, $.desc),

    varDecl: $ => seq($.typeExpr, $.varName),

    asExprs : $ => sep1($.asExpr, $.comma),

    asExpr: $ => seq($.exprOrTerm, optional(seq($.as, $.simpleId))),

    orderBys: $ => seq($.order, $.by, sep1($.orderBy, $.comma)),

    orderBy: $ => seq($.exprOrTerm, optional($.direction)),
    
    qldoc: $ => /\/\*\*[^*]*\*+([^/*][^*]*\*+)*\//,

    literalId: $ => choice($.lowerId, $.atLowerId, $.upperId),

    annotation: $ => choice(
      field('name', $.annotName),                                  // SimpleAnnotation
      seq(                                                       // ArgsAnnotation
        field('name', $.annotName),
        $.oblock,
        field('args', sep1($.annotArg, $.comma)),
        $.cblock
      )
    ),


    annotName: $ => $.lowerId,

    annotArg: $ => choice($.simpleId, $.this, $.result),

    moduleName: $ => $.simpleId,

    qualModuleExpr: $ => sep1($.simpleId, $.dot),

    importModuleExpr: $ => seq($.qualModuleExpr, repeat(seq($.selection, $.simpleId))),

    moduleExpr: $ => choice($.simpleId, seq($.moduleExpr, $.selection,$.simpleId)),

    typeLiteral: $ => choice($.atLowerId, $.boolean, $.date, 'float', 'int', 'string'),

    simpleId: $ => choice($.lowerId, $.upperId),
    
    className: $ => $.upperId,

    dbtype: $ => $.atLowerId,

    returnType: $ => choice($.predicate, $.typeExpr),

    typeExpr: $ => choice(
      seq(optional(seq($.moduleExpr, $.selection)), $.upperId),
      $.typeLiteral
    ),

    predicateName: $ => $.lowerId,

    aritylessPredicateExpr: $ => seq(optional(seq($.moduleExpr, $.selection)), $.literalId),

    predicateExpr: $ => seq($.aritylessPredicateExpr, $.slash, $.integer),

    varName: $ => $.simpleId,

    aggId: $ => choice($.avg, $.concat, $.strictoncat, $.count, $.max, $.min, $.rank, $.strictcount, $.strictsum, $.sum, $.any),

    upperId: $ => /[A-Z][A-Za-z0-9_]*/,
    lowerId: $ => /[a-z][A-Za-z0-9_]*/,
    atLowerId: $ => /@[a-z][A-Za-z0-9_]*/,
    integer: $ => /[+-]?[0-9]+/,
    float: $ => /[+-]?[0-9]+\.[0-9]+/,
    string: $ => /"([^"\\\r\n\t]|\\["\\nrt])*"/,
    line_comment: $ => /\/\/[^\r\n]*/,
    block_comment: $ => /\/\*([^*]+\*+([^/*][^*]*\*+)*|\*)\//,

    and: $ => 'and',
    any: $ => 'any',
    as: $ => 'as',
    asc: $ => 'asc',
    avg: $ => 'avg',
    boolean: $ => 'boolean',
    by: $ => 'by',
    class: $ => 'class',
    newtype: $ => 'newtype',
    count: $ => 'count',
    date: $ => 'date',
    desc: $ => 'desc',
    else: $ => 'else',
    exists: $ => 'exists',
    extends: $ => 'extends',
    false: $ => 'false',
    forall: $ => 'forall',
    forex: $ => 'forex',
    from: $ => 'from',
    if: $ => 'if',
    implies: $ => 'implies',
    import: $ => 'import',
    in: $ => 'in',
    instanceof: $ => 'instanceof',
    max: $ => 'max',
    min: $ => 'min',
    not: $ => 'not',
    none: $ => 'none',
    or: $ => 'or',
    order: $ => 'order',
    predicate: $ => 'predicate',
    rank: $ => 'rank',
    result: $ => 'result',
    strictcount: $ => 'strictcount',
    strictsum: $ => 'strictsum',
    strictoncat: $ => 'strictconcat',
    concat: $ => 'concat',
    sum: $ => 'sum',
    super: $ => 'super',
    then: $ => 'then',
    this: $ => 'this',
    true: $ => 'true',
    where: $ => 'where',

    // symbols
    lt: $ => '<',
    le: $ => '<=',
    eq: $ => '=',
    gt: $ => '>',
    ge: $ => '>=',
    underscore: $ => '_',
    minus: $ => '-',
    comma: $ => ',',
    semi: $ => ';',
    ne: $ => '!=',
    slash: $ => '/',
    dot: $ => '.',
    range: $ => '..',
    opar: $ => '(',
    cpar: $ => ')',
    oblock: $ => '[',
    cblock: $ => ']',
    obrace: $ => '{',
    cbrace: $ => '}',
    star: $ => '*',
    mod: $ => '%',
    plus: $ => '+',
    bar: $ => '|',
    selection: $ => '::',
  }
});

function sep(rule, s) {
  return optional(sep1(rule, s))
}

function sep1(rule, s) {
  return seq(rule,repeat(seq(s,rule)))
}