/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Rectangle = Backbone.Model.extend({
		// Default attributes for the rectangle
		defaults: {
			title: ''
		},

	});

	return Rectangle;
});
