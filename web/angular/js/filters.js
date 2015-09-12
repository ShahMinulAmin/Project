
angular.module('te.filters', [])

    .filter('lowercase', function() {
        return function(str) {
            return str.toLowerCase();
        };
    })

    .filter('uppercase', function() {
        return function(str) {
            return str.toUpperCase();
        };
    });