/*global define */
define([
	'backbone',
	'backboneLocalstorage',
	'models/rectangle'
], function (Backbone, Store, Rectangle) {
	'use strict';

	var RectanglesCollection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: Rectangle,

		// Save all of the rectangle items under this example's namespace.
		localStorage: new Store('rectangles-backbone'),

	});

	return new RectanglesCollection();
});
