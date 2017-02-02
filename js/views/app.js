/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/rectangles',
	'views/rectangles',
	'text!templates/stats.html',
	'common',
	'rectangle_component',
	'd3'
], function ($, _, Backbone, Rectangles, RectangleView, statsTemplate, Common, RectContainer, d3) {
	'use strict';

	// Our overall **AppView** is the top-level piece of UI.
	var AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Compile our stats template
		template: _.template(statsTemplate),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-rectangle':		'createOnEnter',
			'click #clear-completed':	'clearAll',
			'click #draw':              'draw'
		},

		// At initialization we bind to the relevant events on the `Rectangles`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-rectangle');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			this.$rectangleList = this.$('#rectangle-list');

			this.listenTo(Rectangles, 'add', this.addOne);
			this.listenTo(Rectangles, 'reset', this.addAll);
			this.listenTo(Rectangles, 'all', _.debounce(this.render, 0));

			Rectangles.fetch({reset:true});
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			if (Rectangles.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.template({
					// completed:6,
					remaining:Rectangles.length
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (Common.TodoFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (rectangle) {
			var view = new RectangleView({ model: rectangle });
			this.$rectangleList.append(view.render().el);
		},

		// Add all items in the **Rectangles** collection at once.
		addAll: function () {
			this.$rectangleList.empty();
			Rectangles.each(this.addOne, this);
		},

        clearAll: function() {
        	Rectangles.reset();
        },

		// Generate the attributes for a new Rectangle item.
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
			};
		},

		// If you hit return in the main input field, create new **Rectangle** model,
		// persisting it to *localStorage*.
		createOnEnter: function (e) {
			if (e.which !== Common.ENTER_KEY || !this.$input.val().trim()) {
				return;
			}

			Rectangles.create(this.newAttributes());
			this.$input.val('');
		},


		draw: function() {
            console.log("GOT DRAW:"+RectContainer)
            var sheet = new RectContainer(400,400);

            var rects = []
			Rectangles.each(function (todo) {
              var rect = todo.get('title');
              var vals = rect.split(',')
              rects.push({w:parseInt(vals[0]),h:parseInt(vals[1])})
			});


            var rs = sheet.makeRects(rects);
            // console.log("RS:"+rs);
            sheet.findRect(rs);
            sheet.printRects();
			// Using d3 draw the rectangles and their positions
			$("#rectangles").empty();

			var svg = d3.select("#rectangles")
			.append("svg")
			.attr("width", "100%")
			.attr("height", "100%");

            sheet.clearRects(svg);
			sheet.drawRects(svg);

		},

	});

	return AppView;
});
