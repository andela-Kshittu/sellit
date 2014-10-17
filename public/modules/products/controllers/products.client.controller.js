'use strict';
var app = angular.module('products');
// Products controller
app.controller('ProductsController', ['$scope', '$stateParams', '$http', '$location', 'Authentication','Products', '$upload', 'Prods',
    function($scope, $stateParams, $http, $location, Authentication, Products, $upload, Prods) {
        $scope.authentication = Authentication;
        $scope.categoryList = [{
            "name": "Phones and Tablets",
            "src": "modules/core/img/server/Temp/img/phones-icons.jpg"
        }, {
            "name": "Laptops",
            "src": "modules/core/img/server/Temp/img/laptops.jpg"
        }, {
            "name": "Fashion and Designs",
            "src": "modules/core/img/server/Temp/img/fashion.jpg"
        }, {
            "name": "Real Estate",
            "src": "modules/core/img/server/Temp/img/house.jpg"
        }, {
            "name": "Vehicles",
            "src": "modules/core/img/server/Temp/img/vehicles.jpg"
        }, {
            "name": "Others",
            "src": "modules/core/img/server/Temp/img/others.jpg"
        }];
        $scope.selectedFile = [];
        $scope.uploadProgress = 0;
        $scope.searchQuery;
        $scope.currentCat = $stateParams.catName;
        $scope.body;
        $scope.author;
        $scope.formShow = false;
        $scope.userQuery;
        $scope.typeOptions = [{
            name: 'By Name',
            value: 'name'
        }, {
            name: 'By Categories',
            value: 'category'
        }, {
            name: 'By Cost',
            value: 'cost'
        }, {
            name: 'By Negotiation',
            value: 'negotiable'
        }, {
            name: 'By Description',
            value: 'description'
        }, {
            name: 'By Location',
            value: 'location'
        }];
        $scope.myform = $scope.typeOptions[0].value;
        $scope.searchData = Prods.prods;
        $scope.nosearchData = Prods.noSearchData;
         $scope.closeAlert = function() { 
  };
        $scope.search = function() {
            $http.get('/search/?' + $scope.myform + '=' + $scope.userQuery)
                .success(
                    function(response) {
                    	if (response.length === 0){
                    		Prods.noSearchData = true;
                    		$scope.nosearchData = Prods.noSearchData;
                            $scope.userQuery = '';
                    		$location.path('search');
                    	}
                    	else{
                    	Prods.noSearchData = false;
                    	$scope.nosearchData = Prods.noSearchData;
                        Prods.prods = response;
                        $scope.searchData = Prods.prods;
                        $scope.userQuery = '';
                        $location.path('search');
                    }
                    }).error(function(data) {
                    console.log('there was an error');
                });
        };
        $scope.commentForm = function() {
            $scope.formShow = true;
        };
        $scope.incrementUpvotes = function(product) {
            Prods.like(product);
        };
        $scope.decrementUpvotes = function(product) {
            Prods.dislike(product);
        };
        $scope.incrementCommentUpvotes = function(product, comment) {
            Prods.likeComment(product, comment);
        };
        $scope.decrementCommentUpvotes = function(product, comment) {
            Prods.dislikeComment(product, comment);
        };

        $scope.addComment = function(product) {
            $scope.formShow = false;
            if (($scope.body === '') || ($scope.author === '')) {
                return;
            }
            Prods.addComment(product._id, {
                body: $scope.body,
                author: $scope.author,
            }).success(function(comment) {
                $scope.findOne();
            });
            $scope.body = '';
            $scope.author = '';
        };
        // Create new Product
        $scope.create = function() {
            // Create new Product object
                var product = new Products({
                    name: this.name,
                    description: this.description,
                    quantity: this.quantity,
                    category: this.category,
                    negotiable: this.negotiable,
                    cost: this.cost,
                    location: this.location,
                    phone_number: this.phone_number,
                });
                $scope.upload = $upload.upload({
                    url: 'products/',
                    method: 'POST',
                    data: product,
                    file: $scope.files[0]
                }).progress(function(evt) {
                    $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
                }).success(function(response) {
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
                }).error(function(err, response) {
                    $scope.error = response.message;
                });
        };
        $scope.onFileSelect = function($files) {
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
        $scope.nowRedirect = function(){
        	if ($scope.authentication.user){
        		$location.path('products/create');
        	}
        	else{
        		$location.path('signin');
        	}
        };
        // Remove existing Product
        $scope.remove = function(product) {
            if (product) {
                product.$remove();

                for (var i in $scope.products) {
                    if ($scope.products[i] === product) {
                        $scope.products.splice(i, 1);
                    }
                }
            } else {
                $scope.product.$remove(function() {
                    $location.path('products');
                });
            }
        };
        // Update existing Product
        $scope.update = function() {
            var product = $scope.product;

            product.$update(function() {
                $location.path('products/' + product._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        // Find a list of Products
        $scope.find = function() {
            $scope.products = Products.query();
        };
        $scope.findOne = function() {
            $scope.product = Products.get({
                productId: $stateParams.productId
            });
        };
    }
]);

angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
}]).directive('carousel', [function() {
    return {

    }
}]);
