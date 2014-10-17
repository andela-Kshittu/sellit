'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'shop-quick';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'angularFileUpload'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('categories');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('products');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');// 'use strict';
// // Configuring the Articles module
// angular.module('categories').run(['Menus',
// 	function(Menus) {
// 		// Set top bar menu items
// 		Menus.addMenuItem('topbar', 'Categories', 'categories', 'dropdown', '/categories(/create)?');
// 		Menus.addSubMenuItem('topbar', 'categories', 'List Categories', 'categories');
// 		Menus.addSubMenuItem('topbar', 'categories', 'New Category', 'categories/create');
// 	}
// ]);
'use strict';
//Setting up route
angular.module('categories').config([
  '$stateProvider',
  function ($stateProvider) {
    // Categories state routing
    $stateProvider.state('listCategories', {
      url: '/categories',
      templateUrl: 'modules/categories/views/list-categories.client.view.html'
    }).state('createCategory', {
      url: '/categories/create',
      templateUrl: 'modules/categories/views/create-category.client.view.html'
    }).state('viewCategory', {
      url: '/categories/:categoryId',
      templateUrl: 'modules/categories/views/view-category.client.view.html'
    }).state('editCategory', {
      url: '/categories/:categoryId/edit',
      templateUrl: 'modules/categories/views/edit-category.client.view.html'
    });
  }
]);'use strict';
// Categories controller
angular.module('categories').controller('CategoriesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Categories',
  function ($scope, $stateParams, $location, Authentication, Categories) {
    $scope.authentication = Authentication;
    // Create new Category
    $scope.create = function () {
      // Create new Category object
      var category = new Categories({ name: this.name });
      // Redirect after save
      category.$save(function (response) {
        $location.path('categories/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Category
    $scope.remove = function (category) {
      if (category) {
        category.$remove();
        for (var i in $scope.categories) {
          if ($scope.categories[i] === category) {
            $scope.categories.splice(i, 1);
          }
        }
      } else {
        $scope.category.$remove(function () {
          $location.path('categories');
        });
      }
    };
    // Update existing Category
    $scope.update = function () {
      var category = $scope.category;
      category.$update(function () {
        $location.path('categories/' + category._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Categories
    $scope.find = function () {
      $scope.categories = Categories.query();
    };
    // Find existing Category
    $scope.findOne = function () {
      $scope.category = Categories.get({ categoryId: $stateParams.categoryId });
    };
  }
]);// 'use strict';
// //Categories service used to communicate Categories REST endpoints
// var app = angular.module('categories');
// app.factory('Categories', ['$resource',
//     function($resource) {
//         return $resource('categories/:categoryId', {
//             categoryId: '@_id'
//         }, {
//             update: {
//                 method: 'PUT'
//             }
//         });
//     }
// ]);
// app.factory('Prods', ['$http', function($http) {
//     var o = {
//         prods: []
//     };
//     o.like = function(product) {
//         return $http.put('/products/' + product._id + '/like')
//             .success(function(data) {
//                 product.likes += 1;
//                 product.likesView = false;
//             });
//     };
//     o.dislike = function(product) {
//         return $http.put('/products/' + product._id + '/dislike')
//             .success(function(data) {
//                 product.likes -= 1;
//                 product.likesView = true;
//             });
//     };
//     o.addComment = function(id, comment) {
//         return $http.post('/products/' + id + '/comments', comment);
//     };
//     o.likeComment = function(product, comment) {
//         return $http.put('/products/' + product._id + '/comments/' + comment._id + '/like')
//             .success(function(data) {
//                 comment.likes += 1;
//                 comment.likesView = false;
//             });
//     };
//     o.dislikeComment = function(product, comment) {
//         return $http.put('/products/' + product._id + '/comments/' + comment._id + '/dislike')
//             .success(function(data) {
//                 comment.likes -= 1;
//                 comment.likesView = true;
//             });
//     };
//     return o;
// }]);
'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module
angular.module('products').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Create Product', 'products/create');
    Menus.addMenuItem('topbar', 'My Products', 'products/myProducts');
    Menus.addMenuItem('topbar', 'All Categories', 'products/Categories/Phones%20and%20Tablets');
    Menus.addMenuItem('topbar', 'All Products', 'products');
  }
]);'use strict';
//Setting up route
angular.module('products').config([
  '$stateProvider',
  function ($stateProvider) {
    // Products state routing
    $stateProvider.state('listProducts', {
      url: '/products',
      templateUrl: 'modules/products/views/list-products.client.view.html'
    }).state('createProduct', {
      url: '/products/create',
      templateUrl: 'modules/products/views/create-product.client.view.html'
    }).state('catProduct', {
      url: '/products/Categories',
      templateUrl: 'modules/products/views/categories-product.client.view.html'
    }).state('viewcatProduct', {
      url: '/products/Categories/:catName',
      templateUrl: 'modules/products/views/categories-product.client.view.html'
    }).state('myProducts', {
      url: '/products/myProducts',
      templateUrl: 'modules/products/views/myproducts-product.client.view.html'
    }).state('viewProduct', {
      url: '/products/:productId',
      templateUrl: 'modules/products/views/view-product.client.view.html'
    }).state('editProduct', {
      url: '/products/:productId/edit',
      templateUrl: 'modules/products/views/edit-product.client.view.html'
    }).state('search', {
      url: '/search',
      templateUrl: 'modules/products/views/view-search.client.view.html'
    });
  }
]);'use strict';
var app = angular.module('products');
// Products controller
app.controller('ProductsController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  'Products',
  '$upload',
  'Prods',
  function ($scope, $stateParams, $http, $location, Authentication, Products, $upload, Prods) {
    $scope.authentication = Authentication;
    $scope.categoryList = [
      {
        'name': 'Phones and Tablets',
        'src': 'modules/core/img/server/Temp/img/phones-icons.jpg'
      },
      {
        'name': 'Laptops',
        'src': 'modules/core/img/server/Temp/img/laptops.jpg'
      },
      {
        'name': 'Fashion and Designs',
        'src': 'modules/core/img/server/Temp/img/fashion.jpg'
      },
      {
        'name': 'Real Estate',
        'src': 'modules/core/img/server/Temp/img/house.jpg'
      },
      {
        'name': 'Vehicles',
        'src': 'modules/core/img/server/Temp/img/vehicles.jpg'
      },
      {
        'name': 'Others',
        'src': 'modules/core/img/server/Temp/img/others.jpg'
      }
    ];
    $scope.selectedFile = [];
    $scope.uploadProgress = 0;
    $scope.searchQuery;
    $scope.currentCat = $stateParams.catName;
    $scope.body;
    $scope.author;
    $scope.formShow = false;
    $scope.userQuery;
    $scope.typeOptions = [
      {
        name: 'By Name',
        value: 'name'
      },
      {
        name: 'By Categories',
        value: 'category'
      },
      {
        name: 'By Cost',
        value: 'cost'
      },
      {
        name: 'By Negotiation',
        value: 'negotiable'
      },
      {
        name: 'By Description',
        value: 'description'
      },
      {
        name: 'By Location',
        value: 'location'
      }
    ];
    $scope.myform = $scope.typeOptions[0].value;
    $scope.searchData = Prods.prods;
    $scope.nosearchData = Prods.noSearchData;
    $scope.closeAlert = function () {
    };
    $scope.search = function () {
      $http.get('/search/?' + $scope.myform + '=' + $scope.userQuery).success(function (response) {
        if (response.length === 0) {
          Prods.noSearchData = true;
          $scope.nosearchData = Prods.noSearchData;
          $scope.userQuery = '';
          $location.path('search');
        } else {
          Prods.noSearchData = false;
          $scope.nosearchData = Prods.noSearchData;
          Prods.prods = response;
          $scope.searchData = Prods.prods;
          $scope.userQuery = '';
          $location.path('search');
        }
      }).error(function (data) {
        console.log('there was an error');
      });
    };
    $scope.commentForm = function () {
      $scope.formShow = true;
    };
    $scope.incrementUpvotes = function (product) {
      Prods.like(product);
    };
    $scope.decrementUpvotes = function (product) {
      Prods.dislike(product);
    };
    $scope.incrementCommentUpvotes = function (product, comment) {
      Prods.likeComment(product, comment);
    };
    $scope.decrementCommentUpvotes = function (product, comment) {
      Prods.dislikeComment(product, comment);
    };
    $scope.addComment = function (product) {
      $scope.formShow = false;
      if ($scope.body === '' || $scope.author === '') {
        return;
      }
      Prods.addComment(product._id, {
        body: $scope.body,
        author: $scope.author
      }).success(function (comment) {
        $scope.findOne();
      });
      $scope.body = '';
      $scope.author = '';
    };
    // Create new Product
    $scope.create = function () {
      // Create new Product object
      var product = new Products({
          name: this.name,
          description: this.description,
          quantity: this.quantity,
          category: this.category,
          negotiable: this.negotiable,
          cost: this.cost,
          location: this.location,
          phone_number: this.phone_number
        });
      $scope.upload = $upload.upload({
        url: 'products/',
        method: 'POST',
        data: product,
        file: $scope.files[0]
      }).progress(function (evt) {
        $scope.uploadProgress = parseInt(100 * evt.loaded / evt.total, 10);
      }).success(function (response) {
        $location.path('products/' + response._id);
        // Clear form fields
        $scope.name = '';
        $scope.description = '';
        $scope.photo = '';
        $scope.quantity = '';
        $scope.category = '';
        $scope.negotiable = '';
        $scope.cost = '';
        $scope.location = '';
        $scope.phone_number = '';
      }).error(function (err, response) {
        $scope.error = response.message;
      });
    };
    $scope.onFileSelect = function ($files) {
      $scope.uploadProgress = 0;
      $scope.files = $files;
      if ($scope.files) {
        if ($scope.files[0].type === 'image/jpeg' || $scope.files[0].type === 'image/png') {
          $scope.correctFormat = true;
        } else {
          $scope.correctFormat = false;
          alert('Wrong File Format Please Change the file.');
        }
      }
    };
    $scope.nowRedirect = function () {
      if ($scope.authentication.user) {
        $location.path('products/create');
      } else {
        $location.path('signin');
      }
    };
    // Remove existing Product
    $scope.remove = function (product) {
      if (product) {
        product.$remove();
        for (var i in $scope.products) {
          if ($scope.products[i] === product) {
            $scope.products.splice(i, 1);
          }
        }
      } else {
        $scope.product.$remove(function () {
          $location.path('products');
        });
      }
    };
    // Update existing Product
    $scope.update = function () {
      var product = $scope.product;
      product.$update(function () {
        $location.path('products/' + product._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Products
    $scope.find = function () {
      $scope.products = Products.query();
    };
    $scope.findOne = function () {
      $scope.product = Products.get({ productId: $stateParams.productId });
    };
  }
]);
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition']).controller('CarouselController', [
  '$scope',
  '$timeout',
  '$transition',
  '$q',
  function ($scope, $timeout, $transition, $q) {
  }
]).directive('carousel', [function () {
    return {};
  }]);'use strict';
var app = angular.module('products');
app.directive('progressBar', [function () {
    return {
      link: function ($scope, el, attrs) {
        $scope.$watch(attrs.progressBar, function (newValue) {
          el.css('width', newValue.toString() + '%');
        });
      }
    };
  }]);'use strict';
var app = angular.module('products');
//Products service used to communicate Products REST endpoints
app.factory('Products', [
  '$resource',
  function ($resource) {
    return $resource('products/:productId', { productId: '@_id' }, { update: { method: 'PUT' } });
  }
]);
app.factory('Prods', [
  '$http',
  function ($http) {
    var actions = { prods: [] };
    actions.noSearchData = false;
    actions.like = function (product) {
      return $http.put('/products/' + product._id + '/like').success(function (data) {
        product.likes += 1;
        product.likesView = false;
      });
    };
    actions.dislike = function (product) {
      return $http.put('/products/' + product._id + '/dislike').success(function (data) {
        product.likes -= 1;
        product.likesView = true;
      });
    };
    actions.addComment = function (id, comment) {
      return $http.post('/products/' + id + '/comments', comment);
    };
    actions.likeComment = function (product, comment) {
      return $http.put('/products/' + product._id + '/comments/' + comment._id + '/like').success(function (data) {
        comment.likes += 1;
        comment.likesView = false;
      });
    };
    actions.dislikeComment = function (product, comment) {
      return $http.put('/products/' + product._id + '/comments/' + comment._id + '/dislike').success(function (data) {
        comment.likes -= 1;
        comment.likesView = true;
      });
    };
    return actions;
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);