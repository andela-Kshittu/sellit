'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('products/Categories/Phones%20and%20Tablets');

		// Home state routing
		$stateProvider.
		state('home', {
			url: 'products/Categories/Phones%20and%20Tablets',
			// templateUrl: 'modules/core/views/home.client.view.html'
		templateUrl: 'modules/products/views/categories-product.client.view.html'
		});
	}
]);


// modules/products/views/categories-product.client.view.html