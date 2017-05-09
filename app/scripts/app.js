'use strict';

angular.module('homebizApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
        
            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'                  
                    }
                }
            })
            
            
            // route for the search page
            .state('app.search', {
                url: 'search/:searchTerm',
                views: {
                    'content@': {
                        templateUrl : 'views/search.html',
                        controller  : 'SearchController'
                    }
                }
            })
            
            .state('app.mybizlist', {
                url: 'mybizes',
                views: {
                    'content@': {
                        templateUrl : 'views/mybizlist.html',
                        controller  : 'MyBizListController'
                    }
                }
            })
        
            // route for the bizdetail page
            .state('app.bizdetails', {
                url: 'bizlist/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/bizdetail.html',
                        controller  : 'BizDetailController'
                   }
                }
            })
        
            // route for the bizdetail page
            .state('app.favorites', {
                url: 'favorites',
                views: {
                    'content@': {
                        templateUrl : 'views/favorites.html',
                        controller  : 'FavoriteController'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
