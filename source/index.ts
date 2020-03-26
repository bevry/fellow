/** Comparator for sorting fellows in an array */
export function comparator(a: Fellow, b: Fellow) {
	return a.compare(b)
}

/** A fellow with similarties to other people */
export default class Fellow {
	// -----------------------------------
	// Properties

	/** Note that any property can be assigned directly to fellow */
	[key: string]: any

	/** Actual name that is stored, otherwise falls back to username from the url fields */
	private _name?: string

	/** URLs used */
	readonly urls = new Set<string>()

	/** Emails used */
	readonly emails = new Set<string>()

	/** Set of repository slugs with the contributions from the user */
	readonly contributions = new Map<string, number>()

	/** Set of repository slugs that the fellow administers to */
	readonly administeredRepositories = new Set<string>()

	/** Set of repository slugs that the fellow contributes to */
	readonly contributedRepositories = new Set<string>()

	/** Set of repository slugs that the fellow maintains */
	readonly maintainedRepositories = new Set<string>()

	/** Set of repository slugs that the fellow authors */
	readonly authoredRepositories = new Set<string>()

	/**
	 * An array of field names that are used to determine if two fellow's are the same.
	 * Don't need to add usernames for github, twitter, and facebook, as they will be compared via `urls`.
	 * Can't compare just username, as that is not unique unless comparison's are on the same service, hence why `urls` are used and not `usernames`.
	 */
	protected readonly idFields = ['urls', 'emails']

	/** An array of field names that are used to determine the fellow's URL */
	protected readonly urlFields = [
		'url',
		'homepage',
		'web',
		'githubUrl',
		'twitterUrl',
		'facebookUrl',
	]

	/** A singleton attached to the class that stores it's instances to enable convergence of data */
	static readonly fellows: Array<Fellow> = []

	// -----------------------------------
	// Methods

	/**
	 * Sort a list of fellows.
	 * Uses {@link Fellow::sort} for the comparison.
	 */
	static sort(list: Array<Fellow>) {
		return list.sort(comparator)
	}

	/** Flatten lists of fellows into one set of fellows */
	static flatten(lists: Array<Array<Fellow> | Set<Fellow>>): Set<Fellow> {
		const fellows = new Set<Fellow>()
		for (const list of lists) {
			for (const fellow of list) {
				fellows.add(fellow)
			}
		}
		return fellows
	}

	/** Compare to another fellow for sorting. */
	compare(other: Fellow): -1 | 0 | 1 {
		const A = this.name.toLowerCase()
		const B = other.name.toLowerCase()
		if (A === B) {
			return 0
		} else if (A < B) {
			return -1
		} else {
			return 1
		}
	}

	/**
	 * Compare to another fellow for equivalancy.
	 * Uses {@link Fellow::idFields} for the comparison.
	 * @param other The other fellow to compare ourselves with
	 * @returns Returns `true` if they appear to be the same person, or `false` if not.
	 */
	same(other: Fellow): boolean {
		for (const field of this.idFields) {
			const value = this[field]
			const otherValue = other[field]

			if (value && otherValue) {
				if (value instanceof Set && otherValue instanceof Set) {
					for (const item of value) {
						if (otherValue.has(item)) {
							return true
						}
					}
				} else if (Array.isArray(value) && Array.isArray(otherValue)) {
					for (const item of value) {
						if (otherValue.includes(item)) {
							return true
						}
					}
				} else if (value === otherValue) {
					return true
				}
			}
		}
		return false
	}

	/**
	 * With the value, see if an existing fellow exists in our singleton list property with the value, otherwise create a new fellow instance with the value and add them to our singleton list.
	 * Uses {@link Fellow::same} for the comparison.
	 * @param value The value to create a new fellow instance or find the existing fellow instance with
	 * @param add Whether to add the created person to the list
	 * @returns The new or existing fellow instance
	 */
	static ensure(value: any, add: boolean = true): Fellow {
		const newFellow = this.create(value)
		for (const existingFellow of this.fellows) {
			if (newFellow.same(existingFellow)) {
				return existingFellow.set(value)
			}
		}
		if (add) {
			this.fellows.push(newFellow)
			return newFellow
		} else {
			throw new Error(`Fellow by ${value} does not exist`)
		}
	}

	/**
	 * Get a fellow from the singleton list
	 * @param value The value to fetch the value with
	 * @returns The fetched fellow, if they exist with that value
	 */
	static get(value: any): Fellow {
		return this.ensure(value, false)
	}

	/**
	 * Add a fellow or a series of people, denoted by the value, to the singleton list
	 * @param value The fellow or people to add
	 * @returns An array of the fellow objects for the passed people
	 */
	static add(value: any): Array<Fellow> {
		if (value instanceof this) {
			return [this.ensure(value)]
		} else if (typeof value === 'string') {
			return value.split(/, +/).map((fellow) => this.ensure(fellow))
		} else if (Array.isArray(value)) {
			return value.map((value) => this.ensure(value))
		} else if (value) {
			return [this.ensure(value)]
		} else {
			return []
		}
	}

	/** Create a new Fellow instance with the value, however if the value is already a fellow instance, then just return it */
	static create(value: any) {
		return value instanceof this ? value : new this(value)
	}

	/**
	 * Construct our fellow instance with the value
	 * @param value The value used to set the properties of the fellow, forwarded to {@link Fellow::set}
	 */
	constructor(value: any) {
		this.set(value)
	}

