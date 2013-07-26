/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true, stupid: true */
"use strict";

/*!
 * package.test - package.json tests
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Galina Slavova
 * Copyright(c) 2013 Bart Riemens
 * MIT Licensed
 */

/**
 * Test dependencies.
 */

var jstest = require('crafity-jstest').createContext("Module Package Test")
  , fs = require('fs')
  , assert = jstest.assert
  ;

/**
 * Run the tests
 */

jstest.run({

  'The module must have main.js file': function () {

    var main = require('../main');
    assert.isDefined(main, "Expected main to be defined");
  },

  'The module must have a fullname': function () {
    var main = require('../main');
    assert.isDefined(main.fullname, "Expected fullname to be defined");
  },

  'The module must have a version number': function () {
    var main = require('../main');
    assert.isDefined(main.version, "Expected version number to be defined");
  },

  'The module must have package.json file': function (context) {
    fs.readFileSync("./package.json");
  },

  'The module must have the same name as quoted in package.json': function () {

    var data = fs.readFileSync("./package.json")
      , json = JSON.parse(data.toString())
      , main = require('../main')
      ;

    assert.areEqual(json.name, main.fullname, "Expected module name to be the same in both places.");

  },

  'The module must have the same version as quoted in package.json': function () {

    var data = fs.readFileSync("./package.json")
      , json = JSON.parse(data.toString())
      , main = require('../main')
      ;

    assert.isDefined(json.version, "Expected fs to be defined");
    assert.areEqual(main.version, json.version, "Expected the same module version!");
  }

});
