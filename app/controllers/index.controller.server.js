/*
COMP229-F2022-ASSIGNMENT1-822281549
Sheila Donnelly
Student #822281549
October 7th, 2022
*/

import { UserDisplayName } from "../utils/index.js";

export function displayHomePage(req, res, next) {
    res.render('index', { title: 'Home', page: 'home', displayName: UserDisplayName(req) } );
};

export function displayAboutPage(req, res, next) {
    res.render('index', { title: 'About', page: 'about', displayName: UserDisplayName(req)} );
};

export function displayProjectsPage(req, res, next) {
    res.render('index', { title: 'Projects', page: 'projects', displayName: UserDisplayName(req)} );
};

export function displayServicesPage(req, res, next) {
    res.render('index', { title: 'Services', page: 'services', displayName: UserDisplayName(req)} );
};

export function displayContactPage(req, res, next) {
    res.render('index', { title: 'Contact', page: 'contact', displayName: UserDisplayName(req)} );
};