/*jslint node: true, bitwise: true, unparam: true, maxerr: 50, white: true, stupid: true */
"use strict";

/*!
 * main.test - tests for crafity templates
 * Copyright(c) 2013 Crafity
 * Copyright(c) 2013 Galina Slavova
 * Copyright(c) 2013 Bart Riemens
 * MIT Licensed
 */

/**
 * Test dependencies.
 */

var jstest = require('crafity-jstest').createContext("USE CASE: crafity templates tests")
	, fs = require('fs')
	, assert = jstest.assert
	;

/**
 * Run the tests
 */

jstest.run({

	"BEFORE The module must be intantiated on require method": function () {

		var templatesModule = require('../main');
		assert.isDefined(templatesModule, "Expected crafity-templates module to be defined.");
	},
	
	"The module must be intantiated on require method": function () {

		var templatesModule = require("../main");
		assert.isDefined(templatesModule, "Expected crafity-templates module to be defined.");

		//throw new Error("TEST");

//		assert.fail();
	},

	"AFTER  The module must be intantiated on require method": function () {

		var templatesModule = require('../main');
		assert.isDefined(templatesModule, "Expected crafity-templates module to be defined.");

	}

});