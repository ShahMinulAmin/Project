
angular.module('te.directives', [])

    .directive('unitMenu', function($timeout) {
        return {
            link: function($scope, element, attrs) {
                var id = 0;
                element.find('li').click(function() {
                    id = $(this).attr('id');
                    console.log('id: ' + id);
                    $scope.selectedUnitMenuId = id;
                    element.find('button').text(id+'" Container');
                });
            }
        };
    })

    .directive('termMenu', function($timeout) {
        return {
            link: function($scope, element, attrs) {
                var id = 0;
                element.find('li').click(function() {
                    id = $(this).attr('id');
                    console.log('id: ' + id);
                    $scope.selectedTermMenuId = id;
                    element.find('button').text(id);
                });
            }
        };
    });