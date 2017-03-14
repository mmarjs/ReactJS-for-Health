import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App.jsx';
import {getCurrentUser, getUserData, getAllowedPrograms} from './components/Service/Service.jsx';

let localAccount = JSON.parse(localStorage.getItem('currentAccount'));

getCurrentUser(function(key){
    let currentUser = {
        id: key,
        email: localAccount.email,
        name: localAccount.displayName,
        picture: localAccount.photoURL
    };

    ReactDOM.render(<App user = {currentUser} />, document.getElementById('app'));
});