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
	, config = {
		path: process.cwd(),
		defaultLanguage: "en"
	};

exports.init = function(configuration){
	config = configuration;
};

exports.get = function get (language, key, callback) {

	if (language && key && key instanceof Function && !callback) {
		callback = key;
		key = language;
		language = config.defaultLanguage;
	}
	if (language && !key) {
		key = language;
		language = config.defaultLanguage;
	}

	var templateFilename = fs.combine(process.cwd() + config.path, language, key + ".jade");
	
	fs.readFile(templateFilename, function (err, fileBuffer) {
		if (err) {
			throw err;
		}
		
		var fileContent = fileBuffer.toString()
			, jadeRenderer = jade.compile(fileContent)
			, template = {};
		
		template.merge = function merge(data) {
			return jadeRenderer(data);
		};
		
		callback(err, template);
	});
};