	/**
	 * Update our fellow with the passed value
	 * @param fellow A string or object representation of the user
	 */
	set(fellow: string | Fellow | any) {
		// String format, e.g.
		// Benjamin Lupton <b@lupton.cc> (https://balupton.com)
		if (typeof fellow === 'string') {
			const match = /^([^<(]+)\s*(?:<(.+?)>)?\s*(?:\((.+?)\))?$/.exec(fellow)
			if (!match) {
				throw new Error('Invalid fellow string')
			}
			const name = (match[1] || '').trim()
			const email = (match[2] || '').trim()
			const url = (match[3] || '').trim()
			if (name) this.name = name
			if (email) this.email = email
			if (url) this.url = url
		}

		// Data|Fellow Format
		else if (typeof fellow === 'object') {
			Object.keys(fellow).forEach((key) => {
				if (key[0] === '_') return // skip if private
				const value = fellow[key] || null
				if (value) {
					// if any of the url fields, redirect to url setter
					if (this.urlFields.includes(key)) {
						this.url = value
					}
					// if not a url field, e.g. name or email
					else {
						this[key] = value
					}
				}
			})
		} else {
			throw new Error('Invalid fellow input')
		}

		return this
	}

	// -----------------------------------
	// Accessors

	/**
	 * If the name is empty, we will try to fallback to githubUsername then twitterUsername
	 * If the name is prefixed with a series of numbers, that is considered the year
	 * E.g. In `2015+ Bevry Pty Ltd` then `2015+` is the years
	 * E.g. In `2013-2015 Bevry Pty Ltd` then `2013-2015` is the years
	 */
	set name(value /* :string */) {
		const match = /^((?:[0-9]+[-+]?)+)?(.+)$/.exec(value)
		if (match) {
			// fetch the years, but for now, discard it
			const years = String(match[1] || '').trim() || ''
			// fetch the name, and apply it
			const name = match[2].trim() || ''
			if (name) this._name = name
		}
	}

	/**
	 * Fetch the user's name, otherwise their usernames
	 */
	get name(): string {
		return (
			this._name ||
			this.githubUsername ||
			this.twitterUsername ||
			this.facebookUsername ||
			''
		)
	}

	/** Add the email to the set instead of replacing it */
	set email(value) {
		if (value) {
			this.emails.add(value)
		}
	}

	/** Fetch the first email that was applied, otherwise an empty string */
	get email() {
		for (const email of this.emails) {
			return email
		}
		return ''
	}

	/**
	 * Will determine if the passed URL is a github, facebook, or twitter URL.
	 * If it is, then it will extract the username and url from it.
	 * If it was not, then it will set the homepage variable.
	 */
	set url(input: string) {
		if (input) {
			let url: string
			// github
			const githubMatch = /^.+github.com\/([^/]+)\/?$/.exec(input)
			if (githubMatch) {
				this.githubUsername = githubMatch[1]
				url = this.githubUrl = 'https://github.com/' + this.githubUsername
			} else {
				const facebookMatch = /^.+facebook.com\/([^/]+)\/?$/.exec(input)
				if (facebookMatch) {
					this.facebookUsername = facebookMatch[1]
					url = this.facebookUrl =
						'https://facebook.com/' + this.facebookUsername
				} else {
					const twitterMatch = /^.+twitter.com\/([^/]+)\/?$/.exec(input)
					if (twitterMatch) {
						this.twitterUsername = twitterMatch[1]
						url = this.twitterUrl =
							'https://twitter.com/' + this.twitterUsername
					} else {
						url = this.homepage = input
					}
				}
			}
			// add url in encrypted and unecrypted forms to urls
			this.urls.add(url.replace(/^http:/, 'https:'))
			this.urls.add(url.replace(/^https:/, 'http:'))
		}
	}

	/** Fetch the homepage with fallback to one of the service URLs if available */
	get url() {
		return (
			this.homepage ||
			this.githubUrl ||
			this.facebookUrl ||
			this.twitterUrl ||
			''
		)
	}

	// -----------------------------------
	// Repositories

	/** Get all fellows who administrate a particular repository */
	static administersRepository(repoSlug: string): Array<Fellow> {
		return this.fellows.filter(function (fellow) {
			return fellow.administeredRepositories.has(repoSlug)
		})
	}
	/** Get all fellows who contribute to a particular repository */
	static contributesRepository(repoSlug: string): Array<Fellow> {
		return this.fellows.filter(function (fellow) {
			return fellow.contributedRepositories.has(repoSlug)
		})
	}

	/** Get all fellows who maintain a particular repository */
	static maintainsRepository(repoSlug: string): Array<Fellow> {
		return this.fellows.filter(function (fellow) {
			return fellow.maintainedRepositories.has(repoSlug)
		})
	}

	/** Get all fellows who author a particular repository */
	static authorsRepository(repoSlug: string): Array<Fellow> {
		return this.fellows.filter(function (fellow) {
			return fellow.authoredRepositories.has(repoSlug)
		})
	}

	// -----------------------------------
	// Formats

	/**
	 * Convert the fellow into the usual string format
	 * @example `NAME <EMAIL> (URL)`
	 */
	toString(): string {
		const parts = []
		if (this.name) {
			parts.push(this.name)
			if (this.email) {
				parts.push(`<${this.email}>`)
			}
			parts.push(`(${this.url})`)
		}
		return parts.join(' ')
	}

	/**
	 * Convert the fellow into the usual markdown format
	 * @example `[NAME](URL) <EMAIL>`
	 */
	toMarkdown(): string {
		const parts = []
		if (this.name) {
			if (this.url) parts.push(`[${this.name}](${this.url})`)
			else parts.push(this.name)
		}
		if (this.email) {
			parts.push(`<${this.email}>`)
		}
		return parts.join(' ')
	}
}
