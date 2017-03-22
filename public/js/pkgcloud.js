var pkgCloud = (function(){

	var uri = {
		'containers' : '/pkgcloud/containers',
		'container' : '/pkgcloud/container',
		'object' : '/pkgcloud/object'
	};

	return {
  	listContainers : listContainers,
  	createContainer : createContainer,
  	listObjects : listObjects,
  	uploadObject : uploadObject
	}

  // Send a message request to the server
  function listContainers() {
    // Build request payload
    var payload = {};

    var promise = new Promise(function(resolve, reject){
    	// Built http request
	    var http = new XMLHttpRequest();
	    http.open('GET', uri.containers, true);
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

    var promise = new Promise(function(resolve, reject){
    	// Built http request
	    var http = new XMLHttpRequest();
	    http.open('PUT', uri.container, true);
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
    var qs = "container=" + name;

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

  	var qs = "container=" + name;

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