# koa-load-middlewares

> Loads in any koa middlewares and attaches them to the global scope, or an object of your choice.

Inspired by [gulp-load-plugins][] & [load-grunt-tasks][]

[![NPM version][npm-img]][npm-url]
[![Build status][travis-img]][travis-url]
[![Test coverage][coveralls-img]][coveralls-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

## Install

```sh
$ npm install --save koa-load-middlewares
```

## Usage

Given a `package.json` file that has some dependencies within:

```json
{
    "dependencies": {
        "koa-swig": "*",
        "koa-bodyparser": "*"
    }
}
```

Adding this into your koa server file:

```js
var koa = require('koa');
var koaLoadMiddlewares = require('koa-load-middlewares');
var middlewares = koaLoadMiddlewares();
```

Or, even shorter:

```js
var middlewares = require('koa-load-middlewares')();
```

Will result in the following happening (roughly, plugins are lazy loaded but in practice you won't notice any difference):

```js
middlewares.swig = require('koa-swig');
middlewares.bodyparser = require('koa-bodyparser');
```

You can then use the plugins just like you would if you'd manually required them, but referring to them as `middlewares.name()`, rather than just `name()`.

This frees you up from having to manually require each koa middleware.

## Options

You can pass in an object of options that are shown below: (the values for the keys are the defaults):

```js
koaLoadMiddlewares({
    pattern: ['koa-*', 'koa.*'], // the glob(s) to search for
    config: 'package.json', // where to find the plugins, by default  searched up from process.cwd() 
    scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
    replaceString: /^koa(-|\.)/, // what to remove from the name of the module when adding it to the context
    camelize: true, // if true, transforms hyphenated plugins names to camel case
    lazy: true, // whether the plugins should be lazy loaded on demand
    rename: {} // a mapping of plugins to rename
});
```


[npm-img]: https://img.shields.io/npm/v/koa-load-middlewares.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-load-middlewares
[travis-img]: https://img.shields.io/travis/koa-modules/load-middlewares.svg?style=flat-square
[travis-url]: https://travis-ci.org/koa-modules/load-middlewares
[coveralls-img]: https://img.shields.io/coveralls/koa-modules/load-middlewares.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koa-modules/load-middlewares?branch=master
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[david-img]: https://img.shields.io/david/koa-modules/load-middlewares.svg?style=flat-square
[david-url]: https://david-dm.org/koa-modules/load-middlewares
[gulp-load-plugins]: https://github.com/jackfranklin/gulp-load-plugins
[load-grunt-tasks]: https://github.com/sindresorhus/load-grunt-tasks
