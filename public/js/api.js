var Api = (function(){
	var token;
	var endpoint;

	var uri = {
		'authentication' : '/auth',
		'containers' : '/containers',
		'container' : '/container',
		'object' : '/object'
	};

	return {
  	authenticate : authenticate,
  	listContainers : listContainers,
  	createContainer : createContainer,
  	listObjects : listObjects,
  	uploadObject : uploadObject
	}

  // Send a message request to the server
  function authenticate() {
    // Build request payload
    var payload = {};
    var promise = new Promise(function(resolve, reject){
    	// Built http request
	    var http = new XMLHttpRequest();
	    http.open('POST', uri.authentication, true);
	    http.setRequestHeader('Content-type', 'application/json');
	    http.onreadystatechange = function() {
	      if (http.readyState === 4 && http.status === 200 && http.responseText) {
	        var resp = JSON.parse(http.responseText);
	        token = resp.token;
	        var endpoints = resp.endpoints;
	        endpoint = endpoints.find(function(e){
	        	return (e.region_id == 'london') && (e.interface == 'public')
	        });
	        resolve(resp);
	      }
	    };

	    var params = JSON.stringify(payload);

	    // Send request
	    http.send(params);
    });

    return promise;
  }

  // Send a message request to the server
  function listContainers() {
    // Build request payload
    var payload = {};
    var qs = "endpoint=" + endpoint.url + "&token=" + token;

    var promise = new Promise(function(resolve, reject){
    	// Built http request
	    var http = new XMLHttpRequest();
	    http.open('GET', uri.containers + "?" + qs, true);
	    http.setRequestHeader('Content-type', 'application/json');
	    http.onreadystatechange = function() {
	      if (http.readyState === 4 && http.status === 200 && http.responseText) {
	        resolve(JSON.parse(http.responseText));
	      }
	    };

	    var params = JSON.stringify(payload);

	    // Send request
	    http.send(params);
    });

    return promise;
  }

  // Send a message request to the server
  function createContainer(name) {
    // Build request payload
    var payload = {
    	'name' : name
    };
    var qs = "endpoint=" + endpoint.url + "&token=" + token;

    var promise = new Promise(function(resolve, reject){
    	// Built http request
	    var http = new XMLHttpRequest();
	    http.open('PUT', uri.container + "?" + qs, true);
	    http.setRequestHeader('Content-type', 'application/json');
	    http.onreadystatechange = function() {
	      if (http.readyState === 4 && http.status === 200 && http.responseText) {
	        resolve(JSON.parse(http.responseText));
	      }
	    };

	    var params = JSON.stringify(payload);

	    // Send request
	    http.send(params);
    });

    return promise;
  }

  // Send a message request to the server
  function listObjects(name) {
    // Build request payload
    var payload = {};
    var qs = "endpoint=" + endpoint.url + "&token=" + token + "&container=" + name;

    var promise = new Promise(function(resolve, reject){
    	// Built http request
	    var http = new XMLHttpRequest();
	    http.open('GET', uri.container + "?" + qs, true);
	    http.setRequestHeader('Content-type', 'application/json');
	    http.onreadystatechange = function() {
	      if (http.readyState === 4 && http.status === 200 && http.responseText) {
	        resolve(JSON.parse(http.responseText));
	      }
	    };

	    var params = JSON.stringify(payload);

	    // Send request
	    http.send(params);
    });

    return promise;
  }

  function uploadObject(name, file){
  	var formData = new FormData();
  	formData.append("object", file);

  	var qs = "endpoint=" + endpoint.url + "&token=" + token + "&container=" + name;

    var promise = new Promise(function(resolve, reject){
    	// Built http request
	    var http = new XMLHttpRequest();
	    http.open('POST', uri.object + "?" + qs, true);
	    //http.setRequestHeader('Content-type', 'multipart/form-data');
	    http.onreadystatechange = function() {
	      if (http.readyState === 4 && http.status === 200 && http.responseText) {
	        resolve(JSON.parse(http.responseText));
	      }
	    };

	    // Send request
	    http.send(formData);
    });

    return promise;
  }

})();