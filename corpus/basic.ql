============
Basic Module
============

import javascript

select "hello world"

---

(source_file
  (ql
    (moduleBody
      (import (IMPORT)
        (moduleId
          (qualId
            (simpleId (Lowerid))))))))