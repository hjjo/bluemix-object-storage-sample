/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const request = require('request');

module.exports.listContainers = (url, token) => {
	let reqOption = {
		method : 'GET',
		url : url + '/',
		headers : {
      'Content-Type': 'application/json',
      'X-Auth-Token' : token
    },
    qs : {
    	'format' : 'json'
    }
	};
	return new Promise((resolved, rejected) => {
		request(reqOption, (err, res, body) => {
      if(err){
        rejected(err);
      }
      else{
      	let headers = res.headers;
      	resolved({headers, body});
      }
    })
	});
};

module.exports.create = (url, token, container) => {
	let reqOption = {
		method : 'PUT',
		url : url + '/' + container,
		headers : {
      'Content-Type': 'application/json',
      'X-Auth-Token' : token
    },
    qs : {
    	'format' : 'json'
    }
	};
	return new Promise((resolved, rejected) => {
		request(reqOption, (err, res, body) => {
      if(err){
        rejected(err);
      }
      else{
      	let headers = res.headers;
      	resolved({headers, body});
      }
    })
	});
};

module.exports.listObjects = (url, token, container) => {
	let reqOption = {
		method : 'GET',
		url : url + '/' + container,
		headers : {
      'Content-Type': 'application/json',
      'X-Auth-Token' : token
    },
    qs : {
    	'format' : 'json'
    }
	};
	return new Promise((resolved, rejected) => {
		request(reqOption, (err, res, body) => {
      if(err){
        rejected(err);
      }
      else{
      	let headers = res.headers;
      	resolved({headers, body});
      }
    })
	});
};