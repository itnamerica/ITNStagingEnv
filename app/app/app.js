var myApp = angular.module('myApp', ['ui.router', 'ngAnimate','angularUtils.directives.dirPagination']);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  console.log('inside of config block');
  var viewsPath = "views/";
  if (location.host === "localhost:8080"){
    viewsPath = "app/views/";
  };

  $stateProvider
    
      .state('home', {
        url: '/',
        templateUrl: viewsPath + 'home.html'
      })
      .state('become-member', {
        url: '/become-member',
        templateUrl: viewsPath + 'become-member.html'
      })
      .state('community', {
        url: '/community',
        templateUrl: viewsPath + 'community.html'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: viewsPath + 'contact.html'
      })
      .state('donate', {
        url: '/donate',
        templateUrl: viewsPath + 'donate.html'
      })
      .state('faces', {
        url: '/faces-of-our-members',
        templateUrl: viewsPath + 'faces.html'
      })
      .state('family', {
        url: '/family-involvement',
        templateUrl: viewsPath + 'family.html'
      })
      .state('faq', {
        url: '/faq',
        templateUrl: viewsPath + 'faq.html'
      })
      .state('member-app', {
        url: '/member-app',
        templateUrl: viewsPath + 'member-app.html'
      })
      .state('member-programs', {
        url: '/member-programs',
        templateUrl: viewsPath + 'member-programs.html'
      })
      .state('news', {
        url: '/news',
        templateUrl: viewsPath + 'news.html'
      })
      .state('non-rider-member', {
        url: '/non-rider-member',
        templateUrl: viewsPath + 'non-rider-member.html'
      })
      .state('organization', {
        url: '/organization',
        templateUrl: viewsPath + 'organization.html'
      })
      .state('pay-online', {
        url: '/pay-online',
        templateUrl: viewsPath + 'pay-online.html'
      })
      .state('rider-stories', {
        url: '/rider-stories',
        templateUrl: viewsPath + 'rider-stories.html'
      })
      .state('what-we-do', {
        url: '/what-we-do',
        templateUrl: viewsPath + 'what-we-do.html'
      })
      .state('corporate', {
        url: '/corporate',
        templateUrl: viewsPath + 'corporate.html'
      })
      .state('volunteer-to-drive', {
        url: '/volunteer-to-drive',
        templateUrl: viewsPath + 'volunteer-to-drive.html'
      })
      .state('volunteer-app', {
        url: '/volunteer-app',
        templateUrl: viewsPath + 'volunteer-app.html'
      })
      .state('newsletters', {
        url: '/newsletters',
        templateUrl: viewsPath + 'newsletters.html',
        params: {
          anchor: null
        }
      })
      .state('add-pta-credit', {
        url: '/add-pta-credit',
        templateUrl: viewsPath + 'add-pta-credit.html'
      })
      .state('services-map', {
        url: '/services-map',
        templateUrl: viewsPath + 'services-map.html'
      })
      .state('keyword-pages', {
        url: '/keyword-pages',
        templateUrl: viewsPath + 'keyword-pages.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: viewsPath + 'login.html'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: viewsPath + 'dashboard.html'
      })
      .state('view-form', {
        url: '/view-form',
        templateUrl: viewsPath + 'view-form.html',
        params: {
          formObj: null,
          formType: null
        }
      })
      .state('wildcard', {
        url: '/*',
        templateUrl: viewsPath + 'home.html'
      })
      .state('draft', {
        url: '/draft',
        templateUrl: viewsPath + 'draft.html'
      })

  // default fall back route
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true).hashPrefix('');

})



  myApp.run(['$rootScope', '$location', '$window', '$state', '$stateParams', 
    function($rootScope, $location, $window, $state, $stateParams) {      
      $rootScope.$on('$routeChangeSuccess',
        function(event) {
          if (!$window.ga) {
            return;
          }
          $window.ga('send', 'pageview', {
            page: $location.path()
          });
        });
    }
  ]);

