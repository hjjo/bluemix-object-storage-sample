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

const pkgcloud = require('pkgcloud');
const url = require('url');
const multiparty = require('multiparty');

let config = {
    provider: 'openstack',
    useServiceCatalog: true,
    useInternal: false,
    keystoneAuthVersion: process.env.keystone_version,
    authUrl: process.env.auth_url,
    tenantId: process.env.project_id,    //projectId from credentials
    domainId: process.env.domain_id,
    username: process.env.user_name,
    password: process.env.password,
    region: process.env.region   //dallas or london region
};

let client = pkgcloud.storage.createClient(config);

client.auth(err => {
	console.log(err);
})

let listContainers = (req, res) => {
	client.getContainers((err, containers) => {
		if(err) res.status(err.code || 500).json(err.message);
		else{
			res.json(containers);
		}
	});
}

let createContainer = (req, res) => {
	let body = req.body;
	client.createContainer(body.name, (err, container) => {
		if(err) res.status(err.code || 500).json(err.message);
		else{
			res.json(container);
		}
	});
}

let listContainerObjects = (req, res) => {
	let queryObject = url.parse(req.url,true).query;
	client.getFiles(queryObject.container, (err, container) => {
		if(err) res.status(err.code || 500).json(err.message);
		else{
			res.json(container);
		}
	});
}

let uploadObject = (req, res) => {
	let form = new multiparty.Form();
	let queryObject = url.parse(req.url,true).query;

	form.on('part', part => {
	    if (!part.filename) rejected();

			var upload = client.upload({
          container: queryObject.container,
          remote: part.filename
      });

      upload.on('error', function(err) {
        return res.status(err.code || 500).json(err.message);
      });
      upload.on('success', function(file) {
        return res.json({
        	'status' : 'success'
        })
      });

	    part.pipe(upload);
	  });

		form.parse(req);
}

module.exports = {
    'initialize': (app, options) => {
        app.get(`/pkgcloud/containers`, listContainers);
        app.put(`/pkgcloud/container`, createContainer);
        app.get(`/pkgcloud/container/`, listContainerObjects);
        app.post(`/pkgcloud/object`, uploadObject);
    }
};