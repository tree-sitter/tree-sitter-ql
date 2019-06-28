module.exports = grammar({
  name: 'ql',

  extras: $ => [
    $.comment,
    /\s/
  ],

  rules: {

    source_file: $ => $.ql,

    // keywords
    AND          : $ => 'and',
    ANY          : $ => 'any',
    AS           : $ => 'as',
    ASC          : $ => 'asc',
    AVG          : $ => 'avg',
    BOOLEAN      : $ => 'boolean',
    BY           : $ => 'by',
    CLASS        : $ => 'class',
    NEWTYPE      : $ => 'newtype',
    COUNT        : $ => 'count',
    DATE         : $ => 'date',
    DESC         : $ => 'desc',
    ELSE         : $ => 'else',
    EXISTS       : $ => 'exists',
    EXTENDS      : $ => 'extends',
    FALSE        : $ => 'false',
    FLOAT        : $ => 'float',
    FORALL       : $ => 'forall',
    FOREX        : $ => 'forex',
    FROM         : $ => 'from',
    IF           : $ => 'if',
    IMPLIES      : $ => 'implies',
    IMPORT       : $ => 'import',
    IN           : $ => 'in',
    INSTANCEOF   : $ => 'instanceof',
    INT          : $ => 'int',
    MAX          : $ => 'max',
    MIN          : $ => 'min',
    MODULE       : $ => 'module',
    NOT          : $ => 'not',
    NONE         : $ => 'none',
    OR           : $ => 'or',
    ORDER        : $ => 'order',
    PREDICATE    : $ => 'predicate',
    RANK         : $ => 'rank',
    RESULT       : $ => 'result',
    SELECT       : $ => 'select',
    STRICTCOUNT  : $ => 'strictcount',
    STRICTSUM    : $ => 'strictsum',
    STRICTCONCAT : $ => 'strictconcat',
    CONCAT       : $ => 'concat',
    STRING       : $ => 'string',
    SUM          : $ => 'sum',
    SUPER        : $ => 'super',
    THEN         : $ => 'then',
    THIS         : $ => 'this',
    TRUE         : $ => 'true',
    WHERE        : $ => 'where',

    // symbols
    LT         : $ => '<',
    LE         : $ => '<=',
    EQ         : $ => '=',
    GT         : $ => '>',
    GE         : $ => '>=',
    UNDERSCORE : $ => '_',
    MINUS      : $ => '-',
    COMMA      : $ => ',',
    SEMI       : $ => ';',
    NE         : $ => '!=',
    SLASH      : $ => '/',
    DOT        : $ => '.',
    RANGE      : $ => '..',
    OPAR       : $ => '(',
    CPAR       : $ => ')',
    OBLOCK     : $ => '[',
    CBLOCK     : $ => ']',
    OBRACE     : $ => '{',
    CBRACE     : $ => '}',
    STAR       : $ => '*',
    MOD        : $ => '%',
    PLUS       : $ => '+',
    BAR        : $ => '|',
    SELECTION  : $ => '::',

    lowerId: $ => /[a-z][0-9A-Za-z_]*/,
    upperId: $ => /[A-Z][0-9A-Za-z_]*/,
    atlowerId: $ => /@[a-z][0-9A-Za-z_]*/,

    int: $ => /[0-9]+/,

    float: $ => seq(/[0-9]+/, '.', /[0-9]+/),

    string: $ => seq(
      '"',
      repeat(choice(
        /[^\\"\n\r\t]/,
        seq('\\', /[\\"nrt]/),
      )),
      '"',
    ),

    // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
    comment: $ => token(choice(
      seq('//', /.*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )
    )),

    // Summary of Syntax https://help.semmle.com/QL/ql-spec/language.html#summary-of-syntax

    ql: $ => $.moduleBody,

    module: $ => seq(
      repeat($.annotation),
      $.MODULE,
      $.modulename,
      $.OBRACE,
      $.moduleBody,
      $.CBRACE
    ),

    moduleBody: $ => repeat1(
      choice(
        $.import,
        // $.predicate,
        // $.class,
        // $.module,
        // $.alias,
        $.select
      )
    ),

    import: $ => seq(
      repeat($.annotation), $.IMPORT, $.moduleId, optional(seq($.AS, $.modulename))
    ),

    qualId: $ => choice(
      $.simpleId,
      seq($.qualId, $.DOT, $.simpleId)
    ),

    moduleId: $ => choice(
      $.qualId,
      seq($.moduleId, $.SELECTION, $.simpleId)
    ),

    select: $ => seq(
      optional(seq($.FROM, $.var_decls)),
      optional(seq($.WHERE, $.formula)),
      $.SELECT,
      $.as_exprs,
      optional(seq($.ORDER, $.BY, $.orderbys))
    ),

    as_exprs: $ => seq(
      $.as_expr, repeat(seq($.COMMA, $.as_expr))
    ),

    as_expr: $ => seq(
      $.expr, optional(seq($.AS, $.simpleId))
    ),

    orderbys: $ => seq(
      $.orderby, repeat(seq($.COMMA, $.orderby))
    ),

    orderby: $ => seq(
      $.simpleId, optional(choice($.ASC, $.DESC))
    ),

    annotation: $ => choice(
      $.simpleAnnotation, $.argsAnnotation
    ),

    simpleAnnotation: $ => choice (
      'abstract',
      'cached',
      'external',
      'final',
      'transient',
      'library',
      'private',
      'deprecated',
      'override',
      'query',
    ),

    argsAnnotation: $ => choice (
      seq(
        'pragma',
        $.OBLOCK,
        choice('noinline', 'nomagic', 'noopt'),
        $.CBLOCK
      ),
      seq(
        'language',
        $.OBLOCK,
        'monotonicAggregates',
        $.CBLOCK
      ),
      seq(
        'bindingset',
        $.OBLOCK,
        optional(seq(
          $.variable,
          repeat(seq($.COMMA, $.variable))
        )),
        $.CBLOCK
      )
    ),

    type: $ => seq(
      choice(
        seq(optional(seq($.moduleId, $.SELECTION)), $.classname),
        $.dbasetype,
        $.BOOLEAN,
        $.DATE,
        $.FLOAT,
        $.INT,
        $.STRING
      )
    ),

    var_decls: $ => seq(
      $.var_decl, repeat(seq($.COMMA, $.var_decl))
    ),

    var_decl: $ => seq(
      $.type, $.simpleId
    ),

    formula: $ => choice(
      // $.fparen,
      // $.disjunction,
      // $.conjunction,
      // $.implies,
      // $.ifthen,
      // $.negated,
      // $.quantified,
      $.comparison,
      // $.instanceof,
      // $.inrange,
      // $.call,
    ),

    comparison: $ => seq(
      $.expr, $.compop, $.expr
    ),

    compop: $ => choice(
      '=', '!=', '<', '>', '<=', '>='
    ),

    expr: $ => choice(
      // $.dontcare,
      // $.unop,
      // $.binop,
      // $.cast,
      $.primary,
    ),

    primary: $ => choice(
      // $.eparen,
      $.literal,
      $.variable,
      // $.super_expr,
      // $.postfix_cast,
      // $.callwithresults,
      // $.aggregation,
      // $.any,
      // $.range,
    ),

    literal: $ => choice(
      $.FALSE,
      $.TRUE,
      $.int,
      $.float,
      $.string
    ),

    variable: $ => choice(
      $.varname,
      $.THIS,
      $.RESULT
    ),

    simpleId: $ => choice($.lowerId, $.upperId),

    modulename: $ => $.simpleId,

    classname: $ => $.upperId,

    dbasetype: $ => $.atlowerId,

    varname: $ => $.simpleId

  }
});