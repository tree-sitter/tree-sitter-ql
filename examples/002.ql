select
  any(Foo f),
  any(Foo f | f = f),
  any(Foo f | | f.thing()),
  any(Foo f | f = f | f.thing())