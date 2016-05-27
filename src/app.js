var app = angular.module("myapp", ['ngMaterial', 'md.data.table', 'ngMessages', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

 $stateProvider
  .state('insert', {
   url: '/insert',
   templateUrl: 'template/insert.html',
   controller: 'insertCtrl'
  })
  .state('view', {
   url: '/view',
   templateUrl: 'template/view.html',
   controller: 'viewCtrl'
  })
  .state('dashboard', {
   url: '/',
   templateUrl: 'template/dashboard.html',
   controller: 'dashboardctrl'
  })
  .state('newuser',{
   url:'/newuser',
   templateUrl:'template/adduser.html',
   controller:'newuserctrl'
  })
  .state('viewuser',{
  url:'/viewuser',
  templateUrl:'template/viewuser.html',
  controller:'viewuserctr'
  });
  
$urlRouterProvider.otherwise('/');

});

app.controller('insertCtrl', function($http, $scope, $mdDialog) {

 $scope.send = function() {

  console.log($scope.user);
  $http.post('/insertvcard', JSON.stringify($scope.user)).then(function(res) {

   console.log(res);

   $mdDialog.show(
    $mdDialog.alert()
    .title('Congratulation!')
    .content('New Visiting Card Saved')
    .ariaLabel('Success Alert')
    .ok('Got it!')
   );
  })

 }


});

app.controller('viewCtrl', function($http, $scope, $q, $mdDialog) {
 
 var deferred = $q.defer();
 $scope.promise = deferred.promise;
 $http.get('/vcard').then(function(res) {

  $scope.cards = res.data;

  deferred.resolve();
 })

$scope.delete = function(param) {
  console.log(param);
  var confirm = $mdDialog.confirm()
   .title('Delete this record')
   .textContent('Recod will be deleted permanently.')
   .ariaLabel('Success Alert')
   .ok('Yes')
   .cancel('No');

  $mdDialog.show(confirm).then(function() {
   $http.post('/remove', JSON.stringify(param)).then(function(res) {

    console.log(res);

   });
   $scope.status = 'Record deleted successfully!';
   console.log('DELETED')
  }, function() {
   $scope.status = 'You decided to keep your record.';
   console.log('Not Deleted')

  });

 };
 
$scope.edit = function(param1) {
 
 $scope.user = param1;
 
 $mdDialog.show({
                  clickOutsideToClose: true,
                  scope: $scope,        
                  preserveScope: true,           
                  templateUrl:'template/popup_edit.html',
                  controller: function viewCtrl($scope, $mdDialog) {
                     $scope.closeDialog = function() {
                        $mdDialog.hide();
                     }
                  }
               })
               
 
  
 
}

$scope.update = function(){
 

  console.log($scope.user);
  
  $http.post('/update', JSON.stringify($scope.user)).then(function(res) {
      
      console.log(res);
      
  })
 
}


$scope.cancel = function(){
 
  console.log('CANCEL');
  $scope.closeDialog = function() {
                        $mdDialog.hide();
    }
}


})


app.controller('dashboardctrl', function($http, $scope) {
 
 $http.get('/dashboard').then(function(res) {
  
 $scope.final = res.data;
 console.log(res.data);
  
 })

});


app.controller('newuserctrl', function($http, $scope, $mdDialog) {
 
 
 $scope.addnewuser = function(){
  
  var pass = $scope.newuser.password
  var cnfpass = $scope.newuser.cnfpassword
  var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth()+1; //January is 0!
          var yyyy = today.getFullYear();
          
          if(dd<10) {
              dd='0'+dd
          } 
          
          if(mm<10) {
              mm='0'+mm
          } 
          
  var date = dd+'/'+mm+'/'+yyyy;
  
  $scope.newuser.rdate = date;
  $scope.newuser.lastlogin = '';

  console.log($scope.newuser);
 
  if( pass == cnfpass ) {
   
  $http.post('/newuser', JSON.stringify($scope.newuser)).then(function(res) {

   console.log(res);

   $mdDialog.show(
    $mdDialog.alert()
    .title('Congratulation!')
    .content('New User Added')
    .ariaLabel('Success Alert')
    .ok('Got it!')
   );
  })
  
   
  } 
  
else
   {
   
    $mdDialog.show(
      $mdDialog.alert()
      .title('ERROR!')
      .content('Passwrod Does Not Match')
      .ariaLabel('Success Alert')
      .ok('Got it!'));
   
   }
}

})

app.controller('viewuserctr', function($http, $scope, $q, $mdDialog) {
 
 var deferred = $q.defer();
 $scope.promise = deferred.promise;
 $http.get('/user').then(function(res) {

  $scope.users = res.data;

  deferred.resolve();
  
 })
 
$scope.delete = function(param) {
  console.log(param);
  var confirm = $mdDialog.confirm()
   .title('Delete this record')
   .textContent('Recod will be deleted permanently.')
   .ariaLabel('Success Alert')
   .ok('Yes')
   .cancel('No');

  $mdDialog.show(confirm).then(function() {
   $http.post('/deleteuser', JSON.stringify(param)).then(function(res) {

    console.log(res);

   });
   $scope.status = 'Record deleted successfully!';
   console.log('DELETED')
  }, function() {
   $scope.status = 'You decided to keep your record.';
   console.log('Not Deleted')

  });

 }; 

})