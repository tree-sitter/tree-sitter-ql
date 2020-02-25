// symbols
const LT = '<';
const LE = '<=';
const EQ = '=';
const GT = '>';
const GE = '>=';
const UNDERSCORE = '_';
const MINUS = '-';
const COMMA = ',';
const SEMI = ';';
const NE = '!=';
const SLASH = '/';
const DOT = '.';
const RANGE = '..';
const OPAR = '(';
const CPAR = ')';
const OBLOCK = '[';
const CBLOCK = ']';
const OBRACE = '{';
const CBRACE = '}';
const STAR = '*';
const MOD = '%';
const PLUS = '+';
const BAR = '|';
const SELECTION = '::';


module.exports = grammar({
  name: 'QL',
  conflicts: $ => [
    [$.moduleExpr],
    [$.specialId, $.aggId],
    [$.simpleId, $.typeExpr],
    [$.simpleId, $.literalId],
    [$.varDecl, $.returnType]
  ],
  word: $ => $.lowerId,
  extras: $ => [
    /[ \t\r\n]/,
    $.line_comment,
    $.block_comment,
  ],

  rules: {

    ql: $ => repeat($.moduleMember),

    module: $ => seq(MODULE, $.moduleName, choice(seq(OBRACE, repeat($.moduleMember), CBRACE), $.moduleAliasBody)),

    moduleMember: $ => choice(
      seq(
        repeat($.annotation),
        choice($.imprt, $.classlessPredicate, $.dataclass, $.datatype, $.select, $.module)
      ),
      $.qldoc
    ),

    imprt: $ => seq(IMPORT, $.importModuleExpr, optional(seq(AS, $.moduleName))),

    moduleAliasBody: $ => seq(EQ, $.moduleExpr, SEMI),
    predicateAliasBody: $ => seq(EQ, $.predicateExpr, SEMI),
    typeAliasBody: $ => seq(EQ, $.typeExpr, SEMI),

    classlessPredicate: $ => seq(
      $.returnType,
      $.predicateName,
      choice(
        seq(OPAR, sep($.varDecl, COMMA), CPAR, $.optbody),
        $.predicateAliasBody
      )
    ),

    datatype: $ => seq(NEWTYPE, $.className, EQ, $.datatypeBranches),
    datatypeBranches: $ => sep1($.datatypeBranch, OR),

    datatypeBranch: $ => seq(
      optional($.qldoc),
      optional($.annotation),
      $.className,
      OPAR,
      sep($.varDecl, COMMA),
      CPAR,
      optional($.body)
    ),

    select: $ => seq(
      optional(seq(FROM, sep($.varDecl, COMMA))),
      optional(seq(WHERE, $.exprOrTerm)),
      seq(SELECT, $.asExprs, optional($.orderBys))
    ),

    dataclass: $ => seq(
      CLASS, $.className,
      choice(
        seq(EXTENDS, sep1($.typeExpr, COMMA), OBRACE, repeat($.classMember), CBRACE),
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

    charpred: $ => seq($.className, OPAR, CPAR, OBRACE, $.exprOrTerm, CBRACE),

    memberPredicate: $ => seq($.returnType, $.predicateName, OPAR, sep($.varDecl, COMMA), CPAR, $.optbody),

    field: $ => seq($.varDecl, SEMI),

    optbody: $ => choice(
      $.empty,
      $.body,
      $.higherOrderTerm
      ),


    empty: $ => SEMI,

    body: $ => seq(OBRACE, $.exprOrTerm, CBRACE),

    higherOrderTerm: $ => seq(
      EQ,
      field('name', $.literalId),
      OPAR,
      sep($.predicateExpr, COMMA),
      CPAR,
      OPAR,
      sep($.callArg, COMMA),
      CPAR
    ),

    exprOrTerm: $ => choice(
      seq($.specialId, OPAR, CPAR),                                        // SpecialCall
      seq(OPAR, $.typeExpr, CPAR, $.exprOrTerm),                             // Cast
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
      prec(7,                                                            // IN
        seq(
          field('target', $.exprOrTerm),
          IN,
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
      prec(5, seq($.exprOrTerm, INSTANCEOF, $.typeExpr)),                         // Instanceof
      prec(4, seq(NOT, $.exprOrTerm)),                                            // Not
      seq(                                                               // If
        IF, field('cond', $.exprOrTerm),
        THEN, field('first', $.exprOrTerm),
        ELSE, field('second', $.exprOrTerm)
      ),
      prec.left(3,                                                       // Conjunction
        seq(
          field('left', $.exprOrTerm),
          AND,
          field('right', $.exprOrTerm)
        )
      ),
      prec.left(2,                                                       // Disjunction
        seq(
          field('left', $.exprOrTerm),
          OR,
          field('right', $.exprOrTerm)
        )
      ),
      prec.right(1,                                                      // Implies
        seq(
          field('left', $.exprOrTerm),
          IMPLIES,
          field('right', $.exprOrTerm)
        )
      ),
      seq($.quantifier, OPAR,
        choice(
          seq(
            sep($.varDecl, COMMA),
            optional(seq(BAR, $.exprOrTerm, optional(seq(BAR, $.exprOrTerm))))
          ),
          $.exprOrTerm
        ),
        CPAR)                         // QuantifiedTerm
    ),

    specialId: $ => choice(ANY, NONE),

    quantifier: $ => choice(EXISTS, FORALL, FOREX),

    callArg: $ => choice(
      $.exprOrTerm,  // ExprArg
      UNDERSCORE  // DontCare
    ),

    qualifiedRhs: $ => choice(
      seq($.predicateName, optional($.closure), OPAR, sep($.callArg, COMMA), CPAR), //QualCall
      seq(OPAR, $.typeExpr, CPAR)                                        // QualCast
    ),

    primary: $ => choice(
      seq($.aritylessPredicateExpr, optional($.closure), OPAR, sep($.callArg, COMMA), CPAR), // PredicateAtomExpr
      seq($.primary, DOT, $.qualifiedRhs),                                        // QualifiedExpr
      $.literal,                                                                  // Lit
      $.variable,                                                                 // Var
      seq(optional(seq($.typeExpr, DOT)), SUPER),                                 // Super
      seq($.aggId,                                                                // Agg
        optional(
          seq(OBLOCK, sep1($.exprOrTerm, COMMA), CBLOCK)
        ),
        OPAR,
        choice(
          seq(sep($.varDecl, COMMA),                                // FullAggBody
            optional(
              seq(
                BAR,
                optional($.exprOrTerm),
                optional(seq(BAR, $.asExprs, optional($.orderBys)))
              )
            )
          ),
          seq($.asExprs, optional($.orderBys))           // ExprAggBody
        ),
        CPAR
      ),
      seq(                                                                        // Range
        OBLOCK,
        field('lower', $.exprOrTerm), RANGE, field('upper', $.exprOrTerm),
        CBLOCK
      ),
      seq(OPAR, $.exprOrTerm, CPAR)                                                 // ParExpr
    ),

    literal: $ => choice(
      $.integer,     // IntLit
      $.float,       // FloatLit
      $.bool,        // BoolLit
      $.string       // StringLit
    ),


    bool: $ => choice(TRUE, FALSE),

    variable: $ => choice(THIS, RESULT, $.varName),

    compop: $ => choice(EQ, NE, LT, GT, LE, GE),

    unop: $ => choice(PLUS, MINUS),

    mulop: $ => choice(STAR, SLASH, MOD),

    addop : $ => choice(PLUS, MINUS),

    closure : $ => choice(STAR, PLUS),

    direction: $ => choice(ASC, DESC),

    varDecl: $ => seq($.typeExpr, $.varName),

    asExprs : $ => sep1($.asExpr, COMMA),

    asExpr: $ => seq($.exprOrTerm, optional(seq(AS, $.simpleId))),

    orderBys: $ => seq(ORDER, BY, sep1($.orderBy, COMMA)),

    orderBy: $ => seq($.exprOrTerm, optional($.direction)),

    qldoc: $ => /\/\*\*[^*]*\*+([^/*][^*]*\*+)*\//,


    simpleId: $ => choice($.lowerId, $.upperId),

    literalId: $ => choice($.lowerId, $.atLowerId, $.upperId),

    annotation: $ => choice(
      field('name', $.annotName),                                  // SimpleAnnotation
      seq(                                                       // ArgsAnnotation
        field('name', $.annotName),
        OBLOCK,
        field('args', sep1($.annotArg, COMMA)),
        CBLOCK
      )
    ),


    annotName: $ => $.lowerId,

    annotArg: $ => choice($.simpleId, THIS, RESULT),

    moduleName: $ => $.simpleId,

    qualModuleExpr: $ => sep1($.simpleId, DOT),

    importModuleExpr: $ => seq($.qualModuleExpr, repeat(seq(SELECTION, $.simpleId))),

    moduleExpr: $ => sep1($.simpleId, SELECTION),

    typeLiteral: $ => choice($.atLowerId, BOOLEAN, DATE, FLOAT, INT, STRING),

    className: $ => $.upperId,

    dbtype: $ => $.atLowerId,

    returnType: $ => choice(PREDICATE, $.typeExpr),

    typeExpr: $ => choice(
      seq(optional(seq($.moduleExpr, SELECTION)), $.upperId),
      $.typeLiteral
    ),

    predicateName: $ => $.lowerId,

    aritylessPredicateExpr: $ => seq(optional(seq($.moduleExpr, SELECTION)), $.literalId),

    predicateExpr: $ => seq($.aritylessPredicateExpr, SLASH, $.integer),

    varName: $ => $.simpleId,

    aggId: $ => choice(AVG, CONCAT, STRICTCONCAT, COUNT, MAX, MIN, RANK, STRICTCOUNT, STRICTSUM, SUM, ANY),

    upperId: $ => /[A-Z][A-Za-z0-9_]*/,
    lowerId: $ => /[a-z][A-Za-z0-9_]*/,
    atLowerId: $ => /@[a-z][A-Za-z0-9_]*/,
    integer: $ => /[+-]?[0-9]+/,
    float: $ => /[+-]?[0-9]+\.[0-9]+/,
    string: $ => /"([^"\\\r\n\t]|\\["\\nrt])*"/,
    line_comment: $ => /\/\/[^\r\n]*/,
    block_comment: $ => /\/\*([^*]+\*+([^/*][^*]*\*+)*|\*)\//,

    const AND = 'and';
    const ANY = 'any';
    const AS = 'as';
    const ASC = 'asc';
    const AVG = 'avg';
    const BOOLEAN = 'boolean';
    const BY = 'by';
    const CLASS = 'class';
    const NEWTYPE = 'newtype';
    const COUNT = 'count';
    const DATE = 'date';
    const DESC = 'desc';
    const ELSE = 'else';
    const EXISTS = 'exists';
    const EXTENDS = 'extends';
    const FALSE = 'false';
    const FLOAT = 'float';
    const FORALL = 'forall';
    const FOREX = 'forex';
    const FROM = 'from';
    const IF = 'if';
    const IMPLIES = 'implies';
    const IMPORT = 'import';
    const IN = 'in';
    const INSTANCEOF = 'instanceof';
    const INT = 'int';
    const MAX = 'max';
    const MIN = 'min';
    const MODULE = 'module';
    const NOT = 'not';
    const NONE = 'none';
    const OR = 'or';
    const ORDER = 'order';
    const PREDICATE = 'predicate';
    const RANK = 'rank';
    const RESULT = 'result';
    const SELECT = 'select';
    const STRICTCOUNT = 'strictcount';
    const STRICTSUM = 'strictsum';
    const STRICTCONCAT = 'strictconcat';
    const CONCAT = 'concat';
    const STRING = 'string';
    const SUM = 'sum';
    const SUPER = 'super';
    const THEN = 'then';
    const THIS = 'this';
    const TRUE = 'true';
    const WHERE = 'where';


  }
});

function sep(rule, s) {
  return optional(sep1(rule, s))
}

function sep1(rule, s) {
  return seq(rule, repeat(seq(s, rule)))
}
