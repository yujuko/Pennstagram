(function() {
    angular.module('Pennstagram', ['ui.router', 'ngFileUpload'])
        .config(function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('signUp', {
                    url: "/signUp",
                    templateUrl: "app/signup/signup.html",
                    controller: "SignupController"
                })
                .state("editProfile", {
                    url: "/edit-profile",
                    templateUrl: "app/profile/edit-profile-view.html",
                    controller: "EditProfileController"
                })
                .state("feed", {
                    url: "/home",
                    templateUrl: "app/feed/feed.html",
                    controller: "FeedController"
                })
                .state("profile", {
                    url: "/profile",
                    templateUrl: "app/profile/profile-view.html",
                    controller: "ProfileController"
                })
                .state("follow", {
                    url: "/follow-users",
                    templateUrl: "app/follow/follow.html",
                    controller: "FollowController"
                })
                .state("activity", {
                    url: "/activity",
                    templateUrl: "app/activity/activity.html",
                    controller: "ActivityController"
                })


        })
}());