myApp.controller('MainController', ['$scope', '$transitions','$http', '$anchorScroll', '$location', '$stateParams', '$timeout', '$state', '$rootScope', '$window', 'FormService', function ($scope, $transitions, $http, $anchorScroll, $location, $stateParams, $timeout, $state, $rootScope, $window, FormService)  {
  console.log('inside main controller');

  $scope.assetsPath = "assets";
  $scope.viewsPath = "../views";
  
  if (location.host === "localhost:8080"){
    console.log("localhost server, staging env");
    $scope.assetsPath = "app/assets";
    $scope.viewsPath = "../app/views";
  };
  
  $scope.affiliate = "Lanier";
  $scope.zoomLevel = 1;
  $scope.tab = 1;
  $scope.loading = false;
  $scope.minlength = 2;
  $scope.maxlength = 50;
  $scope.maxMsgLength = 2000;
  $scope.ssnPattern = new RegExp(/^\d{3}-?\d{2}-?\d{4}$/);
  $scope.zipPattern = new RegExp(/^\d{5}$/);
  $scope.emailPattern = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
  $scope.datePattern = new RegExp(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  $scope.dobPattern = new RegExp(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  $scope.phonePattern = new RegExp(/^\d{3}[- ]?\d{3}[- ]?\d{4}$/);
  $scope.errorMessages = {
    required: "This field is required",
    minlength: "This field needs to be at least 2 characters long",
    maxlength: "This field needs to be at most 30 characters long",
    phone: "Please match pattern [+91-036-78658 || 91-036-78658]",
    zip: "The zipcode should be be 5 digits long",
    email: "The email should have the format: test@example.com",
    emailConfirmation: "The email confirmation field should match the email field",
    date: "The date should have the format: MM/DD/YYYY",
    dob: "The date of birth should have the format: MM/DD/YYYY",
    phone: "The phone number should have the format: 111-111-1111",
    ssn: "The driver license number should have the format: 123-45-6789",
    mismatchName: "This value does not match the name you entered above",
    mismatchSignature: "This value does not match the name the signature you entered above",
    mismatchDate: "This value does not match the date you entered above"
  };
  $scope.dataPDF = null;
  $scope.formSubject = 'New application received';
  $scope.states = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  $scope.itnSources = ['Family','Friend','Speaker','Doctor','Radio','Television','Flier','Book','Phone','Agency on Aging', 'Social Worker','Internet','Referred by Current Member'];
  $scope.ratings = ['None',1,2,3,4,5,6];
  $scope.keyword = '';
  $scope.keywordPages = '';
  $scope.urlsWithKeyword = [];
  $scope.listOfUrls = [
    {name: 'Home', state: 'home', url: $scope.viewsPath + '/home.html'},
    {name: 'What We Do', state: 'what-we-do', url: $scope.viewsPath + '/what-we-do.html'},
    {name: 'Our Organization', state: 'organization', url: $scope.viewsPath + '/organization.html'},
    {name: 'Faces of our Members', state: 'faces', url: $scope.viewsPath + '/faces.html'},
    {name: 'FAQ', state: 'faq', url: $scope.viewsPath + '/faq.html'},
    {name: 'News', state: 'news', url: $scope.viewsPath + '/news.html'},
    {name: 'Contact Us', state: 'contact', url: $scope.viewsPath + '/contact.html'},
    {name: 'Become a Member', state: 'become-member', url: $scope.viewsPath + '/become-member.html'},
    {name: 'Online Membership Application', state: 'member-app', url: $scope.viewsPath + '/member-app.html'},
    {name: 'Volunteer To Drive', state: 'volunteer-to-drive', url: $scope.viewsPath + '/volunteer-to-drive.html'},
    {name: 'Online Volunteer Application', state: 'volunteer-app', url: $scope.viewsPath + '/volunteer-app.html'},
    {name: 'Family Involvement', state: 'family', url: $scope.viewsPath + '/family.html'},
    {name: 'Member Programs', state: 'member-programs', url: $scope.viewsPath + '/member-programs.html'},
    {name: 'Pay Online', state: 'pay-online', url: $scope.viewsPath + '/pay-online.html'},
    {name: 'Donate', state: 'donate', url: $scope.viewsPath + '/donate.html'},
    {name: 'Corporate Partnership', state: 'corporate', url: $scope.viewsPath + '/corporate.html'}
  ];
    $scope.formType = '';
    $scope.memberFormData = [];
    $scope.volunteerFormData = [];
    $scope.nonRiderFormData = [];
    $scope.contactFormData = [];
    $scope.newsletterFormData = [];
    $scope.formObj = {};
    $scope.formObjType = {};
    $scope.session = null;
    console.log('session is ', $scope.session);
    $scope.formCount = {
      member: 0,
      volunteer: 0,
      nonrider: 0,
      contact: 0,
      newsletter: 0
    };
    $scope.pdfUrl = '';
    $scope.formData = {
      requestDriverRecord: {
        signature: null,
        date: null,
        name: null,
        dob: null,
        agree: null,
        authorize: null,
        licenseNumber: null
      },
      requestCriminalRecord: {
        signature: null,
        date: null,
        name: null,
        dob: null,
        agree: null,
        authorize: null,
        licenseNumber: null
      },
      vehicleDescription: {
        signature: null,
        date: null,
        agent: null,
        agentEmailAddress: null,
        authorize: null,
        canTransportPets: null,
        canTransportWalker: null,
        canTransportWheelChair: null,
        generalCondition: null,
        hasCoveredTruckBed: null,
        hasLargeTrunk: null,
        insuranceCompany: null,
        make: null,
        model: null,
        numberOfDoors: null,
        onlyVehicle: null,
        passengerCapacity: null,
        registrationExpiration: null,
        registrationPlate: null
      },
      changeOfStatus: {
        signature: null,
        date: null
      },
      drivingExperience: {
        adequateVision: null
      },
      firstEmergencyContact: {
        city: null,
        email: null,
        name: null,
        preferredPhone: null,
        relationship: null,
        state: null,
        street: null,
        zip: null
      },
      firstReference: {
        acquainted: null,
        phoneOrMailing: null,
        name: null
      },
      references: {
        signature: null,
        date: null
      },
      secondReference: {
        acquainted: null,
        phoneOrMailing: null,
        name: null
      },
      thirdReference: {
        acquainted: null,
        phoneOrMailing: null,
        name: null
      },
    };
var originalFormData = $scope.formData;

  

  $transitions.onSuccess({}, function(transition){
      $scope.resetFormData();
      if (transition.from().name === 'keyword-pages'){
        angular.element(document).ready(function () {
          $scope.searchKeyword();
          $scope.scrollToTop();
          $scope.urlsWithKeyword = [];
          // $scope.keyword = '';
        });
      }
      if (!$stateParams.anchor) {
        $scope.scrollToTop();
      }
  });
  
  //use this function instead of ng-href as ng-href is not compatible with html5mode
  $scope.redirectToURL = function(url){
    $window.open(url, '_blank');
  }
  
  $scope.scrollTo = function(id) {
    var old = $location.hash();
    $location.hash(id);
    $anchorScroll();
    //reset to old to keep any additional routing logic from kicking in
    $location.hash(old);
  };
  
  $scope.catchAnchor = function(){
    console.log('stateparam is ', $stateParams, $stateParams.anchor);
    $scope.scrollTo($stateParams.anchor);
  }
  
  $scope.resetFormData = function(){
      $scope.formData = originalFormData;
      $scope.serverMessage = "";
      $scope.loading = false;
      $scope.tab = 1;
    }

  $scope.nextTabMemberApp = function(prev){
    $(window).scrollTop(50);
    if (prev) {
      $scope.tab -= 1;
    } else {
      $scope.tab += 1;
    }
  }
  
  $scope.scrollToTop = function(){
    $(window).scrollTop(50);
  }
  
  $scope.readMore = function(divId) {
    var content = document.getElementById(divId);
    if (content.style.display === "none") {
        content.style.display = "block";
        content.nextElementSibling.nextElementSibling.nextElementSibling.innerText = "READ LESS";
    } else {
        content.style.display = "none";
        content.nextElementSibling.nextElementSibling.nextElementSibling.innerText = "READ MORE";
    }
  }
  
  $scope.zoom = function(direction) {
    if (direction == 'more') {
      $scope.zoomLevel += 1;
      var content = document.getElementByTagName(body);
      content.style.fontSize = $scope.zoomLevel + 'rem';
    }
    else if (direction == 'less') {
      $scope.zoomLevel -= 1;
    }    
  }

  $scope.searchKeyword = function(){
    var myHilitor = new Hilitor("main-content");
    myHilitor.apply($scope.keyword);
  }
  
  $scope.searchKeywordInApp = function(){
    var x;
    for (x=0; x < $scope.listOfUrls.length; x++){
      apiCallToUrls(x)
    }
    $state.go('keyword-pages');
  }
  
  function apiCallToUrls(x){
    $http.get($scope.listOfUrls[x].url)
    .then(function(data){
      var matchWord = findWord($scope.keyword, data.data);
      if (matchWord){
        $scope.urlsWithKeyword.push($scope.listOfUrls[x])
      }
    })
  }
  
  function findWord(keyword, str) {
    var text = str.split(' ');
    for (var word=0; word < text.length; word++){
      if (text[word].toLowerCase().indexOf(keyword.toLowerCase()) !== -1 ){
        return keyword
      }
    }
    return false;
  }
  
  $scope.animateValue = function(id, start, end, duration)  {
    var range = end - start;
    var current = start;
    var increment = end > start? 50 : -50;
    var stepTime = Math.abs(Math.floor(duration / range));
    var obj = document.getElementById(id);
    var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current >= end) {
            clearInterval(timer);
            obj.innerHTML = end;
        }
    }, stepTime);
  };
  
  var zoomLevel = 1;
  $scope.resizeText = function(multiplier) {
    if (multiplier){
      zoomLevel += multiplier;
      $('#main-content-inner').css('transform','scale(' + zoomLevel + ')');
    } else {
      $('#main-content-inner').css('transform','scale(1)');
    }    
  };
  
  $scope.searchTable = function(tableId) {
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById(tableId);
    tr = table.getElementsByTagName("tr");
    
    for (row = 0; row < tr.length; row++) {
      tdd = tr[row].getElementsByTagName("td");
      for (col = 0; col < tdd.length-1; col++) {
        td = tr[row].getElementsByTagName("td")[col];
        if (td) {
          if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
            return tr[row].style.display = "table-row";
          } else {
            tr[row].style.display = "none";
          }
        } 
      }
    }
  };
  
  $scope.resetTable = function(tableId) {
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById(tableId);
    tr = table.getElementsByTagName("tr");
    
    for (row = 0; row < tr.length; row++) {
      tr[row].style.display = "table-row";
    }
  };
  
  $scope.base64ToPDF = function(formType, formObj){
    console.log('inside base64 func');
    if (formObj && formObj.pdf){
      var base64 = formObj.pdf;
      base64 = base64.replace("data:application/pdf;base64,", "");
      var binaryImg = window.atob(base64);
      var length = binaryImg.length;
      var arrayBuffer = new ArrayBuffer(length);
      var uintArray = new Uint8Array(arrayBuffer);

      for (var i = 0; i < length; i++) {
      uintArray[i] = binaryImg.charCodeAt(i);
      }
      var currentBlob = new Blob([uintArray], {type: 'application/pdf'});
      $scope.pdfUrl = URL.createObjectURL(currentBlob);
      // $("#output").append($("<a/>").attr({href: $scope.pdfUrl}).append("Download"));
      // $scope.redirectToURL($scope.pdfUrl);
      window.location.href = $scope.pdfUrl;
    }
    else {
      return $scope.pdfUrl = "This form does not contain a PDF";
    }

  };
  
  $scope.authenticate = function(){
    if ($scope.session){
      $scope.getApps();
    }
  };

  $scope.getApps = function(){
    FormService.getMemberForms().then(function(data){
      $scope.memberFormData = data;
      $scope.formCount.member = data.length
    });
    FormService.getVolunteerForms().then(function(data){
      $scope.volunteerFormData = data;
      $scope.formCount.volunteer = data.length
    });
    FormService.getNonRiderForms().then(function(data){
      $scope.nonRiderFormData = data;
      $scope.formCount.nonrider = data.length
    });
    FormService.getContactForms().then(function(data){
      $scope.contactFormData = data;
      $scope.formCount.contact = data.length
    });
    FormService.getNewsletterForms().then(function(data){
      $scope.newsletterFormData = data;
      $scope.formCount.newsletter = data.length
    });
  };
  
  $scope.catchFormObj = function(){
    $scope.formObj = $stateParams.formObj;
    $scope.formObjType = $stateParams.formType;
    console.log('formobj is ', $scope.formObj);
  };
  
  $scope.deleteForm = function(formType, formObj){
    FormService.deleteForm(formType, formObj).then(function(data){
      console.log('record successfully deleted ', data);
      $scope.getApps();
    })
  };
  
  $scope.sort = function(keyname){
    $scope.sortKey = keyname;   //set the sortKey to the param passed
    $scope.reverse = !$scope.reverse; //if true make it false and vice versa
};

  $scope.login = function(){
    FormService.login($scope.formData).then(function(data){
      console.log('response is ', data);
      if (data){
        $scope.session = data;
        $state.go('dashboard')
      } else {
        $scope.serverMessage = 'Incorrect login or password';
      }
    });
  };
  
  $scope.logout = function(){
    $window.location.reload();
  };
  
  $scope.prepopulate = function(currentModel, modelType){
    if (modelType === 'date'){
      $scope.formData.requestDriverRecord.date = currentModel;
      $scope.formData.requestCriminalRecord.date = currentModel;
      $scope.formData.vehicleDescription.date = currentModel;
      $scope.formData.changeOfStatus.date = currentModel;
    } else if (modelType === 'signature'){
      $scope.formData.requestDriverRecord.signature = currentModel;
      $scope.formData.requestCriminalRecord.signature = currentModel;
      $scope.formData.vehicleDescription.signature = currentModel;
      $scope.formData.changeOfStatus.signature = currentModel;
    } else if (modelType === 'name'){
      $scope.formData.requestDriverRecord.name = currentModel;
      $scope.formData.requestCriminalRecord.name = currentModel;
    } else if (modelType === 'dob'){
      $scope.formData.requestCriminalRecord.dob = currentModel;
    } else if (modelType === 'maiden'){
      $scope.formData.requestCriminalRecord.maidenName = currentModel;
    }
};

$scope.checkRequiredFields = function(formType){
  console.log('inside check required');
  var requiredFieldsArray;
  if (formType === 'volunteer'){
    requiredFieldsArray = [$scope.formData.memberFor , $scope.formData.riderName , $scope.formData.riderGender , $scope.formData.streetAddress , $scope.formData.city , $scope.formData.state , $scope.formData.zip , $scope.formData.preferredPhone , $scope.formData.firstEmergencyContact, $scope.formData.changeOfStatus, $scope.formData.drivingExperience, $scope.formData.firstReference, $scope.formData.secondReference, $scope.formData.thirdReference, $scope.formData.references, $scope.formData.requestDriverRecord, $scope.formData.requestCriminalRecord, $scope.formData.vehicleDescription, $scope.formData.firstEmergencyContact.name , $scope.formData.firstEmergencyContact.relationship , $scope.formData.firstEmergencyContact.street , $scope.formData.firstEmergencyContact.city , $scope.formData.firstEmergencyContact.state , $scope.formData.firstEmergencyContact.zip , $scope.formData.drivingExperience.adequateVision , $scope.formData.drivingExperience.currentEmployment , $scope.formData.criminalConviction , $scope.formData.movingViolation , $scope.formData.firstReference.name , $scope.formData.firstReference.phoneOrMailing , $scope.formData.firstReference.acquainted , $scope.formData.secondReference.name , $scope.formData.secondReference.phoneOrMailing , $scope.formData.secondReference.acquainted , $scope.formData.thirdReference.name , $scope.formData.thirdReference.phoneOrMailing , $scope.formData.thirdReference.acquainted , $scope.formData.references.signature , $scope.formData.references.date , $scope.formData.memberOfProfessionalOrgOrUnion , $scope.formData.servedInMilitary , $scope.formData.requestDriverRecord.name , $scope.formData.requestDriverRecord.dob , $scope.formData.requestDriverRecord.licenseNumber , $scope.formData.requestDriverRecord.authorize , $scope.formData.requestDriverRecord.signature , $scope.formData.requestDriverRecord.date  , $scope.formData.requestCriminalRecord.name , $scope.formData.requestCriminalRecord.dob , $scope.formData.requestCriminalRecord.licenseNumber , $scope.formData.requestCriminalRecord.authorize , $scope.formData.requestCriminalRecord.signature , $scope.formData.requestCriminalRecord.date , $scope.formData.vehicleDescription.vehicleOWner , $scope.formData.vehicleDescription.make , $scope.formData.vehicleDescription.model , $scope.formData.vehicleDescription.year , $scope.formData.vehicleDescription.registrationPlate , $scope.formData.vehicleDescription.numberOfDoors , $scope.formData.vehicleDescription.registrationExpiration , $scope.formData.vehicleDescription.insuranceCompany , $scope.formData.vehicleDescription.agent , $scope.formData.vehicleDescription.agentEmailAddress , $scope.formData.vehicleDescription.canTransportWalker , $scope.formData.vehicleDescription.canTransportWheelChair , $scope.formData.vehicleDescription.generalCondition , $scope.formData.vehicleDescription.passengerCapacity , $scope.formData.vehicleDescription.canTransportPets , $scope.formData.vehicleDescription.hasLargeTrunk , $scope.formData.vehicleDescription.hasCoveredTruckBed , $scope.formData.vehicleDescription.onlyVehicle , $scope.formData.vehicleDescription.signature , $scope.formData.vehicleDescription.date , $scope.formData.changeOfStatus.signature , $scope.formData.changeOfStatus.date , $scope.formData.agree , $scope.formData.requestDriverRecord.agree , $scope.formData.requestDriverRecord.authorize , $scope.formData.requestCriminalRecord.agree , $scope.formData.requestCriminalRecord.authorize , $scope.formData.vehicleDescription.authorize];
  } else if (formType === 'membership'){
    requiredFieldsArray = [$scope.formData.memberFor , $scope.formData.riderName , $scope.formData.membership , $scope.formData.streetAddress, $scope.formData.city , $scope.formData.state , $scope.formData.zip , $scope.formData.yearsAtAddress , $scope.formData.isMailingAddress, $scope.formData.isBillingAddress , $scope.formData.isYearRoundResidence , $scope.formData.primaryPhone , $scope.formData.yearsAtAddress , $scope.formData.isMailingAddress, $scope.formData.firstEmergencyContact.name , $scope.formData.firstEmergencyContact.relationship , $scope.formData.firstEmergencyContact.street , $scope.formData.firstEmergencyContact.city , $scope.formData.firstEmergencyContact.state , $scope.formData.firstEmergencyContact.zip, $scope.formData.firstEmergencyContact.bestPhone, $scope.formData.secondEmergencyContact.name , $scope.formData.secondEmergencyContact.relationship , $scope.formData.secondEmergencyContact.street , $scope.formData.secondEmergencyContact.city , $scope.formData.secondEmergencyContact.state , $scope.formData.secondEmergencyContact.zip, $scope.formData.secondEmergencyContact.bestPhone && $scope.formData.heardAboutItn && $scope.formData.sendInfoToRelativeFriendBiz , $scope.formData.customerInfo , $scope.formData.customerInfo.dob , $scope.formData.customerInfo.gender, $scope.formData.customerInfo.maritalStatus , $scope.formData.customerInfo.livingArrangement , $scope.formData.customerInfo.dwellingArrangement , $scope.formData.customerInfo.languages , $scope.formData.customerInfo.currentTransportationMeans, $scope.formData.memberOfProfessionalOrgOrUnion , $scope.formData.servedInMilitary, $scope.formData.customerInfo.specialNeeds, $scope.formData.drivingInfo, $scope.formData.drivingInfo.hasLicense, $scope.formData.drivingInfo.ownVehicle, $scope.formData.drivingInfo.driverImprovementClasses, $scope.formData.drivingInfo.drivenLast10Years, $scope.formData.drivingInfo.currentlyDrive, $scope.formData.drivingInfo.reduceCostWithRideshare, $scope.formData.agreement, $scope.formData.agreement.signature1, $scope.formData.agreement.date1, $scope.formData.agree1, $scope.formData.agreement.signature2, $scope.formData.agreement.date2, $scope.formData.agree2];
  } else {
    return true;
  }
  
  for (var field=0; field < requiredFieldsArray.length; field++ ){
    console.log(requiredFieldsArray[field]);
    if (!requiredFieldsArray[field]){
      console.log('this element wasnt validated', field);
      return false;
    } 
  }
  return true;
};


  //for contact and newsletter forms
  $scope.submitForm = function(formType){
    var objLength = Object.keys($scope.formData).length;
    var formObj = {};
    $scope.formType = formType;
    $scope.loading = true;
    if (formType === 'contact' && objLength === 5){
      console.log('submitting valid contact form');
      formObj = {
        from: '"ITNStagingEnv Web User" <donotreply@itnamerica.com>',
        to: 'itnamerica2018@gmail.com',
        subject: "ITNStagingEnv Contact Form Submitted",
        text: $scope.formData,
        html: "<p><strong>Name:</strong>: " + $scope.formData.name + "</p>\n" +
        "<p><strong>Email:</strong>: " + $scope.formData.email + "</p>\n " +
        "<p><strong>Mobile:</strong>: " + $scope.formData.phone + "</p>\n " +
        "<p><strong>Subject:</strong>: " + $scope.formData.subject + "</p>\n " +
        "<p><strong>Message Body:</strong>: " + $scope.formData.messageBody + "</p>\n ",
        formType: $scope.formType
      }
    } else if (formType === 'newsletter' && objLength === 1){
      console.log('submitting valid newsletter form');
        formObj = {
          from: '"ITNStagingEnv Web User" <donotreply@itnamerica.com>',
          to: 'itnamerica2018@gmail.com',
          subject: "ITNStagingEnv Request to be added to Newsletter",
          text: $scope.formData,
          html: "<p><strong>Email:</strong>: " + $scope.formData.email + "</p> ",
          formType: $scope.formType
        }
    } else {
      return $scope.serverMessage = "Please reload the page and fill in all required fields before submitting."
    }
    $http.post('/sendmail', formObj)
      .then(function(res){
        $scope.loading = false;
        $scope.serverMessage = 'Your form was submitted successfully. You should hear back from us soon.';
    }).catch(function(err){
        $scope.loading = false;
        $scope.serverMessage = 'There was an error submitting your form. Please contact us by phone instead.';
    });
  };
  

  
  //for membership, volunteer and non-rider forms
  $scope.submitFormWithPDF = function(formType){
    console.log('submitForm PDF, formData is ', $scope.formData);
    $scope.formType = formType;
    var volunteerRequiredComplete = $scope.checkRequiredFields(formType);
    console.log('volunteerRequiredComplete is ', volunteerRequiredComplete);
    if (!(Object.keys($scope.formData).length === 0 && $scope.formData.constructor === Object)) {
      $scope.loading = true;
      //check for validations
      if (!volunteerRequiredComplete){
        $scope.loading = false;
        return $scope.serverMessage = 'Please complete all required fields.';
      }
      
      if (formType === 'membership' || formType === 'volunteer') {
        $(document).ready(function(){
          $('#pdfVersion').css('display', 'block');
        })
        $scope.formSubject = 'ITNStagingEnv - New ' + formType + ' application received';
        $scope.generateMultiPagePDF();
      } else if (formType === 'nonrider') {
          $scope.formSubject = 'ITNStagingEnv - Non-Rider application Form submitted';
          $scope.generatePDF();
      } 
    } else {
      $scope.loading = false;
      $scope.serverMessage = 'You cannot submit an empty form';
    }
  };
  
  
  $scope.generatePDF = function() {
    console.log('inside pdf');
    kendo.drawing.drawDOM($("#formConfirmation"))
      .then(function (group) {
          return kendo.drawing.exportPDF(group, {
              paperSize: "auto",
              margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
          });
      })
      .done(function (data) {
        console.log('data is ', data);
        $scope.dataPDF = data;
        $http.post('/sendmail', {
          from: '"ITNLanier Web User" <donotreply@itnamerica.com>',
          to: 'itnamerica2018@gmail.com',
          subject: $scope.formSubject,
          text: $scope.formData,
          pdf: $scope.dataPDF,
          formType: $scope.formType
        }).then(function(res){
            $scope.loading = false;
            $scope.serverMessage = 'Your form was submitted successfully. You should hear back from us soon.';
        }).catch(function(err){
          $scope.loading = false;
          $scope.serverMessage = 'There was an error submitting your form. Please contact us, or consider submitting your form by paper instead.';
        });
      });
  }

  $scope.generateMultiPagePDF = function() {
    console.log('inside multipage');
    kendo.drawing.drawDOM($("#pdfVersion"), {
          paperSize: "A4",
          margin: { left: "3cm", top: "1cm", right: "1cm", bottom: "1cm" },
          template: $("#page-template").html()
      }).then(function (group) {
          return kendo.drawing.exportPDF(group);
      })
      .done(function (data) {
        console.log('data is ', data);
        $scope.dataPDF = data;
        $http.post('/sendmail', {
          from: '"ITNLanier Web User" <donotreply@itnamerica.com>',
          to: 'itnamerica2018@gmail.com',
          subject: $scope.formSubject,
          text: $scope.formData,
          pdf: $scope.dataPDF,
          formType: $scope.formType
        }).then(function(res){
            $scope.loading = false;
            $scope.serverMessage = 'Your form was submitted successfully. You should hear back from us soon.';
        }).catch(function(err){
          $scope.loading = false;
          $scope.serverMessage = 'There was an error submitting your form. Please contact us, or consider submitting your form by paper instead.';
        });
      });
  }
  
}]);


