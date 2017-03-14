import * as firebase from 'firebase';
import firebase_link from '../Firebase/Firebase.jsx';
import request from 'request';

let baseRef = firebase.database().ref('users');
let userInfoGlobal;
let allPrograms=[];
let programTitle;
let currentProgram;

export const getCurrentUser = function (callback) {
    let localAccount = localStorage.getItem('currentAccount');
    let accountObject = JSON.parse(localAccount);
    let email = accountObject.email;
    let wasFound = false;
    baseRef.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let key = childSnapshot.key;
            let childData = childSnapshot.val();
            let childEmail = childData.email;
            if (childEmail === email) {
                wasFound = true;
                callback(key);
            }
        });
        //No user was matched so send back null so a new user gets created
        if (wasFound == false) {
            callback(null);
        }
    });
}

//either get current user, or if they don't yet exist, create them
export const getUserData = function (userInfo, callback) { // Looks like synchronous but asynchronous because of baseRef.once asynchronous
    let currentUser = null;
    baseRef.once("value", function (snapshot) { //asynchronous
        var matchFound = false;
        snapshot.forEach(function (childSnapshot) {
            if (matchFound == false) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();

                if (userInfo.id == key) {
                    currentUser = childData;
                    matchFound = true;
                }
            }
        });

        if (matchFound) {
            var userCompany = currentUser.company;
            getPrograms(userCompany, function (enabled) {
                currentUser.enabledPrograms = enabled;
                userInfoGlobal = currentUser;
                callback(currentUser);
            });
        } else if (currentUser == null && matchFound == false) {
            // console.log(request);
            request('https://viven-basic.herokuapp.com/getUser', {
                method: "POST",
                json: userInfo
            },
            function successCallback(error, response){
                // console.log(response);
                userInfo = response.body;
                createUser(userInfo, function () {
                    userInfoGlobal = userInfo;
                    callback(userInfo);
                });
            });
        }
    });
};

export const getPrograms = function (company, callback) {
    // console.log(company);
    let programsRef = baseRef.parent.child('company_programs').child(company);
    programsRef.once("value", function (snapshot) {
        let snapVal = snapshot.val();
        // console.log(snapVal);
        callback(snapVal);
    });
};

const enableWrite = function () {
    // var ref = new Firebase('https://viven-data.firebaseio.com/');
    // ref.authWithCustomToken("rb6z74HpFyZs9rT9Pxu6d2CBcneyXfOt285wMCBq", function (error, result) {
    // });
};


const createUser = function (userInfo, callback) {
    if (userInfo == null) {
        //user was logged out at some point, so redirect to login page

    } else {
        //authenticate for firebase write permission
        enableWrite();

        //set the associated 'company' value to a default for now (this determines which programs a user has access to)
        userInfo.company = "default";

        let initialProgress = {};
        initialProgress.next_action = {
            case: "-JkEYXe6hIrueGO5F25Y",
            program: "Cold and Flu"
        };
        initialProgress.programs = {};
        initialProgress.programs["Cold and Flu"] = {};
        initialProgress.programs["Cold and Flu"].casesCompleted = ["null"];
        initialProgress.programs["Cold and Flu"].isComplete = false;
        userInfo.progress = initialProgress;

        let id = userInfo.id;
        let newUserRef = baseRef.child(id);
        newUserRef.set(userInfo);

        getPrograms(userInfo.company, function (enabled) {
            userInfo.enabledPrograms = enabled;
            callback(userInfo);
        });
    }
};

//get programs that the signed in user has access to
export const getAllowedPrograms = function (programsEnabled) {
    var ref = baseRef.parent.child('sim');
    ref.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var key = childSnapshot.key;
            var childProgram = childSnapshot.val();

            //match child programs to those enabled to the user
            for (var i = 0; i < programsEnabled.length; i++) {
                var programContainer = [];
                programContainer.push(programsEnabled[i]);
                if (programsEnabled[i] === key) {
                    programContainer.push(childProgram);
                    allPrograms.push(programContainer);
                    // console.log(allPrograms);
                }
            }
        });
    });
    // UserService.setAllPrograms($scope.allPrograms);
};

// export function getCurrentProgram(callback) {
//     return currentProgram;
// }

// export function setCurrentProgram(value) {
//     currentProgram = value;
// }

