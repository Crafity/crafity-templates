# Crafity Templates [![Dependency status](https://david-dm.org/crafity/crafity-templates.png)](https://david-dm.org/crafity/crafity-templates) [![Travis Build Status](https://travis-ci.org/Crafity/crafity-templates.png?branch=master)](https://travis-ci.org/Crafity/crafity-templates) [![NPM Module version](https://badge.fury.io/js/crafity-templates.png)](http://badge.fury.io/js/crafity-templates)

## Supported templates

Whenever you want to communicate a well formatted message to the user of your application you will be thinking of 
generating such a message on the fly. Imagine you have a couple of different situations in which generating messages is 
suitable: one user sends invitation to another, the system sends emails to user(s) on some subject.

Also, the application is multilingual, so versions of a single message will be available in different human languages. 
English is the default language in crafity-templates module.

This module supports generating messages that are templated with the following HTML preprocessors:
* Jade
* Haml


## Preparation

Install crafity-templates module via NPM installer or by cloning this repository from GitHub:

### via NPM

```sh
$ npm install
```

### via GitHub

```sh
$ git clone https://github.com/Crafity/crafity-templates.git
$ cd crafity-templates
```

Before you start using crafity-templates you must install all its dependencies. They are listed in ``package.json`` file under key ``dependencies``.
Install them first by running command on the terminal from ``crafity-templates`` as current directory:

```sh
$ npm install
```

After the dependencies have been installed, run the unit tests to check the sanity of the module. From the command line
and current directory ``crafity-templates`` type the command:

```sh
$ npm test
```

Things you need to prepare before calling the crafity-templates module:

1. Create folder ``resources`` under you application root folder.

2. Think of the human languages you want to support and create a new folder for each language, e.g. to support English, 
Bulgarian and Dutch you crate ``en``, ``bg`` and ``nl`` under ``resources`` folder. If you think it is a better 
organization to put another folder between resources and the language folder, just do so. Make sure you specify 
the	path "/resources/myFolderName/" in the configuration of the module.
		
		NB! Make also sure the *en* folder is always present as this is considered 
		the default and compulsory one.
		
3. Put your template files under the relevant language folder.


Upon initialization crafity-templates module assumes the following defaults:

* there is a folder ``resources`` under the application root folder
* there is one default folder ``en`` under ``resources``
* template files to be generated have extensions either ".jade" or ".haml"
* the custom configuration has one or more of the following properties:


	 config = {
			resourcePath: process.cwd() + "/resources" // current directory
			, defaultLanguage: "en"  		// English
			, preprocessor: "jade"
		}

* there is only one current preprocessor set at a time
* will use the file extentions that correspond with the configured preprocessor

Now, let's assume a scenario where you want your templates in Jade to reside in three different languages under your ***[appRootFolder]/resources/email_templates/*** :


You create the following structure:

	[appRootFolder]/resources/email_templates/en
		letter.jade
		letter.haml
	[appRootFolder]/resources/email_templates/nl
		letter.jade
	[appRootFolder]/resources/email_templates/bg
		letter.jade
		

## Public API

Require crafity-templates module and pass a configuragion in the ``init`` method:


```js
var templatesModule = require('crafity-templates')
		, newConfiguration = 
			{ 
				resourcePath: "~/resources/email_templates"
				, defaultLanguage: "nl"
				, preprocessor: "jade"
			}
		;

templatesModule
	.init(newConfiguration)
	.get("letter", function(err, template) {
		// TODO: handle error ...
		
		// merge template in Ditch with the data
		if (template) {
		
			var html = template.merge(viewModel);
			
			// TODO: send an email with this html body
		}
	});
```

### templatesModule.get([language], templateName, callback);

* ``language`` String - language (folder)
* ``templateName`` String - the name of the template
* ``callback`` Function

Setting a custom configuration in the beginnning means you don't intend to repeat the defaults
on every call of the ``get`` method.
But should you wish to call the ``get`` with a language that is switching on the fly then use the language argument.
If not passed the default configuration language will be used. One such call is:

```j
var templatesModule = require('crafity-templates')
		, newConfiguration = 
			{ 
				resourcePath: "~/resources/email_templates"
				, defaultLanguage: "nl"
				, preprocessor: "jade"
			}
		;

templatesModule
	.init(newConfiguration)
	.get("bg", "letter", function(err, template) {
		// TODO: handle error ...
		
		// merge template in Bulgarian with the data
		if (template) {
		
			var html = template.merge(viewModel);
			
			// TODO: send an email with this html body
		}
	});
```

Assume another scenario: configure Haml to be the default preprocessor and then call ``get`` for a fileName "letter" 
which is available on disk as letter.jade and letter.haml:

```js
var templatesModule = require('crafity-templates')
			, newConfiguration = 
				{ 
					resourcePath: "~/resources/email_templates"
					, preprocessor: "haml"
				}
			;

templatesModule
	.init(newConfiguration)
	.get("letter", function(err, template) {
		// TODO: handle error ...
		
		// merge template from the Haml file in English with the data
		if (template) {
		
			var html = template.merge(viewModel);
			
			// TODO: send an email with this html body
		}
	});
```

Alternatively if you call for a file the extension of which does not match with the configured preprocessor
then an exception will be thrown. 