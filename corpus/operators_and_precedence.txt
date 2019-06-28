============
And vs Or 1
============

from Foo f
where f = f and f = f or f = f
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
        (SELECT )
        (as_exprs 
          (as_expr 
            (expr 
              (primary 
                (variable 
                  (varname 
                    (simpleId 
                      (lowerId ))))))))))))

============
And vs Or 2
============

from Foo f
where f = f or f = f and f = f
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

============
Or vs implies
============

from Foo f
where (f = f or f = f implies f = f)
  and (f = f implies f = f or f = f)
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
          (conjunction 
            (formula 
              (fparen 
                (OPAR )
                (formula 
                  (implies 
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
                    (IMPLIES )
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
                (CPAR )))
            (AND )
            (formula 
              (fparen 
                (OPAR )
                (formula 
                  (implies 
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
                    (IMPLIES )
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
                                      (lowerId ))))))))))))
                (CPAR )))))
        (SELECT )
        (as_exprs 
          (as_expr 
            (expr 
              (primary 
                (variable 
                  (varname 
                    (simpleId 
                      (lowerId ))))))))))))

============
if then else
============

from Foo f
where if f = f then f = f else f = f
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
          (ifthen 
            (IF )
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
            (THEN )
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
            (ELSE )
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
        (SELECT )
        (as_exprs 
          (as_expr 
            (expr 
              (primary 
                (variable 
                  (varname 
                    (simpleId 
                      (lowerId ))))))))))))

==========
and vs not
==========

from Foo f
where not f = f and f = f
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
          (conjunction 
            (formula 
              (negated 
                (NOT )
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
        (SELECT )
        (as_exprs 
          (as_expr 
            (expr 
              (primary 
                (variable 
                  (varname 
                    (simpleId 
                      (lowerId ))))))))))))