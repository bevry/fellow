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

	/**
	Get all fellows who contribute to a particular repository
	@static
	@method contributesRepository
	@param {String} repoSlug The repository slug
	@return {Array} An array of the fellow objects that contribute to the repository
	*/
	static contributesRepository (repoSlug) {
		return this.list.filter(function (fellow) {
			return fellow.ensureRepository(repoSlug).contributes
		})
	}

	/**
	Get all fellows who maintain a particular repository
	@static
	@method maintainsRepository
	@param {String} repoSlug The repository slug
	@return {Array} An array of the fellow objects that maintain to the repository
	*/
	static maintainsRepository (repoSlug) {
		return this.list.filter(function (fellow) {
			return fellow.ensureRepository(repoSlug).maintains
		})
	}

	/**
	Get all fellows who author a particular repository
	@static
	@method authorsRepository
	@param {String} repoSlug The repository slug
	@return {Array} An array of the fellow objects that author to the repository
	*/
	static authorsRepository (repoSlug) {
		return this.list.filter(function (fellow) {
			return fellow.ensureRepository(repoSlug).authors
		})
	}


	// -----------------------------------
	// Properties

	/**
	If the name is empty, we will try to fallback to githubUsername then twitterUsername
	If the name is prefixed with a series of numbers, that is considered the year
	E.g. In `2015+ Bevry Pty Ltd` then `2015+` is the years
	E.g. In `2013-2015 Bevry Pty Ltd` then `2013-2015` is the years
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
		return this._name || this.githubUsername || this.twitterUsername || null
	}

	/**
	The years that this fellow has
	@property years
	@type String
	*/

	/**
	@property email
	@type String
	*/

	/**
	When set, will determine if it is a github, facebook, or twitter url
	If it is, then it will extract the username and url from it
	If this is not one of those urls, then it will set the homepage variable
	When fetching, it will fetch `homepage || githubUrl || facebookUrl || twitterUrl || null`
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
					this.homepage = value
				}
			}
		}
	}
	get url () {
		return this.homepage || this.githubUrl || this.facebookUrl || this.twitterUrl || null
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
					if ( urlFields.indexOf(key) === -1 ) {
						this[key] = value
					}
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
	@method ensureRepository
	@param {String} slug Github repository slug (e.g. "bevry/projectz")
	@return {Object} The repository object
	*/
	ensureRepository (slug) {
		if ( this._Repositories == null )  this._Repositories = {}
		if ( this._Repositories[slug] == null )  this._Repositories[slug] = {contributes: false, maintains: false, authors: false}
		return this._Repositories[slug]
	}

	/**
	Get all added github repository slugs that this fellow contributes to
	@property contributedRepositories
	@type Array
	*/
	get contributedRepositories () {
		const result = []
		Object.keys(this._Repositories || {}).filter((slug) => {
			const repo = this._Repositories[slug]
			if ( repo && repo.contributes ) {
				result.push(slug)
			}
		})
		return result
	}

	/**
	Make note that this fellow contributes to this repository slug
	@method contributesRepository
	@param {String} slug The github repository slug that this user contributes to
	@chainable
	*/
	contributesRepository (slug) {
		this.ensureRepository(slug).contributes = true
		return this
	}

	/**
	Get all added github repository slugs that this fellow maintains
	@property maintainedRepositories
	@type Array
	*/
	get maintainedRepositories () {
		const result = []
		Object.keys(this._Repositories || {}).filter((slug) => {
			const repo = this._Repositories[slug]
			if ( repo && repo.maintains ) {
				result.push(slug)
			}
		})
		return result
	}

	/**
	Make note that this fellow maintains this repository slug
	@method maintainsRepository
	@param {String} slug The github repository slug that this user maintains
	@chainable
	*/
	maintainsRepository (slug) {
		this.ensureRepository(slug).maintains = true
		return this
	}

	/**
	Get all added github repository slugs that this fellow authors
	@property authoredRepositories
	@type Array
	*/
	get authoredRepositories () {
		const result = []
		Object.keys(this._Repositories || {}).filter((slug) => {
			const repo = this._Repositories[slug]
			if ( repo && repo.authors ) {
				result.push(slug)
			}
		})
		return result
	}

	/**
	Make note that this fellow authors this repository slug
	@method authorsRepository
	@param {String} slug The github repository slug that this user authors
	@chainable
	*/
	authorsRepository (slug) {
		this.ensureRepository(slug).authors = true
		return this
	}
}