myApp.directive('match', function($parse) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrl) {
      scope.$watch(function() {        
        return $parse(attrs.match)(scope) === ctrl.$modelValue;
      }, function(currentValue) {
        ctrl.$setValidity('mismatch', currentValue);
      });
    }
  };
});

myApp.filter('inputSelected', function(){
  return function(formData){
    var keyArr = [];
    var word = [];
    if (formData){
      Object.keys(formData).forEach(function(key){
      if (formData[key]){
      	var keyCap = key.charAt(0).toUpperCase() + key.slice(1);
        for (var char = 0; char<keyCap.length; char++ ) {
        	if (keyCap[char] == keyCap[char].toUpperCase()){
            var spacedLetter = ' '+ keyCap[char];
            word.push(spacedLetter);
          }
          else {
            word.push(keyCap[char]);
          }
        }
      }
      keyArr.push(word.join(''))
      word = [];
      })
      return keyArr.toString();
    }
  }
});

myApp.filter('filterLongObj', function($filter){
  return function(formObj){
    if (Object.keys(formObj).length > 1 && formObj.constructor === Object){
      var pretty = JSON.stringify(formObj).replace(/{|}|"/g, "");
      return pretty;
    } else if (formObj.constructor === Object){
      return $filter('inputSelected')(formObj);
    } else {
      return formObj;
    }
  }
});


myApp.filter('timestamp', function(){
  return function(formObj){
    var timestamp = formObj._id.toString().substring(0,8);
    var date = new Date( parseInt( timestamp, 16 ) * 1000 );
    return date;
  }
});

myApp.filter('tableToFormName', function(){
  return function(tableName){
    if (tableName === 'memberapp'){return 'Membership'}
    else if (tableName === 'volunteerapp'){return 'Volunteer'}
    else if (tableName === 'nonriderapp'){return 'Non-Rider'}
    else if (tableName === 'contactform'){return 'Contact'}
    else {return 'Other'}
  }
});


myApp.service('FormService', function($http){
  this.getMemberForms = function(){
    return $http.get('/getMemberApps').then(function(data){
      console.log('data is ', data);
      return data.data;
    }) 
  };
  this.getVolunteerForms = function(){
    return $http.get('/getVolunteerApps').then(function(data){
      console.log('data is ', data);
      return data.data;
    }) 
  };
  this.getNonRiderForms = function(){
    return $http.get('/getNonRiderApps').then(function(data){
      console.log('data is ', data);
      return data.data;
    }) 
  };
  this.getContactForms = function(){
    return $http.get('/getContactForms').then(function(data){
      console.log('data is ', data);
      return data.data;
    }) 
  };
  this.getNewsletterForms = function(){
    return $http.get('/getNewsletterForms').then(function(data){
      console.log('data is ', data);
      return data.data;
    }) 
  };
  this.deleteForm = function(formType, formObj){
    return $http.delete('/deleteForm/' + formObj._id, {params: {formType:formType}}).then(function(data){
      return data;
    }) 
  }
  this.login = function(formData){
    return $http.get('/getAdmin', {params: {formData:formData}})
    .then(function(data){
      console.log('response in service is ', data);
      return data;
    }).catch(function(error){
      console.log('service, unable to login', error);
    }) 
  }
});



myApp.directive('contactForm', function(){
  return {
    restrict: "E",
    templateUrl: "../views/contact-form.html"
  }
})