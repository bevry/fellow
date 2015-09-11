/**
A fellow with similarties to other people

@class Fellow
@constructor
*/
export default class Fellow {

	// -----------------------------------
	// Static Helpers

	/**
	Create a new Fellow instance with the value, however if the value is already a fellow instance, then just return it
	@static
	@method create
	@param {Mixed} value
	@return {Fellow} The new fellow instance
	*/
	static create (value) {
		return value instanceof this ? value : new this(value)
	}

	/**
	A singleton array attached to the class object that stores it's people objects
	@static
	@property list
	*/
	static get list () {
		if ( this._list == null )  this._list = []
		return this._list
	}

	/**
	An array of fields that will denote if the user is the same user or not when using ensure
	@protected
	@static
	@property ensureFields
	@type Array
	*/
	static get ensureFields () {
		if ( this._ensureFields == null )  this._ensureFields = ['email', 'homepage', 'githubUsername']
		return this._ensureFields
	}

	/**
	With the value, see if an existing fellow exists in our singleton list property with the value, otherwise create a new fellow instance with the value and add them to our singleton list
	@static
	@method ensure
	@param {Mixed} value  The value to create a new fellow instance or find the existing fellow instance with
	@return {Fellow} The new or existing fellow instance
	*/
	static ensure (value, add = true) {
		const newFellow = this.create(value)
		const fields = this.ensureFields
		const people = this.list
		for ( const existingFellow of people ) {
			for ( const field of fields ) {
				if ( newFellow[field] && newFellow[field] === existingFellow[field] ) {
					return existingFellow.setValue(value)
				}
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
	Get a fellow from the singleton list
	@static
	@method get
	@param {Mixed} value The value to fetch the value with
	@return {Fellow|Null} The fetched fellow, if they exist with that value
	*/
	static get (value) {
		return this.ensure(value, false)
	}

	/**
	Add a fellow or a series of people, denoted by the value, to the singleton list
	@static
	@method add
	@param {Mixed} value The fellow or people to add
	@return {Array} An array of the fellow objects for the passed people
	*/
	static add (value) {
		if ( value instanceof this ) {
			return [this.ensure(value)]
		}
		else if ( typeof value === 'string' ) {
			return value.split(/, +/).map((fellow) => {
				return this.ensure(fellow)
			})
		}
		else if ( Array.isArray(value) ) {
			return value.map((value) => {
				return this.ensure(value)
			})
		}
		else if ( value ) {
			return [this.ensure(value)]
		}
		else {
			return []
		}
	}

	// -----------------------------------
	// Properties

	/**
	@property name
	@type String
	*/
	set name (value) {
		const match = (/^((?:[0-9]+[\-\+]?)+)?(.+)$/).exec(value)
		if ( match ) {
			this.years = String(match[1] || '').trim()
			this._name = (match[2] || '').trim()
		}
	}

	get name () {
		return this._name
	}

	/**
	If the name is prefixed with a series of numbers, that is considered the year
	E.g. In `2015+ Bevry Pty Ltd` then `2015+` is the years
	E.g. In `2013-2015 Bevry Pty Ltd` then `2013-2015` is the years
	@property years
	@type String
	*/

	/**
	@property email
	@type String
	*/

	/**
	If this is a github URL, then `githubUrl` and `githubUsername` are extracted and this is not yet
	If this is not a github URL, then it is set to `homepage`
	When fetched, it will return `homepage || githubUrl || null`
	@property url
	@type String
	*/
	set url (value) {
		const githubMatch = (/^.+github.com\/([^\/]+)\/?$/).exec(value)
		if ( githubMatch ) {
			this.githubUsername = githubMatch[1]
			this.githubUrl = 'https://github.com/' + this.githubUsername
		}
		else {
			this.homepage = value
		}
	}
	get url () {
		return this.homepage || this.githubUrl
	}

	/**
	@property homepage
	@type String
	*/

	/**
	@property githubUrl
	@type String
	*/

	/**
	@property githubUsername
	@type String
	*/

	// -----------------------------------
	// Methods

	/**
	Construct our fellow instance with the value
	@method constructor
	@property {Mixed} value The value used to set the properties of the fellow, forwarded to setValue
	*/
	constructor (value) {
		this.setValue(value)
	}

	/**
	Update our fellow with the passed value
	@property {String|Object} fellow A string in the format of "Benjamin Lupton <b@lupton.cc> (https://balupton.com)" or an object with properties
	@chainable
	*/
	setValue (fellow) {
		// String format
		// Benjamin Lupton <b@lupton.cc> (https://balupton.com)
		if ( typeof fellow === 'string' ) {
			const match = (/^([^<(]+)\s*(?:<(.+?)>)?\s*(?:\((.+?)\))?$/).exec(fellow)
			if ( !match ) {
				throw new Error('Invalid fellow string')
			}
			this.name = (match[1] || '').trim() || null
			this.email = (match[2] || '').trim() || null
			this.url = (match[3] || '').trim() || null
		}

		// Object Format
		else if ( typeof fellow === 'object' ) {
			const urlFields = ['url', 'homepage', 'web', 'githubUrl']
			Object.keys(fellow).forEach((key) => {
				if ( key[0] === '_' )  return  // skip if private
				const value = fellow[key] || null
				if ( urlFields.indexOf(key) === -1 ) {
					this[key] = value
				}
				else {
					this.url = value
				}
			})
			this.name = fellow.name || null
			this.email = fellow.email || null
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
	@method ensureGithubRepository
	@param {String} slug Github repository slug (e.g. "bevry/projectz")
	@return {Object} The repository object
	*/
	ensureGithubRepository (slug) {
		if ( this._githubRepositories == null )  this._githubRepositories = {}
		if ( this._githubRepositories[slug] == null )  this._githubRepositories[slug] = {contributes: false, maintains: false, authors: false}
		return this._githubRepositories[slug]
	}

	/**
	Get all added github repository slugs that this fellow contributes to
	@property contributedGithubRepositories
	@type Array
	*/
	get contributedGithubRepositories () {
		const result = []
		Object.keys(this._githubRepositories || {}).filter((slug) => {
			const repo = this._githubRepositories[slug]
			if ( repo && repo.contributes ) {
				result.push(slug)
			}
		})
		return result
	}

	/**
	Make note that this fellow contributes to this repository slug
	@method contributesToGithubRepository
	@param {String} slug The github repository slug that this user contributes to
	@chainable
	*/
	contributesToGithubRepository (slug) {
		this.ensureGithubRepository(slug).contributes = true
		return this
	}

	/**
	Get all added github repository slugs that this fellow maintains
	@property maintainedGithubRepositories
	@type Array
	*/
	get maintainedGithubRepositories () {
		const result = []
		Object.keys(this._githubRepositories || {}).filter((slug) => {
			const repo = this._githubRepositories[slug]
			if ( repo && repo.maintains ) {
				result.push(slug)
			}
		})
		return result
	}

	/**
	Make note that this fellow maintains this repository slug
	@method maintainsGithubRepository
	@param {String} slug The github repository slug that this user maintains
	@chainable
	*/
	maintainsGithubRepository (slug) {
		this.ensureGithubRepository(slug).maintains = true
		return this
	}

	/**
	Get all added github repository slugs that this fellow authors
	@property authoredGithubRepositories
	@type Array
	*/
	get authoredGithubRepositories () {
		const result = []
		Object.keys(this._githubRepositories || {}).filter((slug) => {
			const repo = this._githubRepositories[slug]
			if ( repo && repo.authors ) {
				result.push(slug)
			}
		})
		return result
	}

	/**
	Make note that this fellow authors this repository slug
	@method authorsGithubRepository
	@param {String} slug The github repository slug that this user authors
	@chainable
	*/
	authorsGithubRepository (slug) {
		this.ensureGithubRepository(slug).authors = true
		return this
	}
}
