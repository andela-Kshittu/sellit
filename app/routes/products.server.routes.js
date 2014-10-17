'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var products = require('../../app/controllers/products');

	// Products Routes
	app.route('/products')
		.get(products.list)
		.post(users.requiresLogin, products.create);

	app.route('/products/:productId')
		.get(products.read)
		.put(users.requiresLogin, products.hasAuthorization, products.update)
		.delete(users.requiresLogin, products.hasAuthorization, products.delete);
	
	app.route('/products/:productId/like')
		.put(products.like);

	app.route('/products/:productId/dislike')
		.put(products.dislike);
		
	app.route('/products/:productId/comments')
		.post(products.comments);
	
	app.route('/products/:productId/comments/:commentId')
		// .get(products.readComment)
		.put(users.requiresLogin, products.hasAuthorization, products.updateComment);
	
	app.route('/products/:productId/comments/:commentId/like')
		.put(products.commentLike);
	app.route('/products/:productId/comments/:commentId/dislike')
		.put(products.commentdisLike);

	app.route('/search').get(products.search);
	// Finish by binding the Product middleware
	app.param('productId', products.productByID);
	app.param('commentId', products.commentByID);
};