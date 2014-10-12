'use strict';

// Configuring the Articles module
angular.module('products').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Products', 'products', 'dropdown', '/products(/create)?');
		Menus.addMenuItem('topbar',  'Create Product', 'products/create');
		Menus.addMenuItem('topbar',  'My Products', 'products/myProducts');
		Menus.addMenuItem('topbar',  'All Categories','products/Categories/Phones%20and%20Tablets');
		Menus.addMenuItem('topbar',  'All Products','products', 'products');
	}
]);