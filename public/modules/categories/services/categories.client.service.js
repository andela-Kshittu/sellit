// 'use strict';

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
