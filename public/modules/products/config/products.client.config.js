'use strict';

// Configuring the Articles module
angular.module('products').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Products', 'products', 'dropdown', '/products(/create)?');
		Menus.addSubMenuItem('topbar', 'products', 'All Products', 'products');
		Menus.addSubMenuItem('topbar', 'products', 'Create Product', 'products/create');
		Menus.addSubMenuItem('topbar', 'products', 'All Categories', 'products/Categories');
		Menus.addSubMenuItem('topbar', 'products', 'My Products', 'products/myProducts');
	}
]);