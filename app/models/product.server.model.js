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
		required: 'Please fill Product name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	description: {
		type: String,
		default: '',
		trim: true,
		required: 'Product Image is needed'
	},
	photo: {
		type: String,
		required: 'image cannot be blank'
	},
	cost: {
		type: String,
		required: 'Price field cannot be blank'
	},
	quantity: {
		type: String,
		required: 'Quantity field cannot be blank'
	},
	negotiable: {
		type: String,
		required: 'Negotiation cannot be blank'
	},
	location: {
		type:String,
		default:'',
		trim: true,
		required: 'location cannot be blank'
	},
	phone_number: {
		type: String,
		default:'',
		trim: true,
		required: 'Phone Number cannot be blank'
	},
	category:{
		type: String,
		default:'',
		trim: true,
		required: 'Please select a category'
	},
	likes: {type: Number, 
			default: 0,
		},
	likesView: {
		type: String,
		default: 'true'
	},
  	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
});
ProductSchema.methods.like = function(cb) {
  this.likes += 1;
  // this.likesView = false;
  this.save(cb);
};
ProductSchema.methods.dislike = function(cb) {
  this.likes -= 1;
  // this.likesView = true;
  this.save(cb);
};

mongoose.model('Product', ProductSchema);