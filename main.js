/*jslint node: true, white: true */
"use strict";

/*!
 * crafity-templates - Generic template provider
 * Copyright(c) 2010-2013 Crafity
 * Copyright(c) 2010-2013 Galina Slavova
 * Copyright(c) 2010-2013 Bart Riemens
 * MIT Licensed
 */

var fs = require('crafity-filesystem')
	, jade = require('jade')
	, haml = require('hamljs')
	, config =
	{
		resourcePath: process.cwd() + "/resources" 	// current directory
		, defaultLanguage: "en"  										// English
		, preprocessor: "jade"
	}

	, innerConfig = {
		resourcePath: config.resourcePath, defaultLanguage: config.defaultLanguage, preprocessor: config.preprocessor
	};

/**
 * Module name.
 */
module.exports.fullname = "crafity-templates";

/**
 * Module version.
 */
module.exports.version = '0.1.2';

/**
 * Set a custom configuration by specifying:
 * a path to the template resources or
 * a default language or
 * another preprocessor than Jade or
 * all three of them.
 *
 * Example:
 *
 * var configuration =
 *    { 
 *			resourcePath: '.', 
 *			defaultLanguage: 'nl', 
 *			preprocessor: 'jade'
 *		}
 *
 * @param configuration - required
 * @returns {boolean} - indicates whether a compleely valid configuration object was provided.
 */
exports.setConfig = function (configuration) {
	var correct = true;

	if (!configuration) {
		correct = false;
		return correct;
	}

	if (Object.keys(configuration).length === 0) {
		correct = false;
		return correct;
	}

	Object.keys(configuration).forEach(function (key) {

		if (key.toUpperCase() === "RESOURCEPATH" && correct === true) {
			config.resourcePath = configuration[key];
		}
		else if (key.toUpperCase() === "DEFAULTLANGUAGE" && correct === true) {
			config.defaultLanguage = configuration[key];
		}
		else if (key.toUpperCase() === "PREPROCESSOR" && correct === true) {
			config.preprocessor = configuration[key];
		} else {
			correct = false;
			return; // get out of this loop
		}

	});

	return correct;
};

/**
 * (Re)Initialize.
 *
 * @param configuration - optional
 */
exports.init = function (configuration) {
	// reset config to default
	config = {
		resourcePath: innerConfig.resourcePath,
		defaultLanguage: innerConfig.defaultLanguage,
		preprocessor: innerConfig.preprocessor
	};

	// for backward compatibility only
	if (configuration) {
		exports.setConfig(configuration);
	}

	return exports;
};

/**
 * Get the language value from configuration.
 * @returns {string}
 */
exports.getConfigLanguage = function () {
	return config.defaultLanguage;
};

/**
 * Get the path value from configuraiton.
 * @returns {*}
 */
exports.getConfigResourcePath = function () {
	return config.resourcePath;
};

/**
 * Get the current preprocessor name
 * @returns {string}
 */
exports.getCurrentPreprocessor = function () {
	return config.preprocessor;
};

/**
 * Get the stringifies version of the configuration.
 *
 * @returns {*}
 */
exports.getRawConfigString = function () {
	return JSON.stringify(config);
};

/**
 * Get the template specified by name and human language.
 *
 * Example:
 *
 *    module.get("nl", "letter", function(err, template) { 
 *    	// code ...
 *			var html = template.merge(myViewModelObject);
 *		});
 *
 * This method requires at least two arguments: a templateName and a callback function.
 * When language is not specified, the default is used.
 *
 * @param language - optional
 * @param templateName - required
 * @param callback - required
 */
exports.get = function (language, templateName, callback) {
	if (config.preprocessor !== "jade" && config.preprocessor !== "haml") {
		return callback(new Error("Unknown preprocessor."), null);
	}

	// sanitize the incoming optional arguments
	if (arguments.length < 2) {

		return callback(
			new Error("Insufficient number of arguments. templateName and a callback function are required!")
			, null);
	}

	if (!callback instanceof Function) {
		return callback(new Error("Last argument must be a callback function."));
	}

	// templateName and callback are passed
	if (arguments.length === 2
		&& language
		&& templateName instanceof Function
		&& !callback) {

		callback = templateName;
		templateName = language;
		language = config.defaultLanguage;
	}

	var templateFilename = fs.combine(config.resourcePath, language, templateName + "." + config.preprocessor);

	fs.readFile(templateFilename, function (err, fileBuffer) {
			if (err) {
				return callback(err, null);
			}

			var fileContent = fileBuffer.toString()
				, template = {};

			template.merge = function merge(data) {

				if (config.preprocessor === "jade") {
					return jade.compile(fileContent)(data);
				}
				if (config.preprocessor === "haml") {
					return haml.render(fileContent,
						{
							filename: templateName + "." + config.preprocessor,
							locals: data
						});
				}

				throw new Error("Unknown Html preprocessor.");

			};

			return callback(null, template);
		}
	);

};
