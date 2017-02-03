/*global define*/
define([
	'backbone'
], function (Backbone) {
	'use strict';

	var Rectangle = Backbone.Model.extend({
		// Default attributes for the rectangle
		defaults: {
			title: ''
		},

	});

	return Rectangle;
});
