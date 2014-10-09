'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
	function($stateProvider) {
		// Products state routing
		$stateProvider.
		state('listProducts', {
			url: '/products',
			templateUrl: 'modules/products/views/list-products.client.view.html'
		}).
		state('createProduct', {
			url: '/products/create',
			templateUrl: 'modules/products/views/create-product.client.view.html'
		}).
		state('catProduct',{
			url: '/products/Categories',
			templateUrl: 'modules/products/views/categories-product.client.view.html'
		}).
		state('viewcatProduct', {
			url: '/products/Categories/:catName',
			templateUrl: 'modules/products/views/view-categories.client.view.html'
		}).
		state('myProducts',{
			url: '/products/myProducts',
			templateUrl: 'modules/products/views/myproducts-product.client.view.html'
		}).
		state('viewProduct', {
			url: '/products/:productId',
			templateUrl: 'modules/products/views/view-product.client.view.html'
		}).
		state('editProduct', {
			url: '/products/:productId/edit',
			templateUrl: 'modules/products/views/edit-product.client.view.html'
		});
	}
]);