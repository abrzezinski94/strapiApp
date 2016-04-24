'use strict';
var assert = require('assert');
var sinon = require('sinon');

//====================================================================

var koaLoadMiddlewares = (function() {
  var wrapInFunc = function(value) {
    return function() {
      return value;
    };
  };

  var proxyquire = require('proxyquire').noCallThru();

  return proxyquire('./', {
    'koa-foo': wrapInFunc({ name: 'foo' }),
    'koa-bar': wrapInFunc({ name: 'bar' }),
    'koa-foo-bar': wrapInFunc({ name: 'foo-bar' }),
    'jack-foo': wrapInFunc({ name: 'jack-foo' }),
    'koa-insert': {
      'append':  wrapInFunc({ name: 'insert.append' }),
      'wrap':   wrapInFunc({ name: 'insert.wrap' })
    },
    'koa.baz': wrapInFunc({ name: 'baz' }),
    'findup-sync': function() { return null; }
  });
})();

//====================================================================

describe('configuration', function() {
  it('throws a nice error if no configuration is found', function() {
    assert.throws(function() {
      koaLoadMiddlewares({
        config: null
      });
    }, /Could not find dependencies. Do you have a package.json file in your project?/);
  });
});


// Contains common tests with and without lazy mode.
var commonTests = function(lazy) {
  it('loads things in', function() {
    var x = koaLoadMiddlewares({
      lazy: lazy,
      config: {
        dependencies: {
          'koa-foo': '1.0.0',
          'koa-bar': '*',
          'koa-insert': '*',
          'koa.baz': '*'
        }
      }
    });

    assert.deepEqual(x.foo(), {
      name: 'foo'
    });
    assert.deepEqual(x.bar(), {
      name: 'bar'
    });
    assert.deepEqual(x.baz(), {
      name: 'baz'
    });
    assert.deepEqual(x.insert.wrap(), {
      name: 'insert.wrap'
    });
    assert.deepEqual(x.insert.append(), {
      name: 'insert.append'
    });
  });

  it('can take a pattern override', function() {
    var x = koaLoadMiddlewares({
      lazy: lazy,
      pattern: 'jack-*',
      replaceString: 'jack-',
      config: {
        dependencies: {
          'jack-foo': '1.0.0',
          'koa-bar': '*'
        }
      }
    });

    assert.deepEqual(x.foo(), {
      name: 'jack-foo'
    });
    assert(!x.bar);
  });

  it('allows camelizing to be turned off', function() {
    var x = koaLoadMiddlewares({
      lazy: lazy,
      camelize: false,
      config: {
        dependencies: {
          'koa-foo-bar': '*'
        }
      }
    });

    assert.deepEqual(x['foo-bar'](), {
      name: 'foo-bar'
    });
  });

  it('camelizes plugins name by default', function() {
    var x = koaLoadMiddlewares({
      lazy: lazy,
      config: {
        dependencies: {
          'koa-foo-bar': '*'
        }
      }
    });

    assert.deepEqual(x.fooBar(), {
      name: 'foo-bar'
    });
  });

  it('lets something be completely renamed', function() {
    var x = koaLoadMiddlewares({
      lazy: lazy,
      config: { dependencies: { 'koa-foo': '1.0.0' } },
      rename: { 'koa-foo': 'bar' }
    });

    assert.deepEqual(x.bar(), { name: 'foo' });
  });
};

describe('no lazy loading', function() {
  commonTests(false);

  var x, spy;
  before(function() {
    spy = sinon.spy();
    x = koaLoadMiddlewares({
      lazy: false,
      config: {
        dependencies: {
          'koa-insert': '*'
        }
      },
      requireFn: function() {
        spy();
        return function() {};
      }
    });
  });

  it('does require at first', function() {
    assert(spy.called);
  });
});

describe('with lazy loading', function() {
  commonTests(true);

  var x, spy;
  before(function() {
    spy = sinon.spy();
    x = koaLoadMiddlewares({
      lazy: true,
      config: {
        dependencies: {
          'koa-insert': '*'
        }
      },
      requireFn: function() {
        spy();
        return function() {};
      }
    });
  });

  it('does not require at first', function() {
    assert(!spy.called);
  });

  it('does when the property is accessed', function() {
    x.insert();
    assert(spy.called);
  });
});