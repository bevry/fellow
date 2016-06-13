/**
A fellow with similarties to other people.

Also contains the properties:

- {String} homepage
- {String} githubUrl
- {String} githubUsername
- {String} twitterUrl
- {String} twitterUsername
- {String} facebookUrl
- {String} facebookUsername

@class Fellow
*/
class Fellow {

	// -----------------------------------
	// Static Helpers

	/**
	Create a new Fellow instance with the value, however if the value is already a fellow instance, then just return it
	@static
	@param {*} value
	@returns {Fellow} The new fellow instance
	*/
	static create (value) {
		return value instanceof this ? value : new this(value)
	}

	/**
	A singleton array attached to the class object that stores it's people objects
	@static
	@type {Array}
	*/
	static get list () {
		if ( this._list == null )  this._list = []
		return this._list
	}

	/**
	With the value, see if an existing fellow exists in our singleton list property with the value, otherwise create a new fellow instance with the value and add them to our singleton list
	@static
	@param {*} value - The value to create a new fellow instance or find the existing fellow instance with
	@param {boolean} [add=true] - Whether to add the created person to the list
	@returns {Fellow} The new or existing fellow instance
	*/
	static ensure (value, add = true) {
		const newFellow = this.create(value)
		const people = this.list
		for ( const existingFellow of people ) {
			if ( newFellow.compare(existingFellow) ) {
				return existingFellow.set(value)
			}
		}
		if ( add ) {
			people.push(newFellow)
			return newFellow
		}
		else {
			return null
		}
	}

	/**
	An array of fields that will denote if the user is the same user or not when using ensure
	@access protected
	@type {Array}
	*/
	get ensureFields () {
		return ['emails', 'homepage', 'githubUsername', 'twitterUsername', 'facebookUsername']
	}

	/**
	Compare a fellow to another fellow, uses ensureFields for the comparison
	If an ensureField is an array for both ourself and the other fellow, we will check to see if only one item of that array is similar (this is useful for email comparisons)
	@param {Fellow} other The other fellow to compare ourselves with
	@returns {Boolean} Returns `true` if they appear to be the same person, or `false` if not
	*/
	compare (other) {
		const fields = this.ensureFields
		for ( const field of fields ) {
			const value = this[field]
			const otherValue = other[field]

			if ( value && otherValue ) {
				if ( Array.isArray(value) && Array.isArray(otherValue) ) {
					for ( const item of value ) {
						if ( otherValue.indexOf(item) !== -1 ) {
							return true
						}
					}
				}
				else if ( value === otherValue ) {
					return true
				}
			}
		}
		return false
	}

	/**
	Get a fellow from the singleton list
	@method get
	@param {*} value The value to fetch the value with
	@returns {Fellow|Null} The fetched fellow, if they exist with that value
	*/
	static get (value) {
		return this.ensure(value, false)
	}

	/**
	Add a fellow or a series of people, denoted by the value, to the singleton list
	@static
	@param {*} value The fellow or people to add
	@returns {Array} An array of the fellow objects for the passed people
	*/
	static add (value) {
		if ( value instanceof this ) {
			return [this.ensure(value)]
		}
		else if ( typeof value === 'string' ) {
			return value.split(/, +/).map((fellow) => this.ensure(fellow))
		}
		else if ( Array.isArray(value) ) {
			return value.map((value) => this.ensure(value))
		}
		else if ( value ) {
			return [this.ensure(value)]
		}
		else {
			return []
		}
	}

	/**
	Get all fellows who contribute to a particular repository
	@static
	@param {String} repoSlug The repository slug
	@returns {Array} An array of the fellow objects that contribute to the repository
	*/
	static contributesRepository (repoSlug) {
		return this.list.filter(function (fellow) {
			return fellow.ensureRepository(repoSlug).contributes
		})
	}

	/**
	Get all fellows who maintain a particular repository
	@static
	@param {String} repoSlug The repository slug
	@returns {Array} An array of the fellow objects that maintain to the repository
	*/
	static maintainsRepository (repoSlug) {
		return this.list.filter(function (fellow) {
			return fellow.ensureRepository(repoSlug).maintains
		})
	}

	/**
	Get all fellows who author a particular repository
	@static
	@param {String} repoSlug The repository slug
	@returns {Array} An array of the fellow objects that author to the repository
	*/
	static authorsRepository (repoSlug) {
		return this.list.filter(function (fellow) {
			return fellow.ensureRepository(repoSlug).authors
		})
	}


	// -----------------------------------
	// Properties

	/**
	Get the serialisable values of this fellow
	@type {Object}
	*/
	get json () {
		const json = JSON.parse(JSON.stringify(this))
		return json
	}

	/**
	When fetching,
	Updating the email will add the email to the start of the `emails` array.

	When getting,
	Fetches the first email from the emails array.
	@property {String} email
	@param {String} value - The email to add to the emails
	*/
	set email (value) {
		const index = this.emails.indexOf(value)
		if ( index !== -1 ) {
			this.emails = this.emails.slice(0, index).concat(this.emails.slice(index + 1))
		}
		this.emails.unshift(value)
	}
	get email () {
		return this.emails[0] || null
	}