export const loadProgram = function (program, callback) {
    //if program var passed is string... (from next program, not the all programs section)
    // if (typeof program === 'string') {
    //     for (var x = 0; x < $scope.currentUser.enabledPrograms.length; x++) {
    //         if (program == $scope.currentUser.enabledPrograms[x][0]) {
    //             program = $scope.currentUser.enabledPrograms[x];
    //             break;
    //         }
    //     }
    // }

    var programObject = {};
    for (var i = 0; i < allPrograms.length; i++) {
        // console.log(allPrograms[i][0]);
        if (allPrograms[i][0] == program) {
            programObject = allPrograms[i][1];
            break;
        }
    }

    // program.push(programObject);
    callback(programObject);
    // $rootScope.$broadcast('loadCases', program);
    // $scope.programsActive = false;
};

export const getCaseDetails = function (program, caseId, callback) {
    var ref = baseRef.parent.child("sim/" + program + "/" + caseId + "/case");
    ref.once("value", function (snapshot) {
        var caseData = snapshot.val();
        callback(caseData);
    })
};

// export const getProgramPercent = function (callback) {
//     var totalCases;
//     var lastProgram = userInfoGlobal.progress.next_action.program;
//     var ref = baseRef.parent.child('sim/' + lastProgram);
//     ref.once("value", function (snapshot) {

//         //need number of cases not length of array, so subtract 1
//         totalCases = Object.keys(snapshot.val()).length-1;

//         //also need to subtract one here for the same reason
//         var casesCompleted = userInfoGlobal.progress.programs[lastProgram].casesCompleted.length-1;
//         if (userInfoGlobal.progress.programs[lastProgram].casesCompleted[0] === "null" || casesCompleted < 0) {
//             casesCompleted = 0;
//         }

//         var rawPercent = (casesCompleted / totalCases);
//         callback(Math.round(rawPercent * 100));
//     });
// };

export function getProgramPercent(callback) {
    let ref = baseRef.parent.child('users').child(userInfoGlobal.id).child('progress').child('programs');
    let userCompletedCases;

    return ref.once('value').then(function(snapshot){
        userCompletedCases = snapshot.val();
        return baseRef.parent.child('sim').once('value');
    }).then(function(snapshot){
        return new Promise(function(resolve){
            let percentPerProgram = {};
            let totalCases = 0;
            let totalCompletedCases = 0;

            userInfoGlobal.enabledPrograms.forEach(function(program){
                let numOfCases = Object.keys(snapshot.val()[program]).length - 1;
                let numOfCompletedCases = 0;

                if(userCompletedCases.hasOwnProperty(program)) {
                    numOfCompletedCases = userCompletedCases[program].casesCompleted.length - 1;
                }

                totalCases += numOfCases;
                totalCompletedCases += numOfCompletedCases;
                percentPerProgram[program] = Math.round(numOfCompletedCases / numOfCases * 100);
            });

            let totalPercent = Math.round(totalCompletedCases / totalCases * 100);

            callback(percentPerProgram, totalPercent);
        });
    });
}

export const launchNextCase = function (programName, caseId) {
    // let programObject;
    // let program = [];
    // program.push(programName);
    // for (var i = 0; i < allPrograms.length; i++) {
    //     if (allPrograms[i][0] == program) {
    //         programObject = allPrograms[i][1];
    //         break;
    //     }
    // }

    programTitle = programName;
    launchCase(caseId);

    // program.push(programObject);
    // program.push(caseId);

    // loadCases(program);
};









// angular.module('casesApp')
//     .controller('CasesCtrl', ['$scope', '$rootScope', '$window', 'UserService', '$http', 'socket', '$timeout', '$sce', function ($scope, $rootScope, $window, UserService, $http, socket, $timeout, $sce) {

//         $scope.showCases = false;
//         $scope.hideDefaultContent = true;
//         $scope.programCases = null;
//         $scope.rawProgram = null;
//         $scope.currentProgress = null;
//         $scope.showIFrame = false;

//         $scope.loadCases = function (programObject) {
//             //generate our category tabs
//             $scope.categoryTabs = programObject.program.categories;
//             $scope.rawCases = programObject;

//             //sort cases to categories
//             sortCases(programObject);
//         };

//         var sortCases = function (programObject) {
//             $scope.programCases = [];
//             for (var i = 0; i < $scope.categoryTabs.length; i++) {
//                 //create an empty array for each category
//                 var casesArray = [];
//                 $scope.programCases.push(casesArray);
//             }

