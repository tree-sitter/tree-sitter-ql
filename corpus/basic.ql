============
Basic select
============

import javascript

select
  "hello world" as foo,
  "other",
  "string with escaped \\ backslashes \" quotes \n\r\t whitespace",
  1234,
  1234.4321,
  true,
  false

---

(source_file 
  (ql 
    (moduleBody 
      (import 
        (IMPORT )
        (moduleId 
          (qualId 
            (simpleId 
              (lowerId )))))
      (select 
        (SELECT )
        (as_exprs 
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (string ))))
            (AS )
            (simpleId 
              (lowerId )))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (string )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (string )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (int )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (float )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (TRUE )))))
          (COMMA )
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (FALSE ))))))))))

============
Select with variables and order by
============

from
  Foo foo,
  some.module::submodule::Bar bar,
  @dbtype bar,
  boolean b,
  date d,
  float f,
  int i,
  string s
select "hello world"
order by foo, bar desc, baz asc

---

(source_file 
  (ql 
    (moduleBody 
      (select 
        (FROM )
        (var_decls 
          (var_decl 
            (type 
              (classname 
                (upperId )))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (moduleId 
                (moduleId 
                  (qualId 
                    (qualId 
                      (simpleId 
                        (lowerId )))
                    (DOT )
                    (simpleId 
                      (lowerId ))))
                (SELECTION )
                (simpleId 
                  (lowerId )))
              (SELECTION )
              (classname 
                (upperId )))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (dbasetype 
                (atlowerId )))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (BOOLEAN ))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (DATE ))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (FLOAT ))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (INT ))
            (simpleId 
              (lowerId )))
          (COMMA )
          (var_decl 
            (type 
              (STRING ))
            (simpleId 
              (lowerId ))))
        (SELECT )
        (as_exprs 
          (as_expr 
            (expr 
              (primary 
                (literal 
                  (string ))))))
        (ORDER )
        (BY )
        (orderbys 
          (orderby 
            (simpleId 
              (lowerId )))
          (COMMA )
          (orderby 
            (simpleId 
              (lowerId ))
            (DESC ))
          (COMMA )
          (orderby 
            (simpleId 
              (lowerId ))
            (ASC )))))))

========================
Annotations and comments
========================

private import foo // some other comment

/*
 * Some comment
 */
pragma[noinline]
bindingset[foobar, this]
import bar

---

(source_file 
  (ql 
    (moduleBody 
      (import 
        (annotation 
          (simpleAnnotation ))
        (IMPORT )
        (moduleId 
          (qualId 
            (simpleId 
              (lowerId )))))
      (comment )
      (comment )
      (import 
        (annotation 
          (argsAnnotation 
            (OBLOCK )
            (CBLOCK )))
        (annotation 
          (argsAnnotation 
            (OBLOCK )
            (variable 
              (varname 
                (simpleId 
                  (lowerId ))))
            (COMMA )
            (variable 
              (THIS ))
            (CBLOCK )))
        (IMPORT )
        (moduleId 
          (qualId 
            (simpleId 
              (lowerId ))))))))

=======
Formula
=======

from File f
where (f = f)
  or f != f
  and f < f
  and (f > f or f <= f)
  and f >= f
select f

---

(source_file 
  (ql 
    (moduleBody 
      (select 
        (FROM )
        (var_decls 
          (var_decl 
            (type 
              (classname 
                (upperId )))
            (simpleId 
              (lowerId ))))
        (WHERE )
        (formula 
          (disjunction 
            (formula 
              (fparen 
                (OPAR )
                (formula 
                  (comparison 
                    (expr 
                      (primary 
                        (variable 
                          (varname 
                            (simpleId 
                              (lowerId ))))))
                    (compop )
                    (expr 
                      (primary 
                        (variable 
                          (varname 
                            (simpleId 
                              (lowerId ))))))))
                (CPAR )))
            (OR )
            (formula 
              (conjunction 
                (formula 
                  (conjunction 
                    (formula 
                      (conjunction 
                        (formula 
                          (comparison 
                            (expr 
                              (primary 
                                (variable 
                                  (varname 
                                    (simpleId 
                                      (lowerId ))))))
                            (compop )
                            (expr 
                              (primary 
                                (variable 
                                  (varname 
                                    (simpleId 
                                      (lowerId ))))))))
                        (AND )
                        (formula 
                          (comparison 
                            (expr 
                              (primary 
                                (variable 
                                  (varname 
                                    (simpleId 
                                      (lowerId ))))))
                            (compop )
                            (expr 
                              (primary 
                                (variable 
                                  (varname 
                                    (simpleId 
                                      (lowerId ))))))))))
                    (AND )
                    (formula 
                      (fparen 
                        (OPAR )
                        (formula 
                          (disjunction 
                            (formula 
                              (comparison 
                                (expr 
                                  (primary 
                                    (variable 
                                      (varname 
                                        (simpleId 
                                          (lowerId ))))))
                                (compop )
                                (expr 
                                  (primary 
                                    (variable 
                                      (varname 
                                        (simpleId 
                                          (lowerId ))))))))
                            (OR )
                            (formula 
                              (comparison 
                                (expr 
                                  (primary 
                                    (variable 
                                      (varname 
                                        (simpleId 
                                          (lowerId ))))))
                                (compop )
                                (expr 
                                  (primary 
                                    (variable 
                                      (varname 
                                        (simpleId 
                                          (lowerId ))))))))))
                        (CPAR )))))
                (AND )
                (formula 
                  (comparison 
                    (expr 
                      (primary 
                        (variable 
                          (varname 
                            (simpleId 
                              (lowerId ))))))
                    (compop )
                    (expr 
                      (primary 
                        (variable 
                          (varname 
                            (simpleId 
                              (lowerId ))))))))))))
        (SELECT )
        (as_exprs 
          (as_expr 
            (expr 
              (primary 
                (variable 
                  (varname 
                    (simpleId 
                      (lowerId ))))))))))))