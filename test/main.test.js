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

var jstest = require('crafity-jstest').createContext("module crafity-templates tests")
	, fs = require('fs')
	, assert = jstest.assert
	;

/**
 * Run the tests
 */

jstest.run({

	"The module should be defined after using 'require' directive.": function () {
		var templatesModule = require("../main").init();
		assert.isDefined(templatesModule, "Expected crafity-templates module to be defined.");
	},

	// configuration tests
	"The module has a default configuration after using 'require' directive.": function () {
		var templatesModule = require("../main").init();

//		console.log("print: config = ", templatesModule.getConfigString());
		assert.hasValue(templatesModule.getRawConfigString(), "Expected crafity-templates module to have a default config.");
		assert.isTrue(templatesModule.getRawConfigString().length > 0, "Expected crafity-templates module to have not an empty string.");
	},

	"Supports English as the default resource language.": function () {
		var templatesModule = require("../main").init();

		assert.isTrue(templatesModule.getConfigLanguage() === "en", "Expected crafity-templates module to have English as default language.");
	},

	"Supports Jade as the default Html preprocessor.": function () {
		var templatesModule = require("../main").init();

		assert.isTrue(templatesModule.getCurrentPreprocessor().toUpperCase() === "JADE", "Expected that Jade is the default preprocessor.");
	},

	"When a custom configuration is set it should have keys: resourcePath or defaultLanguage or preprocessor or all.": function () {
		var templatesModule = require("../main").init()

			, configuration =
			{
				resourcePath: ".",
				defaultLanguage: "bg",
				preprocessor: "Jade"
			}
			, correctConfigKeys = templatesModule.setConfig(configuration)
			;

		assert.isTrue(correctConfigKeys, "Provided configuration keys are not correct.");
	},

	"When a custom configuration is set with no keys Then the internal configuration has not changed.": function () {
		var templatesModule = require("../main").init()

			, defaultConfigString = templatesModule.getRawConfigString()
			, configuration = {}
			, correct = templatesModule.setConfig(configuration)
			, changedConfigString = templatesModule.getRawConfigString()
			;

		assert.isFalse(correct, "It must be false.");
		assert.areEqual(defaultConfigString, changedConfigString, "Changed configuration value is not equal to the default config value.");
	},

	"When a custom configuration is set with invalid keys Then the internal configuration has not changed.": function () {
		var templatesModule = require("../main").init()

			, defaultConfigString = templatesModule.getRawConfigString()
			, configuration =
			{
				resourcePad: ".",			// wrong spelling
				defaultLanguage: "bg",
			}
			, correct = templatesModule.setConfig(configuration)
			, changedConfigString = templatesModule.getRawConfigString()
			;

		assert.isFalse(correct, "It must be false.");
		assert.areEqual(defaultConfigString, changedConfigString, "Changed configuration must be equal to the default config value.");
	},

	"When no configuration was provided in setConfig method Then the internal configuration has not changed.": function () {
		var templatesModule = require("../main").init();

		// #1 null
		var defaultConfigString = templatesModule.getRawConfigString()
			, correct = templatesModule.setConfig(null)
			, changedConfigString = templatesModule.getRawConfigString()
			;

		assert.isFalse(correct, "It must be false.");
		assert.areEqual(defaultConfigString, changedConfigString, "Changed configuration must be equal to the default config value.");

		// #2 undefined
		var defaultConfigString1 = templatesModule.getRawConfigString()
			, correct1 = templatesModule.setConfig(undefined)
			, changedConfigString1 = templatesModule.getRawConfigString()
			;

		assert.isFalse(correct1, "It must be false.");
		assert.areEqual(defaultConfigString1, changedConfigString1, "Changed configuration must be equal to the default config value.");

		// #3 
		var defaultConfigString2 = templatesModule.getRawConfigString()
			, correct2 = templatesModule.setConfig()
			, changedConfigString2 = templatesModule.getRawConfigString()
			;

		assert.isFalse(correct2, "It must be false.");
		assert.areEqual(defaultConfigString2, changedConfigString2, "Changed configuration must be equal to the default config value.");
	},

	// get method tests
	"When calling get method with no arguments Then an error is thrown.": function () {
		var templatesModule = require("../main").init();

		try {
			templatesModule.get();
		} catch (err) {
			assert.isDefined(err, "Expected that an error should be thrown.");
		}

	},

	"When calling get method with arguments: callback Then an error is thrown.": function () {
		var templatesModule = require("../main").init()
			;

		try {
			templatesModule.get(function (err, templateObject) {
				console.log("");
			});

		} catch (err) {
			assert.isDefined(err, "Expected that an error should be thrown.");
		}
	},

	"When calling get method with language as argument that does not exist as a folder Then an error is thrown": function () {
		// Arrange
		var templatesModule = require("../main").init()
			;

		// Act
		try {

			templatesModule.get("bg", "letter", function (err, template) {
				console.log(""); // jslint doesn't accept an empty block
			});

		} catch (err) {

			// Assert
			assert.isDefined(err, "Expected that an error should be thrown.");
		}
	},

	"When calling get method with arguments: templateName and callback Then the default language folder is used.": function () {
		var templatesModule = require("../main").init()
			;

		templatesModule.get("letter", function (err, template) {
			assert.isDefined(template, "The template object should be defined.");
		});

	},

	"When calling get method with legal arguments Then a template object is returned.": function () {
		var templatesModule = require("../main").init()
			;

		templatesModule.get("en", "letter", function (err, templateObject) {

			assert.isDefined(templateObject, "Expected the template object to be defined.");
			assert.isTrue((templateObject.merge instanceof Function), "Expected the template object to have a merge function.");
		});

	},

	// merge method tests
	"When calling merge method of a template object Then an HTML output is returned.Async.": function (test) {
		// Set this test to an async test with a max duration of 2 seconds
		test.async(2000);

		var templatesModule = require("../main").init()
			, htmlResult;

		test.steps([
			function getTemplate(next) {
				templatesModule.get("en", "letter", function (err, result) {
					var viewModel = {
						name: "Zoe Heller",
						nameSender: "Don Fey",
						subjectSender: "A letter from a fan",
						textSender: "Thank you for being such a skillful belletrist! I'm looking forward to reading new titles from you. All the best!"
					};

					htmlResult = result.merge(viewModel);

					next();
				});
			},
		]).on("complete", test.complete);

		test.on("complete", function () {
			assert.hasValue(htmlResult, "Result must have value.");
			assert.isTrue(htmlResult.length > 0, "Result must not be an empty string.");
		});

	},

	"When a preprocessor is configured other than jade and haml Then an error is thrown.": function () {
		// Arrange
		var templatesModule = require("../main").init({ preprocessor: "exotic" });

		try {
			// Act
			templatesModule.get("letter", function (err, template) {
				console.log("");
			});
		} catch (err) {
			// Assert
			assert.isDefined(err, "Expected that an error should be thrown.");
		}

	},

	// combination tests
	"When Haml preprocessor is configured and get method is being called for templateName file Then the haml extension is used.": function () {
		// Arrange
		var templatesModule = require("../main").init({ preprocessor: "haml" });

		// Act
		templatesModule.get("letter", function (err, template) {

			var viewModel = {
					name: "Zoe Heller",
					nameSender: "Don Fey",
					subjectSender: "A letter from a fan",
					textSender: "Thank you for being such a skillful belletrist! I'm looking forward to reading new titles from you. All the best!"
				}

				, html = template.merge(viewModel)
				;

			// Assert
			assert.isTrue(html.length > 0, "Expected that the produced Html is not empty.");
		});

	}

});

module.exports = jstest;
