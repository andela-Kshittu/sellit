'use strict';

var app = angular.module('products');

app.factory('Prods',['$http',function($http){
	var o = {
		prods:[]
	};
o.like = function(product) {
  return $http.put('/products/' + product._id + '/like')
    .success(function(data){
      product.likes += 1;
      product.likesView = false;
    });};
o.dislike = function(product) {
  return $http.put('/products/' + product._id + '/dislike')
    .success(function(data){
      product.likes -= 1;
      product.likesView = true;
    });};
o.addComment = function(id, comment) {
  return $http.post('/products/' + id + '/comments', comment);
};
o.likeComment = function(product, comment) {
  return $http.put('/products/' + product._id + '/comments/'+ comment._id + '/like')
    .success(function(data){
      comment.likes += 1;
      comment.likesView = false;
    });
};
o.dislikeComment = function(product, comment) {
  return $http.put('/products/' + product._id + '/comments/'+ comment._id + '/dislike')
    .success(function(data){
      comment.likes -= 1;
      comment.likesView = true;
    });
};
  return o;
}]);
// Products controller
app.controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', '$upload','Prods',
	function($scope, $stateParams, $location, Authentication, Products, $upload, Prods ) {
		$scope.authentication = Authentication;

		$scope.categoryList = [{"name":"Phones and Tablets","src": "modules/core/img/server/Temp/img/phones-icons.jpg"},
							   {"name":"Laptops","src": "modules/core/img/server/Temp/img/laptops.jpg"},
							   {"name":"Fashion and Designs","src": "modules/core/img/server/Temp/img/fashion.jpg"},
							   {"name":"Real Estate","src": "modules/core/img/server/Temp/img/house.jpg"},
							   {"name":"Vehicles","src": "modules/core/img/server/Temp/img/vehicles.jpg"},
							   {"name":"Others","src": "modules/core/img/server/Temp/img/others.jpg"}];
        $scope.selectedFile = [];
        $scope.uploadProgress = 0;
        $scope.searchQuery;
        $scope.currentCat = $stateParams.catName;
        $scope.body;
        $scope.author;
        $scope.formShow = false;
        // $scope.prods = Prods.prods;
        $scope.commentForm = function(){
        	$scope.formShow = true;
        };
        $scope.incrementUpvotes = function(product) {
  			Prods.like(product);
		};
		$scope.decrementUpvotes = function(product) {
  			Prods.dislike(product);
		};
		$scope.incrementCommentUpvotes = function(product, comment){
			console.log('fucntion called');
  			Prods.likeComment(product, comment);
		};
		$scope.decrementCommentUpvotes = function(product, comment){
			console.log('fucntion called');
  			Prods.dislikeComment(product, comment);
		};

		$scope.addComment = function(product){
		$scope.formShow = false;
  		if(($scope.body === '')||($scope.author === '')){ return; }
  			Prods.addComment(product._id, {
    		body: $scope.body,
    		author:$scope.author,
  		}).success(function(comment) {
    		// $scope.post.comments.push(comment);
    		$scope.findOne();
  		});
  		$scope.body = '';
  		$scope.author = '';
		};
        // client side comments and likes
        // $scope.comments = Comments.comments;
        // $scope.post;
        // $scope.likeButton = true;
        // $scope.postLikes = 0;
       //  $scope.addComment = function(product, user){
       //  	if($scope.post === '') { return; }
       //  	$scope.comments.push({productID: product, post: $scope.post, like: 0, showlike:true});
       //  	console.log($scope.comments);
       //  	$scope.post="";
       //  };
       // $scope.likePost=function(comment){
       // 		comment.like += 1;
       // 		comment.showlike = false;
       // };
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
app.directive('progressBar', [
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