	/**
	When setting,
	Will determine passed url is a github, facebook, or twitter url.
	If it is, then it will extract the username and url from it.
	If this is not one of those urls, then it will set the homepage variable.

	When getting,
	Will fetch `homepage || githubUrl || facebookUrl || twitterUrl || null`
	@type {String}
	@param {String} value
	@returns {this}
	*/
	set url (value) {
		const githubMatch = (/^.+github.com\/([^\/]+)\/?$/).exec(value)
		if ( githubMatch ) {
			this.githubUsername = githubMatch[1]
			this.githubUrl = 'https://github.com/' + this.githubUsername
		}
		else {
			const facebookMatch = (/^.+facebook.com\/([^\/]+)\/?$/).exec(value)
			if ( facebookMatch ) {
				this.facebookUsername = facebookMatch[1]
				this.facebookUrl = 'https://facebook.com/' + this.facebookUsername
			}
			else {
				const twitterMatch = (/^.+twitter.com\/([^\/]+)\/?$/).exec(value)
				if ( twitterMatch ) {
					this.twitterUsername = twitterMatch[1]
					this.twtterUrl = 'https://twitter.com/' + this.twitterUsername
				}
				else {
					this.homepage = value.replace(/^https/, 'http')
				}
			}
		}
	}
	get url () {
		return this.homepage || this.githubUrl || this.facebookUrl || this.twitterUrl || null
	}


	// -----------------------------------
	// Methods

	/**
	Construct our fellow instance with the value
	@param {*} value - The value used to set the properties of the fellow, forwarded to set
	*/
	constructor (value) {
		if ( !this.emails )  this.emails = []
		this.set(value)
	}

	/**
	Update our fellow with the passed value
	@param {String|Object} fellow - A string in the format of "Benjamin Lupton <b@lupton.cc> (https://balupton.com)" or an object with properties
	@returns {this}
	*/
	set (fellow) {
		// String format
		// Benjamin Lupton <b@lupton.cc> (https://balupton.com)
		if ( typeof fellow === 'string' ) {
			const match = (/^([^<(]+)\s*(?:<(.+?)>)?\s*(?:\((.+?)\))?$/).exec(fellow)
			if ( !match ) {
				throw new Error('Invalid fellow string')
			}
			const name = (match[1] || '').trim() || null
			const email = (match[2] || '').trim() || null
			const url = (match[3] || '').trim() || null
			if ( name )   this.name = name
			if ( email )  this.email = email
			if ( url )    this.url = url
		}

		// Object Format
		else if ( typeof fellow === 'object' ) {
			const urlFields = ['url', 'homepage', 'web', 'githubUrl', 'twitterUrl', 'facebookUrl']
			Object.keys(fellow).forEach((key) => {
				if ( key[0] === '_' )  return  // skip if private
				const value = fellow[key] || null
				if ( value ) {
					// if not a url field, e.g. name or email
					if ( urlFields.indexOf(key) === -1 ) {
						this[key] = value
					}
					// if any of the url fields, redirect to url setter
					else {
						this.url = value
					}
				}
			})
		}

		else {
			throw new Error('Invalid fellow input')
		}

		return this
	}


	// -----------------------------------
	// Repos

	/**
	Ensures that the github repository exists on the class
	@private
	@param {String} slug - Github repository slug (e.g. "bevry/projectz")
	@returns {Object} The repository object
	*/
	ensureRepository (slug) {
		if ( this._Repositories == null )  this._Repositories = {}
		if ( this._Repositories[slug] == null )  this._Repositories[slug] = {contributes: false, maintains: false, authors: false}
		return this._Repositories[slug]
	}

	/**
	Get all added github repository slugs that this fellow contributes to
	@type {Array}
	*/
	get contributedRepositories () {
		return Object.keys(this._Repositories || {}).filter((slug) => {
			const repo = this._Repositories[slug]
			return repo && repo.contributes
		})
	}

	/**
	Make note that this fellow contributes to this repository slug
	@param {String} slug - The github repository slug that this user contributes to
	@returns {this}
	*/
	contributesRepository (slug) {
		this.ensureRepository(slug).contributes = true
		return this
	}

	/**
	Get all added github repository slugs that this fellow maintains
	@type {Array}
	*/
	get maintainedRepositories () {
		return Object.keys(this._Repositories || {}).filter((slug) => {
			const repo = this._Repositories[slug]
			return repo && repo.maintains
		})
	}

	/**
	Make note that this fellow maintains this repository slug
	@param {String} slug - The github repository slug that this user maintains
	@returns {this}
	*/
	maintainsRepository (slug) {
		this.ensureRepository(slug).maintains = true
		return this
	}

	/**
	Get all added github repository slugs that this fellow authors
	@type {Array}
	*/
	get authoredRepositories () {
		return Object.keys(this._Repositories || {}).filter((slug) => {
			const repo = this._Repositories[slug]
			return repo && repo.authors
		})
	}

	/**
	Make note that this fellow authors this repository slug
	@param {String} slug - The github repository slug that this user authors
	@returns {this}
	*/
	authorsRepository (slug) {
		this.ensureRepository(slug).authors = true
		return this
	}

}

// Export
module.exports = Fellow
