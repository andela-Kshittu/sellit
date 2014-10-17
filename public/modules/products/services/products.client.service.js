'use strict';
var app = angular.module('products');
//Products service used to communicate Products REST endpoints
app.factory('Products', ['$resource',
    function($resource) {
        return $resource('products/:productId', {
            productId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
app.factory('Prods', ['$http', function($http) {
    var actions = {
        prods: []
    };
    actions.noSearchData=false;
    actions.like = function(product) {
        return $http.put('/products/' + product._id + '/like')
            .success(function(data) {
                product.likes += 1;
                product.likesView = false;
            });
    };
    actions.dislike = function(product) {
        return $http.put('/products/' + product._id + '/dislike')
            .success(function(data) {
                product.likes -= 1;
                product.likesView = true;
            });
    };
    actions.addComment = function(id, comment) {
        return $http.post('/products/' + id + '/comments', comment);
    };
    actions.likeComment = function(product, comment) {
        return $http.put('/products/' + product._id + '/comments/' + comment._id + '/like')
            .success(function(data) {
                comment.likes += 1;
                comment.likesView = false;
            });
    };
    actions.dislikeComment = function(product, comment) {
        return $http.put('/products/' + product._id + '/comments/' + comment._id + '/dislike')
            .success(function(data) {
                comment.likes -= 1;
                comment.likesView = true;
            });

    };
    return actions;
}]);
