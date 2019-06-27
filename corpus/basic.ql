============
Basic Module
============

import javascript

select
  "hello world" as foo,
  "other",
  "string with escaped \\ backslashes \" quotes \n\r\t whitespace"

---

(source_file 
  (ql 
    (moduleBody 
      (import 
        (IMPORT )
        (moduleId 
          (qualId 
            (simpleId 
              (Lowerid )))))
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
              (Lowerid )))
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
                  (string ))))))))))