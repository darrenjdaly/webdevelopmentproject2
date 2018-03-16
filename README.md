

## Angular Alpha 101_02 Basic Demonstration
#### January 2018  AngularJS/Express.js/Node.js Demonstration

 
Cloud demos (if deployed) at:
1. [Heroku](https://angularalpha-101-02.herokuapp.com/#/home)   
 
A small basic application to introduce some Angular concepts.
This is a minimal index.htm and app.js
.\partials\home.html contains the view.


This is not a proper SPA, it has no styling, it has no peristence.


It demonstrates ng-* directives to present the dynamic data

ng-click     	- used to call the function on the button
ng-model	 	- used to bind to the $scope model
ng-repeat		- used to iterate an array


Platform requirements to install this application locally:

1. [Installing git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)  
2. [Installing node.js with npm](https://nodejs.org/en/download/) 
3. [Installing yarn](https://yarnpkg.com/en/)	or use npm			
4. [optional, installing nodemon](https://www.npmjs.com/package/nodemon/) 

To install locally, assuming platform requirements prepared:

1. use git to clone or manually extract the zip file, 
2. open a command window in the application folder and type the following commands to start on localhost:3443. You may specify a different port number by supplying is as an argument.
    1. yarn install  or npm install
    2. node server.js [port]    (or nodemon server.js  [port]if nodemon installed)
	
	
[Migrating from npm to yarn](https://yarnpkg.com/lang/en/docs/migrating-from-npm/)	
	
	
 