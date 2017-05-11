'use strict';

angular.module('homebizApp')

.controller('SearchController', ['$scope', '$stateParams', 'bizlistFactory', 'favoriteFactory', function ($scope, $stateParams, bizlistFactory, favoriteFactory) {

    $scope.tab = 1;
    $scope.searchterm = $stateParams.searchTerm;
    $scope.showDetails = false;
    $scope.showFavorites = false;
    $scope.showBizList = false;
    $scope.message = "Loading ...";
   
    
    $scope.searchmessage = "Showing search results for " + $scope.searchterm;
    
    //Used to query all the businesses in the database
    bizlistFactory.query(
        function (response) {
            $scope.bizes = response;
            $scope.showBizList = true;
            console.log($scope.bizes);

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });


    $scope.toggleDetails = function () {
        //Used to toggle the 'Showe details' button
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleFavorites = function () {
        //Used to toggle the 'Show favorites' button
        $scope.showFavorites = !$scope.showFavorites;
    };
    
    $scope.addToFavorites = function(bizid) {
        //Add the biz id and user id to favorites
        favoriteFactory.save({_id: bizid});
        $scope.showFavorites = !$scope.showFavorites;
    };
    
}])

.controller('MyBizListController', ['$scope', '$state', 'mybizlistFactory', 'bizlistFactory', 'ngDialog', function ($scope, $state, mybizlistFactory, bizlistFactory,  ngDialog) {
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showBizList = false;
    $scope.message = "Loading ...";
    
    //Used to query only those businesses started by the logged in user
    mybizlistFactory.query()
        .$promise.then(
            function (response) {
                $scope.bizes = response;
                console.log($scope.bizes);
                $scope.message='Businesses loads successfully';
                $scope.showBizList = true;
                $scope.showDetails = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );     
   
    //Used to open the dialog box used to open the business 
    $scope.openNewBusiness = function () {
        ngDialog.open({ template: 'views/registerBusiness.html', scope: $scope, className: 'ngdialog-theme-default', controller:"BizCreateController" });
    };
    
    //Used to toggle the 'Showe details' buttin
    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };
    
    
    $scope.deleteBiz = function(bizid) {
        //Opens a dialog box asking the user if he or she is sure to delete the business 
        ngDialog.openConfirm({
                    template:
                        '<p>Are you sure you want to delete this business ?</p>' +
                        '<div>' +
                          '<button type="button" class="btn btn-default" ng-click="closeThisDialog(0)">No&nbsp;' +
                          '<button type="button" class="btn btn-orange" ng-click="confirm(1)">Yes' +
                        '</button></div>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                }).then(function (value) {
                    // perform delete operation
                    bizlistFactory.delete({id: bizid});
                    $state.go($state.current, {}, {reload: true});
                }, function (value) {
                    console.log("Did not perform delete");
                });
    };
    
}])


                                    
.controller('ContactController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
}])

.controller('BizDetailController', ['$scope', '$state', '$stateParams', 'bizlistFactory', 'reviewFactory', function ($scope, $state, $stateParams, bizlistFactory, reviewFactory) {

    $scope.biz = {};
    $scope.showBiz = false;
    $scope.message = "Loading ...";
    
    //Used to query with the biz id passed throgh Stateparams 
    $scope.biz = bizlistFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.biz = response;
                $scope.showBiz = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.myreview = {
        rating: 5,
        review: ""
    };

    $scope.submitReview = function () {

        reviewFactory.save({id: $stateParams.id}, $scope.myreview);

        $state.go($state.current, {}, {reload: true});
        
        $scope.reviewForm.$setPristine();

        $scope.myreview = {
            rating: 5,
            review: ""
        };
    }
}])


.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function ($scope, $state, favoriteFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showBizList = false;
    $scope.message = "Loading ...";

    //Used to query all the favorites associated with the logged in user 
    favoriteFactory.query(
        function (response) {
            $scope.bizes = response[0].bizes;
            $scope.showBizList = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    //Used to toggle the 'Show details' button
    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    //Used to toggle the 'Show delete' button
    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };
    
    //Used to delete the biz from the favorite list 
    $scope.deleteFavorite = function(bizid) {
        favoriteFactory.delete({id: bizid});
        $scope.showDelete = !$scope.showDelete;
        $state.go($state.current, {}, {reload: true});
    };
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    
}])


.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        //console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])

.controller('BizCreateController', ['$scope', '$state', 'ngDialog', '$resource', 'bizlistFactory', function ($scope, $state, ngDialog, $resource, bizlistFactory) {
    
    $scope.biz = {};
    $scope.showBiz = false;
    $scope.message = "Loading ...";
    
    
    $scope.newBusiness = {
            username:"",
            pasword:"",
            name:"",
            image:"",
            category:"",
            label:"",
            description:"",
            featured:"",
            zipcode:"",
            servingradius:""
        };
    
    $scope.createBusiness = function () {
        console.log("Image file has " + $scope.newBusiness.image);
        //Adding a default image to the business for now 
        $scope.newBusiness.image = "images\\logo.jpg";
        bizlistFactory.save($scope.newBusiness)
        .$promise.then(
            function(response) {
                
                console.log('Businesses created successfully');
                //$scope.showBizList = true;
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            }
        );
      $state.go($state.current, {}, {reload: true});
      ngDialog.close();
    };
    
    $scope.openFileUpload = function() {
        //Have not added the upload functionality yet.  Will add it soon. 
        ngDialog.open({ template: 'views/uploadFile.html', scope: $scope, className: 'ngdialog-theme-default' });
    };
}])

;