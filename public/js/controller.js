var Controller = (function() {
	var selector = {
		'overlay_container_name' : {
			'input' : '#overlay_container_name input',
			'button' : '#overlay_container_name button'
		},
		'overlay_object' : {
			'input' : '#overlay_object input[type=text]',
			'file' : '#overlay_object input[type=file]',
			'button' : '#overlay_object button'
		}
	}

	var pkgcloud_on = false;

  return {
  	authenticate : authenticate,
  	listContainers : listContainers,
  	getContainerNameInput  : getContainerNameInput ,
  	getFileInput : getFileInput,
  	switchChange : switchChange
	}

	function switchChange(input){
		pkgcloud_on = input.checked;
		if(pkgcloud_on){
			document.getElementById("auth_btn").style.display = 'none';
		}
		else{
			document.getElementById("auth_btn").style.display = 'initial';
		}
	}

	function getApiClient(){
		return pkgcloud_on? pkgCloud : Api;
	}

	function authenticate(){
		Api.authenticate().then(function(resp){
			displayResponse(resp);
		});
	}

	function listContainers(){
		getApiClient().listContainers().then(function(resp){
			displayResponse(resp);
		});
	}

	function createContainer(){
		var input = document.querySelector(selector.overlay_container_name.input);
		
		var name = input.value;
		if(name && name.length > 0){
			getApiClient().createContainer(name).then(function(resp){
				displayResponse(resp);
			});
			IBMCore.common.widget.overlay.hide('overlay_container_name');
		}
		else{
			input.classList.add("error");
		}
	}

	function listOjbects(){
		var input = document.querySelector(selector.overlay_container_name.input);
		
		var name = input.value;
		if(name && name.length > 0){
			getApiClient().listObjects(name).then(function(resp){
				displayResponse(resp);
			});
			
			IBMCore.common.widget.overlay.hide('overlay_container_name');
		}
		else{
			input.classList.add("error");
		}
	}

	function getContainerNameInput(command){
		initOverlay(selector.overlay_container_name);

		var okbtn = document.querySelector(selector.overlay_container_name.button);

		IBMCore.common.widget.overlay.show('overlay_container_name');
		
		if(command == 'create'){
			okbtn.addEventListener("click", createContainer);
		}
		else if(command == 'get'){
			okbtn.addEventListener("click", listOjbects);
		}
	}

	function initOverlay(overlay_selector){
		for(var key in overlay_selector){
			if(key == 'input' || key == 'file'){
				var el = document.querySelector(overlay_selector[key]);
				el.value = "";
				el.classList.remove("error");
			}
			else if(key == 'button'){
				var el = document.querySelector(overlay_selector[key]);

				el.removeEventListener("click", createContainer);
				el.removeEventListener("click", listOjbects);
				el.removeEventListener("click", uploadObject);
			}
		}
	}

	function getFileInput(){
		initOverlay(selector.overlay_object);
		var okbtn = document.querySelector(selector.overlay_object.button);

		IBMCore.common.widget.overlay.show('overlay_object');

		okbtn.addEventListener("click", uploadObject);
	}

	function uploadObject(){
		var input = document.querySelector(selector.overlay_object.input);
		var file = document.querySelector(selector.overlay_object.file);

		var name = input.value;
		if(name && name.length > 0 && file.value){
			
		}
		if(!name || name.length == 0){
			input.classList.add("error");
		}
		else if(!file.value || file.value.length == 0){
			file.classList.add("error");
		}
		else{
			getApiClient().uploadObject(name, file.files[0]).then(function(resp){
				displayResponse(resp);
			});
			
			IBMCore.common.widget.overlay.hide('overlay_object');
		}
	}

	function displayResponse(resp){
		var parent = document.querySelector('.result');
		var container = document.createElement('p');
		var message = document.createTextNode(JSON.stringify(resp, null, 4));
		container.appendChild(message);
		parent.appendChild(container);
		scrollToBottom(parent);
	};

	function scrollToBottom(node){
		node.scrollTop = node.scrollHeight;
	};

})();
