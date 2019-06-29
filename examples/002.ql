
from Foo f
where exists(f.aThing())
   or exists(Foo f | f.aThing())
   or exists(Foo f | f.aThing() | f.aThing())
   or forall(Foo f | f.aThing() | f.aThing())
   or forex(Foo f | f.aThing() | f.aThing())
select f
