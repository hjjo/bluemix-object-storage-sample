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

const url = require('url');

const auth = require('./objectstorage/auth');
const container = require('./objectstorage/container');
const object = require('./objectstorage/object');

let openstack;

let authenticate = (req, res) => {
	auth.authenticate().then(data => {
		let token = data.headers['x-subject-token'];
		let endpoints;
		for(let prod of data.body.token.catalog){
			if(prod.type == 'object-store'){
				endpoints = prod.endpoints;
			}
		}
		return res.json({token, endpoints});
	}).catch(err => {
		console.error(err);
		return res.status(err.code || 500).json(err.message);
	});
};

let listContainers = (req, res) => {
	let queryObject = url.parse(req.url,true).query;

	container.listContainers(queryObject.endpoint, queryObject.token).then(data => {
		let count = data.headers['x-account-container-count'];
		let total_bytes_used = data.headers['x-account-bytes-used']
		let containers = JSON.parse(data.body);
		return res.json({count, total_bytes_used, containers});
	}).catch(err => {
		console.error(err);
		return res.status(err.code || 500).json(err.message);
	});
};

let createContainer = (req, res) => {
	let queryObject = url.parse(req.url,true).query;
	let body = req.body;
	container.create(queryObject.endpoint, queryObject.token, body.name).then(data => {
		return res.json({
			'status' : 'success'
		});
	}).catch(err => {
		console.error(err);
		return res.status(err.code || 500).json(err.message);
	});
}

let listContainerObjects = (req, res) => {
	let queryObject = url.parse(req.url,true).query;
	container.listObjects(queryObject.endpoint, queryObject.token, queryObject.container).then(data => {
		let count = data.headers['x-container-object-count'];
		let total_bytes_used = data.headers['x-container-bytes-used'];
		let objects = JSON.parse(data.body);
		return res.json({count, total_bytes_used, objects})
	}).catch(err => {
		console.error(err);
		return res.status(err.code || 500).json(err.message);
	});
};

let uploadObject = (req, res) => {
	let queryObject = url.parse(req.url,true).query;
	object.upload(queryObject.endpoint, queryObject.token, queryObject.container, req).then(data => {
		return res.json({
			'status' : 'success',
			'result' : data
		})
	}).catch(err => {
		console.error(err);
		return res.status(err.code || 500).json(error.message);
	});
};

module.exports = {
    'initialize': (app, options) => {
        app.post(`/auth`, authenticate);
        app.get(`/containers`, listContainers);
        app.put(`/container`, createContainer);
        app.get(`/container/`, listContainerObjects);
        app.post(`/object`, uploadObject);
    }
};