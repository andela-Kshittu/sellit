'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
	name: {
		type: String,
		default: '',
		// required: 'Please fill Product name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		default: '',
		trim: true
		// required: 'Description cannot be blank'
	},
	photo: {
		type: String
		// required: 'Description cannot be blank'
	},
	location: {
		type:String,
		default:'',
		trim: true
		// required: 'location cannot be blank'
	},
	phone_number: {
		type: String,
		default:'',
		trim: true
		// required: 'Phone Number cannot be blank'
	},
	category:{
		type: String,
		default:'',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Product', ProductSchema);