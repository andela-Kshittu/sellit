'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Product = mongoose.model('Product'),
	_ = require('lodash');

	var uuid = require('node-uuid'),
	    multiparty = require('multiparty'),
	    async = require('async');

	var path = require('path'),
		fs = require('fs');


var imageUpload = function( req, res, contentType, tmpPath, destPath, product) {
	 // Server side file type checker.
    if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
        fs.unlink(tmpPath);
        return res.send(400, { 
        	message: 'Unsupported file type. Only jpeg or png format allowed' 
        });

    } else
    async.waterfall([
            function (callback) {
                fs.readFile(tmpPath , function(err, data){
                    if (err) {
                        var message = 'tmpPath doesn\'t exist.';
                        return callback(message);
                    }
                    callback(null, data);
                });             
            },
            function ( data, callback){

                fs.writeFile(destPath, data, function(err) {
                    if (err) {
                        var message = 'Destination path doesn\'t exists';
                        return callback(message);
                    }
                    callback();
                });
            },
            function (callback) {
                fs.unlink(tmpPath);
            }
        ],
        function (err, results) {
            if (err) {
                res.send(500, { message: err });
            }
        }
    );
    
};

/**
 * Create a Product
 */
exports.create = function(req, res) {
	
	var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
    		console.log(files);
        var file = files.file[0];

	         if (err) {
	             res.send(500, {
	                message: err
	            });
	        } 

	        if (files.file[0]) {
		        var contentType = file.headers['content-type'];
		        var tmpPath = file.path;
		        var extIndex = tmpPath.lastIndexOf('.');
		        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
		        // uuid is for generating unique filenames. 
		        var fileName = uuid.v4() + extension;
		        var destPath = 'public/modules/core/img/server/Temp/' + fileName;
	    	}

	        var product = new Product(fields);
				product.user = req.user;
				product.photo = destPath;

		product.save(function(err) {
			if (err) {
				return res.status(400).send({
			 		message: errorHandler.getErrorMessage(err)
				});
			} else {

					imageUpload( req, res, contentType, tmpPath, destPath, product);
					
					res.jsonp(product);
			}
		});
	});

};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
	res.jsonp(req.product);
};
// exports.getCategories = function(req, res) {
// 	res.jsonp(req.product);
// };
/**
 * Update a Product
 */
exports.update = function(req, res) {
	var product = req.product ;

	product = _.extend(product , req.body);

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * Delete an Product
 */
exports.delete = function(req, res) {
	var product = req.product ;

	product.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};

/**
 * List of Products
 */
exports.list = function(req, res) { Product.find().sort('-created').populate('user', 'displayName').exec(function(err, products) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(products);
		}
	});
};

exports.productByID = function(req, res, next, id) { Product.findById(id).populate('user', 'displayName').exec(function(err, product) {
		if (err) return next(err);
		if (! product) return next(new Error('Failed to load Product ' + id));
		// console.log(req.product);
		req.product = product ;
		next();
	});
};

exports.search = function(req,res){	

	var $or = {$or:[]};
	var checkQuery = function(){
		if (req.query.q&&req.query.q.length >0){
			$or.$or.push({location : new RegExp(req.query.q, 'i')});
		}
		if (req.query.category && req.query.category.length > 1){
			$or.$or.push({category: new RegExp(req.query.category)});
		}
		if(req.query.title && req.query.title.length>1)
		{
			$or.$or.push({title:new RegExp(req.query.title)});
		}
		if(req.query.price && req.query.price.length>1)
		{
			$or.$or.push({price:new RegExp(req.query.price)});
		}
	};
	checkQuery();
	Product.find($or).exec(function(err, data){
		if(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(data);
			console.log(req.body);
		}
	});
};
// exports.search = function(req,res){	

// 	var queryHolder = {
// 		queryType:[]
// 	};
// 	var checkQuery = function(){
// 		if (req.query.q&&req.query.q.length >0){
// 			queryHolder.queryType.push({name : new RegExp(req.query.q, 'i')});
// 		}
// 		if (req.query.category && req.query.category.length > 1){
// 			queryHolder.queryType.push({category: new RegExp(req.query.category)});
// 		}
// 		if(req.query.title && req.query.title.length>1)
// 		{
// 			queryHolder.queryType.push({title:new RegExp(req.query.title)});
// 		}
// 		if(req.query.price && req.query.price.length>1)
// 		{
// 			queryHolder.queryType.push({price:new RegExp(req.query.price)});
// 		}
// 	};
// 	checkQuery();
// 	Product.find(req.query.queryHolder.queryType).exec(function(err, data){
// 		if(err) {
// 			return res.status(400).send({
// 				message: errorHandler.getErrorMessage(err)
// 			});
// 		} else {
// 			res.jsonp(data);
// 			console.log(req.body);
// 		}
// 	});
// };
// exports.search = function() {
// 	var queryHolder ={queryType:[]};
// 	var checkQuery = function(req, res){
// 		if (req.query.category && req.query.category.length > 0)
// 			{ queryHolder.queryType.push(req.query.category)}
// 		else if (req.query.name && req.query.name.length > 0)
// 			{ queryHolder.queryType.push(req.query.name)}
// 	}
// 	checkQuery();
// };
/**
 * Product middleware
 */
// exports.productBySearch = function(req, res, next, searchQuery) { Product.where('name', saerchQuery).populate('user', 'displayName').exec(function(err, result) {
// 		if (err) return next(err);
// 		if (! result) return next(new Error('Failed to load Product ' + searchQuery));
// 		req.product = product;
// 		next();
// 	});
// };
/**
 * Product authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.product.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};