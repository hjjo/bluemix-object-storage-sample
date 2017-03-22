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
const multiparty = require('multiparty');

module.exports.upload = (url, token, container, req) => {
	return new Promise((resolved, rejected) => {
		let form = new multiparty.Form();

		form.on('part', part => {
	    if (!part.filename) rejected();

	    let reqOption = {
				method : 'PUT',
				url : url + '/' + container + '/' + part.filename,
				headers : {
		      'Content-Type' : part.headers['content-type'],
		      'Content-Length' : part.byteCount,
		      'X-Auth-Token' : token
		    },
		    qs : {
		    	'format' : 'json'
		    }
			};

	    part.pipe(request(reqOption, (err, res, body) => {
	      if(err){
	        rejected(err);
	      }
	      else{
	      	resolved(res.responseCode);
	      }
	    }));
	  });

		form.parse(req);
	})
};