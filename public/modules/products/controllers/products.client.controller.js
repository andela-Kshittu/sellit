'use strict';
var app = angular.module('products');
// Products controller
app.controller('ProductsController', ['$scope', '$stateParams', '$timeout' , '$http', '$location', 'Authentication','Products', '$upload', 'Prods',
    function($scope, $stateParams, $timeout , $http, $location, Authentication, Products, $upload, Prods){
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
  //        $scope.closeAlert = function() { 
  // };
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
                    photo: $scope.uploadResult
                });

product.$save(function(response) {
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
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });


 };
$scope.onFileSelect = function($files) {
$scope.files = $files;
$scope.imageFiles = [];
$scope.uploadResult = [];
if($scope.files) {
for (var i in $scope.files) {
if($scope.files[i].type === 'image/jpeg' || $scope.files[i].type === 'image/png' || $scope.files[i].size < 600000) {
$scope.correctFormat = true;
} else {
alert('error');
alert('Wrong file format...')
$scope.correctFormat = false;
}
$scope.start(i);

}
}
};

$scope.start = function(indexOftheFile) {
$scope.loading = true;
var formData = {
key: $scope.files[indexOftheFile].name,
AWSAccessKeyID: 'AKIAIWGDKQ33PXY36LQA',
acl: 'private',
policy: 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImtlaGVzamF5In0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRrZXkiLCAiIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiIl0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRmaWxlbmFtZSIsICIiXSwKICAgIFsiY29udGVudC1sZW5ndGgtcmFuZ2UiLCAwLCA1MjQyODgwMDBdCiAgXQp9',
signature: 'PLzajm+JQ9bf/rv9lZJzChPwiBc=',
filename: $scope.files[indexOftheFile].name,
'Content-Type':$scope.files[indexOftheFile].type
};
            
$scope.imageFiles[indexOftheFile] = $upload.upload({
                url: 'https://kehesjay.s3-us-west-2.amazonaws.com/',
                method: 'POST',
                headers: {
                    'Content-Type':$scope.files[indexOftheFile].type
                },
                data: formData,
                file: $scope.files[indexOftheFile]
            });
$scope.imageFiles[indexOftheFile].then(function(response) {
                $timeout(function() {
                    $scope.loading = false;
                    //alert('uploaded');
                    var imageUrl = 'https://kehesjay.s3-us-west-2.amazonaws.com/' + $scope.files[indexOftheFile].name;
                    $scope.uploadResult.push(imageUrl);
                });
            }, function(response) {
                console.log(response);
                $scope.loading = false;
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                alert('Connection Timed out');
            }, function(evt) {
                
            });

            console.log($scope.imageFiles[indexOftheFile]);

$scope.imageFiles[indexOftheFile].xhr(function(xhr) {
                //alert('xhr');
            });
            
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
