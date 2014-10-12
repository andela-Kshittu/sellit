'use strict';

var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body:{type:String, default:'',required: 'Body cannot be blank'},
  author: {type:String, default:'',required: 'Author cannot be blank'},
  likes: {type: Number, default: 0},
  likesView: {
		type: String,
		default: 'true'
	},
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
});
CommentSchema.methods.like = function(cb) {
  this.likes += 1;
  this.save(cb);
};
CommentSchema.methods.dislike = function(cb) {
  this.likes -= 1;
  this.save(cb);
};

mongoose.model('Comment', CommentSchema);