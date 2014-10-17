'use strict';

module.exports = {
	db: 'mongodb://localhost/shop-quick-dev',
	app: {
		title: 'Shop Quick - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1497607230493817',
		clientSecret: process.env.FACEBOOK_SECRET || '686084ae1f35221a20687ce4421e6ffe',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'A0HISUins64WLykuH9rgg5n3G',
		clientSecret: process.env.TWITTER_SECRET || 'bKBLBbyXHGF9J3qckZIEqhS5uICkXuL8SzOFJOpuqW0RxKS4Oa',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '642189591310-3jkg4a2oqm7g7k1um6srht09h0o3qg5p',
		clientSecret: process.env.GOOGLE_SECRET || 'EVEXBSi9eacOmTSffCSGaQ7w',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || '77lsnjo1qsrtu9',
		clientSecret: process.env.LINKEDIN_SECRET || 's9CCVYsLLYG7KvGc',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'e8cac6f3858d0411e6ce',
		clientSecret: process.env.GITHUB_SECRET || 'a9a83030f14593ab97f2d12f38c0a152eb3726a2',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};