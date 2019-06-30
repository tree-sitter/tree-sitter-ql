select
  rank[123](Foo f),
  count(f.thing()),
  count(f.thing() as thing order by thing asc, thing desc),
  count(Foo f),
  count(Foo f | f.thing() ),
  sum(Foo f | | f.x() ),
  sum(Foo f | | f.x() as x),
  sum(Foo f | | f.x() as x order by x),
  sum(Foo f | | f.x() as x order by x asc, f.y()),
  sum(Foo f | f.thing() | f.x() )