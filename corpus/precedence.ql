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