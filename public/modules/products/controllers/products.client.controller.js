'use strict';

var app = angular.module('products');

app.factory('Comments',[function(){
	var o = {
		comments:[]
	};
	return o;
}]);
// Products controller
app.controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', '$upload','Comments',
	function($scope, $stateParams, $location, Authentication, Products, $upload, Comments ) {
		$scope.authentication = Authentication;

		$scope.categoryList = [{"name":"Phones and Tablets"},
							   {"name":"Laptops"},
							   {"name":"Fashion and Designs"},
							   {"name":"Real Estate"},
							   {"name":"Vehicles"},
							   {"name":"Others"}];
        $scope.selectedFile = [];
        $scope.uploadProgress = 0;
        $scope.searchQuery;
        $scope.currentCat = $stateParams.catName;
        // client side comments and likes
        $scope.comments = Comments.comments;
        $scope.post;
        // $scope.likeButton = true;
        // $scope.postLikes = 0;
        $scope.addComment = function(product, user){
        	if($scope.post === '') { return; }
        	$scope.comments.push({productID: product, post: $scope.post, like: 0, showlike:true});
        	console.log($scope.comments);
        	$scope.post="";
        };
       $scope.likePost=function(comment){
       		comment.like += 1;
       		comment.showlike = false;
       };
		// Create new Product
		$scope.create = function() {
			// Create new Product object
			var product = new Products ({
				name: this.name,
				description: this.description,
				quantity: this.quantity,
				category: this.category,
				negotiable: this.negotiable,
				cost: this.cost,
				location: this.location,
				phone_number: this.phone_number,
			});


			// // Redirect after save
			// product.$save(function(response) {
				// var files = $scope.selectedFile[0];
                
                $scope.upload = $upload.upload({
                    url: 'products/',
                    method: 'POST',
                    data: product,
                     file: $scope.files[0]
                }).progress(function (evt) {
                    $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
                }).success(function (response) {
                	 
                	//do something
                	$location.path('products/' + response._id);

                	 // Clear form fields
					$scope.name = '';
					$scope.description = '';
					$scope.photo= '';
					$scope.quantity = '';
					$scope.category= '';
					$scope.negotiable = '';
					$scope.cost = '';
					$scope.location = '';
					$scope.phone_number = '';            
                }).error(function(err, response) {		
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
	                  }
	              }
          };
		// Remove existing Product
		$scope.remove = function( product ) {
			if ( product ) { product.$remove();

				for (var i in $scope.products ) {
					if ($scope.products [i] === product ) {
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
			var product = $scope.product ;

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
		// Find a list of Products
		// $scope.seachAll = function() {
		// 	console.log($scope.searchQuery);
		// 	var q = $scope.searchQuery;
		// 	$scope.products = Products.find(name: q);	
		// };
		// Find existing Product
		$scope.findOne = function() {
			$scope.product = Products.get({ 
				productId: $stateParams.productId
			});
		};
		// // Find Products in a category
		// $scope.catProducts = function() {
		// 	$scope.categoryProduct = Categories.get({ 
		// 		catName: $stateParams.catName
		// 	});
		// };
	}
])
.directive('progressBar', [
        function () {
            return {
                link: function ($scope, el, attrs) {
                    $scope.$watch(attrs.progressBar, function (newValue) {
                        el.css('width', newValue.toString() + '%');
                    });
                }
            };
        }
    ]);