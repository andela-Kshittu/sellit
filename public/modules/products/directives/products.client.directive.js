
'use strict';
var app = angular.module('products');
app.directive('progressBar', [
    function() {
        return {
            link: function($scope, el, attrs) {
                $scope.$watch(attrs.progressBar, function(newValue) {
                    el.css('width', newValue.toString() + '%');
                });
            }
        };
    }
]);