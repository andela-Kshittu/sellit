'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Product = mongoose.model('Product'),
    Comment = mongoose.model('Comment'),
    _ = require('lodash');

var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    async = require('async');

var path = require('path'),
    fs = require('fs');
exports.create = function(req, res) {
    var product = new Product(req.body);
        product.user = req.user;
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
 * Show the current Product
 */
exports.read = function(req, res) {
    res.jsonp(req.product);
};
/**
 * Update a Product
 */
exports.update = function(req, res) {
    var product = req.product;

    product = _.extend(product, req.body);

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

exports.updateComment = function(req, res) {
    var comment = req.comment;

    comment = _.extend(comment, req.body);

    comment.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(comment);
        }
    });
};


/**
 * Delete an Product
 */
exports.delete = function(req, res) {
    var product = req.product;

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
exports.list = function(req, res) {
    Product.find().sort('-created').populate('user', 'displayName').exec(function(err, products) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(products);
        }
    });
};

exports.productByID = function(req, res, next, id) {
    Product.findById(id).populate('user', 'displayName').populate('comments').exec(function(err, product) {
        if (err) return next(err);
        if (!product) return next(new Error('Failed to load Product ' + id));
        // console.log(req.product);
        req.product = product;
        next();
    });
};

exports.commentByID = function(req, res, next, id) {
    Comment.findById(id).populate('product', 'name').exec(function(err, comment) {
        if (err) return next(err);
        if (!comment) return next(new Error('Failed to load Comment ' + id));
        // console.log(req.product);
        req.comment = comment;
        next();
    });
};

exports.like = function(req, res, next) {
    req.product.like(function(err, product) {
        if (err) {
            return next(err);
        }
        res.json(product);
    });
};
exports.dislike = function(req, res, next) {
    req.product.dislike(function(err, product) {
        if (err) {
            return next(err);
        }
        res.json(product);
    });
};
exports.commentLike = function(req, res, next) {
    req.comment.like(function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
};
exports.commentdisLike = function(req, res, next) {
    req.comment.dislike(function(err, comment) {
        if (err) {
            return next(err);
        }
        res.json(comment);
    });
};
exports.comments = function(req, res, next) {
    var comment = new Comment(req.body);
    comment.product = req.product;

    comment.save(function(err, comment) {
        if (err) {
            return next(err);
        }
        req.product.comments.push(comment);
        req.product.save(function(err, product) {
            if (err) {
                return next(err);
            }
            res.json(comment);
        });
    });
};
exports.search = function(req, res) {
    var $or = {
        $or: []
    };
    var checkQuery = function() {
        if (req.query.location && req.query.location.length > 0) {
            $or.$or.push({
                location: new RegExp(req.query.location, 'i')
            });
        } else if (req.query.category && req.query.category.length > 1) {
            $or.$or.push({
                category: new RegExp(req.query.category, 'i')
            });
        } else if (req.query.name && req.query.name.length > 1) {
            $or.$or.push({
                name: new RegExp(req.query.name, 'i')
            });
        } else if (req.query.description && req.query.description.length > 1) {
            $or.$or.push({
                description: new RegExp(req.query.description, 'i')
            });
        } else if (req.query.cost && req.query.cost.length > 1) {
            $or.$or.push({
                cost: new RegExp(req.query.cost, 'i')
            });
        } else if (req.query.negotiable && req.query.negotiable.length > 1) {
            $or.$or.push({
                negotiable: new RegExp(req.query.negotiable, 'i')
            });
        }
    };
    checkQuery();
    Product.find($or).exec(function(err, data) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(data);
            console.log(req.body);
            console.log(data);
        }
    });
};
/**
 * Product authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.product.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