//             //iterate over all cases in programObject and push to categoryArray based on index
//             for (var key in programObject) {
//                 if (programObject.hasOwnProperty(key)) {
//                     var currentCase = programObject[key];
//                     if ('case' in currentCase) {
//                         if ($scope.currentProgress.indexOf(key) > -1) {
//                             //case was completed, set grayscale class
//                             currentCase.style = "desaturate";
//                         } else {
//                             //case was not found so set class to something bogus
//                             currentCase.style = "noClass";
//                         }

//                         var caseDetails = currentCase.case;
//                         currentCase.caseVal = key;
//                         var categoryIndex = parseInt(caseDetails.category.substr(1));

//                         //grab category array from $scope and push current program to it
//                         $scope.programCases[categoryIndex - 1].push(currentCase);
//                     }
//                 }
//             }
//             $timeout(function () {
//                 $scope.$apply();
//             });
//         };

export const getProgramProgress = function (programName) {
    return userInfoGlobal.progress.programs[programName].casesCompleted;
};

// export const loadCases = function (program) {
//     if (program == null) {
//         //updating after the user completed a case, so 'reuse' the variables already assigned to $scope
//         // $scope.currentProgress = UserService.getProgramProgress($scope.programTitle);
//         // $scope.loadCases($scope.allCases);
//     } else {
//         programTitle = program[0];
//         currentProgress = getProgramProgress(programTitle);
//         $scope.allCases = args[2];
//         $scope.loadCases($scope.allCases);

//         $scope.titleColor = args.color;
//         if (args.length === 4) {
//             //the 'next case' id was passed so the user wants to immediately launch the next case
//             $scope.launchCase(args[3]);
//         }
//     }
//     //$scope.$apply();
//     $scope.showCases = true;

// }

        // $scope.goBack = function () {
        //     $rootScope.$broadcast('loadPrograms');
        //     $scope.showCases = false;
        // };

        // $scope.select = function (item) {
        //     $scope.selected = item;
        //     $scope.hideDefaultContent = false;
        // };

        // $scope.isActive = function (item) {
        //     return $scope.selected === item;
        // };

export const launchCase = function (programName, caseId, callback) {
    var encrypted = "";

    getCurrentUser( function (currentId) {
        var idObject = {
            id: currentId
        };

        request('https://viven-basic.herokuapp.com/getVar', {
            method: 'POST',
            json: idObject,
            headers: {'Content-Type': 'application/json'}
        }, function successCallback(error, response) {
            encrypted = response.body.id;
            // programTitle = currentProgram;
            programTitle = programName;
            callback('https://viven-health-ab1cf.firebaseapp.com/index.html?p='+programTitle+'&c='+caseId + '&q=' + encrypted);
        });
    });
};


export function getFAQs() {
    var ref = baseRef.parent.child('faq');
    return ref.once('value').then(function(snapshot) {
        return new Promise(function(resolve, reject){
            let faqData = [];
            snapshot.forEach(function(childSnapshot){
                faqData.push(childSnapshot.val());
            });
            resolve(faqData);
        });
    });
}

export function addUserCompletedCase(programName, caseId) {
    // console.log(userInfoGlobal);
    var ref = baseRef.child(userInfoGlobal.id).child('progress');
    ref.once('value').then(function(snapshot){
        // console.log(snapshot.val());
        let progress = snapshot.val();
        if (!progress.programs.hasOwnProperty(programName)){
            progress.programs = {...progress.programs, programName:{casesCompleted:[null], isComplete:false} };
        }
        if (!progress.programs[programName].casesCompleted.includes(caseId)) {
            progress.programs[programName].casesCompleted.push(caseId);
        }
        ref.set(progress);
        userInfoGlobal.enabledPrograms.forEach(function(program) {
            getCases(program).then(function(cases){
                cases.pop();
                if (!progress.programs.hasOwnProperty(program)){
                    progress.next_action.program = program;
                    progress.next_action.case = cases[0];
                    ref.set(progress);
                    return;
                } else {
                    for(let caseId of cases) {
                        if (!progress.programs[program].casesCompleted.includes(caseId)) {
                            progress.next_action.program = program;
                            progress.next_action.case = caseId;
                            ref.set(progress);
                            break;
                        }
                    }
                }
            });
        });
    });
}

export function getCases(program){
    var ref = baseRef.parent.child('sim');
    return ref.once('value').then(function(snapshot){
        return new Promise(function(resolve, reject){
            resolve(Object.keys(snapshot.val()[program]));
        });
    });
}