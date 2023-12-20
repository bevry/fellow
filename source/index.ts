/**
 * Options for formatting the rendered outputs.
 * Defaults differ for each output.
 * Not all options are relevant on all outputs.
 */
export interface FormatOptions {
	/** A string to proceed each entry */
	prefix?: string

	/** Whether or not to display {@link Fellow.url} */
	displayUrl?: boolean

	/** Whether or not to display {@link Fellow.description} */
	displayDescription?: boolean

	/** Whether or not to display {@link Fellow.email} */
	displayEmail?: boolean

	/** Whether or not to display the copright icon */
	displayCopyright?: boolean

	/** Whether or not to display {@link Fellow.years} */
	displayYears?: boolean

	/** Whether or not to display a link to the user's contributions, if used along with {@link FormatOptions.githubRepoSlug} */
	displayContributions?: boolean

	/** The repository for when using with {@link FormatOptions.displayContributions} */
	githubRepoSlug?: string

	/** An array of fields to prefer for the URL */
	urlFields?: Array<string>
}

/** GitHub Sponsors URL */
function getUsernameFromGitHubSponsorsUrl(url: string): string {
	const match = /^https?:\/\/github\.com\/sponsors\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** GitHub URL */
function getUsernameFromGitHubUrl(url: string): string {
	const match = /^https?:\/\/github\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** Gist URL */
function getUsernameFromGistUrl(url: string): string {
	const match = /^https?:\/\/gist\.github\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** GitLab URL */
function getUsernameFromGitLabUrl(url: string): string {
	const match = /^https?:\/\/gitlab\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** ThanksDev GitHub URL */
function getGitHubUsernameFromThanksDevUrl(url: string): string {
	const match = /^https?:\/\/thanks\.dev\/d\/gh\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** ThanksDev GitLab URL */
function getGitLabUsernameFromThanksDevUrl(url: string): string {
	const match = /^https?:\/\/thanks\.dev\/d\/gl\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** Facebook URL */
function getUsernameFromFacebookUrl(url: string): string {
	const match = /^https?:\/\/facebook\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** Twitter URL */
function getUsernameFromTwitterUrl(url: string): string {
	const match = /^https?:\/\/twitter\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** Patreon URL */
function getUsernameFromPatreonUrl(url: string): string {
	const match = /^https?:\/\/patreon\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** OpenCollective URL */
function getUsernameFromOpenCollectiveUrl(url: string): string {
	const match = /^https?:\/\/opencollective\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** Trim a value if it is a string */
function trim(value: any): typeof value {
	if (typeof value === 'string') {
		return value.trim()
	}
	return value
}

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

	/** A singleton attached to the class that stores it's instances to enable convergence of data */
	static readonly fellows: Array<Fellow> = []

	// -----------------------------------
	// Username and Name

	/** GitHub Username */
	githubUsername: string = ''

	/** GitLab Username */
	gitlabUsername: string = ''

	/** Twitter Username */
	twitterUsername: string = ''

	/** Facebook Username */
	facebookUsername: string = ''

	/** OpenCollective Username */
	opencollectiveUsername: string = ''

	/** Patreon Username */
	patreonUsername: string = ''

	/** Fields used to resolve {@link Fellow.username} */
	protected readonly usernameFields = [
		'githubUsername',
		'gitlabUsername',
		'twitterUsername',
		'facebookUsername',
		'opencollectiveUsername',
		'patreonUsername',
	]

	/** Get all unique resolved usernames */
	get usernames(): Array<string> {
		return this.getFields(this.usernameFields)
	}

	/** Get the first resolved {@link Fellow.usernameFields} that is truthy. */
	get username() {
		return this.getFirstField(this.usernameFields) || ''
	}

	/** Years active for the current repository, extracted from the name */
	public years: string = ''

	/** Storage of the Nomen (e.g. `Ben`, or `Benjamin Lupton`, but not `balupton`) */
	private _nomen: string = ''
	/** Get the resolved Nomen */
	get nomen() {
		// clear if not actually a nomen
		if (this.usernames.includes(this._nomen)) {
			this._nomen = ''
		}
		// return
		return this._nomen
	}
	/**
	 * If the input is prefixed with a series of numbers, that is considered the year:
	 * E.g. Given `2015+ Bevry Pty Ltd` then `2015+` is the years
	 * E.g. Given `2013-2015 Bevry Pty Ltd` then `2013-2015` is the years
	 */
	set nomen(input: string) {
		const match = /^((?:[0-9]+[-+]?)+)?(.+)$/.exec(input)
		if (match) {
			// fetch the years, but for now, discard it
			const years = String(match[1] || '').trim()
			if (years) this.years = years
			// fetch the name
			const name = trim(match[2])
			// apply if actually a nomen
			if (this.usernames.includes(name) === false) this._nomen = name
		}
	}

	/** Get {@link Follow.nomen} if resolved, otherwise {@link Fellow.username} */
	get name(): string {
		return this.nomen || this.username || ''
	}
	/** Alias for {@link Fellow.nomen} */
	set name(input: string) {
		this.nomen = input
	}

	// -----------------------------------
	// URLs

	/** Storage of the Website URL */
	private _websiteUrl: string = ''
	/** Get the resolved Website URL. Used by GitHub GraphQL API. */
	get websiteUrl() {
		return this._websiteUrl
	}
	/** Alias for {@link Fellow.url} */
	set websiteUrl(input: string) {
		this.url = input
	}
	/** Alias for {@link Fellow.websiteUrl}. Used by npm. Used by prior Fellow versions. */
	get homepage() {
		return this.websiteUrl
	}
	/** Alias for {@link Fellow.websiteUrl}. Used by npm. Used by prior Fellow versions. */
	set homepage(input: string) {
		this.websiteUrl = input
	}
	/** Alias for {@link Fellow.websiteUrl}. Used by GitHub GraphQL API. */
	get blog() {
		return this.websiteUrl
	}
	/** Alias for {@link Fellow.websiteUrl}. Used by GitHub REST API. */
	set blog(input: string) {
		this.websiteUrl = input
	}
	/** Alias for {@link Fellow.websiteUrl}. Used by GitHub GraphQL API. */
	/* eslint-disable-next-line camelcase */
	get html_url() {
		return this.websiteUrl
	}
	/** Alias for {@link Fellow.websiteUrl}. Used by GitHub REST API. */
	/* eslint-disable-next-line camelcase */
	set html_url(input: string) {
		this.websiteUrl = input
	}

	/** Get the GitHub URL from the {@link Fellow.githubUsername} */
	get githubUrl() {
		return this.githubUsername
			? `https://github.com/${this.githubUsername}`
			: ''
	}
	/** Set the GitHub URL and username from an input */
	set githubUrl(input: string) {
		const username =
			getUsernameFromGitHubSponsorsUrl(input) ||
			getUsernameFromGitHubUrl(input) ||
			getUsernameFromGistUrl(input) ||
			getGitHubUsernameFromThanksDevUrl(input)
		if (username) {
			this.githubUsername = username
		} else if (input.includes('github.com')) {
			// it is probably something like: https://github.com/apps/dependabot
			// ignore as it is not a person
		} else {
			throw new Error(`Invalid GitHub URL: ${input}`)
		}
	}

	/** Get the GitLab URL from the {@link Fellow.gitlabUsername} */
	get gitlabUrl() {
		return this.gitlabUsername
			? `https://gitlab.com/${this.gitlabUsername}`
			: ''
	}
	/** Set the GitLab URL and username from an input */
	set gitlabUrl(input: string) {
		const username =
			getUsernameFromGitLabUrl(input) ||
			getGitLabUsernameFromThanksDevUrl(input)
		if (username) {
			this.gitlabUsername = username
		} else {
			throw new Error(`Invalid GitLab URL: ${input}`)
		}
	}

	/** Get the Facebook URL from the {@link Fellow.twitterUsername} */
	get twitterUrl() {
		return this.twitterUsername
			? `https://twitter.com/${this.twitterUsername}`
			: ''
	}
	/** Set the Twitter URL and username from an input */
	set twitterUrl(input: string) {
		const username = getUsernameFromTwitterUrl(input)
		if (username) {
			this.twitterUsername = username
		} else {
			throw new Error(`Invalid Twitter URL: ${input}`)
		}
	}

	/** Get the Facebook URL from the {@link Fellow.facebookUsername} */
	get facebookUrl() {
		return this.facebookUsername
			? `https://facebook.com/${this.facebookUsername}`
			: ''
	}
	/** Set the Facebook URL and username from an input */
	set facebookUrl(input: string) {
		const username = getUsernameFromFacebookUrl(input)
		if (username) {
			this.facebookUsername = username
		} else {
			throw new Error(`Invalid Facebook URL: ${input}`)
		}
	}

	/** Get the Patreon URL from the {@link Fellow.patreonUsername} */
	get patreonUrl() {
		return this.patreonUsername
			? `https://patreon.com/${this.patreonUsername}`
			: ''
	}
	/** Set the Patreon URL and username from an input */
	set patreonUrl(input: string) {
		const username = getUsernameFromPatreonUrl(input)
		if (username) {
			this.patreonUsername = username
		} else {
			throw new Error(`Invalid Patreon URL: ${input}`)
		}
	}

	/** Get the OpenCollective URL from the {@link Fellow.opencollectiveUsername} */
	get opencollectiveUrl() {
		return this.opencollectiveUsername
			? `https://opencollective.com/${this.opencollectiveUsername}`
			: ''
	}
	/** Set the OpenCollective URL and username from an input */
	set opencollectiveUrl(input: string) {
		const username = getUsernameFromOpenCollectiveUrl(input)
		if (username) {
			this.opencollectiveUsername = username
		} else {
			throw new Error(`Invalid OpenCollective URL: ${input}`)
		}
	}

	/** Get the ThanksDev URL from the {@link Fellow.githubUsername} or {@link Fellow.gitlabUsername} */
	get thanksdevUrl() {
		return this.githubUsername
			? `https://thanks.dev/d/gh/${this.githubUsername}`
			: this.gitlabUsername
				? `https://thanks.dev/d/gl/${this.gitlabUsername}`
				: ''
	}
	/** Set the ThanksDev URL and username from an input */
	set thanksdevUrl(input: string) {
		const githubUsername = getGitHubUsernameFromThanksDevUrl(input)
		if (githubUsername) {
			this.githubUsername = githubUsername
		} else {
			const gitlabUsername = getGitLabUsernameFromThanksDevUrl(input)
			if (gitlabUsername) {
				this.gitlabUsername = gitlabUsername
			} else {
				throw new Error(`Invalid ThanksDev URL: ${input}`)
			}
		}
	}

	/** URL fields used to resolve {@link Fellow.url} */
	protected readonly urlFields = [
		'websiteUrl',
		'githubUrl',
		'gitlabUrl',
		'twitterUrl',
		'facebookUrl',
		'patreonUrl',
		'opencollectiveUrl',
		'thanksdevUrl',
	]

	/** Get all unique resolved URLs */
	get urls() {
		return this.getFields(this.urlFields)
	}

	/** Get the first resolved {@link Fellow.urlFields}. Used by GitHub GraphQL API. */
	get url() {
		return this.getFirstField(this.urlFields) || ''
	}
	/** Set the appropriate {@link Fellow.urlFields} from the input */
	set url(input: string) {
		input = trim(input)
		if (input) {
			// convert to https
			input = input.replace(/^http:\/\//, 'https://')
			// slice 1 to skip websiteUrl
			for (const field of this.urlFields) {
				// skip websiteUrl in any order, as that is our fallback
				if (field === 'websiteUrl') continue
				// attempt application of the field
				try {
					this[field] = input
					// the application was successful, it is not a websiteUrl
					return
				} catch (err: any) {
					// the application failed, try the next field
					continue
				}
			}
			// all non-websiteUrl applications failed, it must be a websiteUrl
			this._websiteUrl = input
		}
	}

	// -----------------------------------
	// Emails

	/** Emails used */
	readonly emails = new Set<string>()

	/** Fetch the first email that was applied, otherwise an empty string */
	get email() {
		for (const email of this.emails) {
			return email
		}
		return ''
	}

	/** Add the email to the set instead of replacing it */
	set email(input) {
		input = trim(input)
		if (input) {
			this.emails.add(input)
		}
	}

	// -----------------------------------
	// Description

	/** Storage of the description */
	_description: string = ''
	/** Get the resolved description */
	get description() {
		return this._description
	}
	/** Set the resolved description */
	set description(input: string) {
		input = trim(input)
		this._description = input
	}
	/** Alias for {@link Fellow.description} */
	get bio() {
		return this.description
	}
	/** Alias for {@link Fellow.description} */
	set bio(input: string) {
		this.description = input
	}

	// -----------------------------------
	// Identification

	/**
	 * An array of field names that are used to determine if two fellow's are the same.
	 * Don't need to add usernames for github, twitter, and facebook, as they will be compared via `urls`.
	 * Can't compare just username, as that is not unique unless comparison's are on the same service, hence why `urls` are used and not `usernames`.
	 */
	protected readonly idFields = ['urls', 'emails']

	/** An array of identifiers, all lowercased to prevent typestrong/TypeStrong double-ups */
	get ids() {
		const results = new Set<string>()
		for (const field of this.idFields) {
			const value = this[field]
			if (value instanceof Set || Array.isArray(value)) {
				for (const item of value) {
					results.add(item.toLowerCase())
				}
			} else {
				return String(value).toLowerCase()
			}
		}
		return Array.from(results.values()).filter(Boolean)
	}

	// -----------------------------------
	// Methods

	/**
	 * Construct our fellow instance with the value
	 * @param input The value used to set the properties of the fellow, forwarded to {@link Fellow.set}
	 */
	constructor(input: any) {
		this.set(input)
	}

	/**
	 * Update our fellow with the passed value
	 * @param fellow A string or object representation of the user
	 */
	set(fellow: string | Fellow | any) {
		// String format, e.g.
		// Benjamin Lupton <b@lupton.cc> (https://balupton.com)
		if (typeof fellow === 'string') {
			const match = /^([^<(]+)\s*(?:<(.*?)>)?\s*(?:\((.*?)\))?$/.exec(fellow)
			if (!match) {
				throw new Error('Invalid fellow string')
			}
			const name = trim(match[1])
			const email = trim(match[2])
			const url = trim(match[3])
			if (name) this.name = name
			if (email) this.email = email
			if (url) this.url = url
		}

		// Data|Fellow Format
		else if (typeof fellow === 'object') {
			Object.keys(fellow).forEach((key) => {
				if (key[0] === '_') return // skip if private
				const value = trim(fellow[key])
				if (value) this[key] = value
			})
		} else {
			throw new Error(`Invalid Fellow input: ${JSON.stringify(fellow)}`)
		}

		return this
	}

	/** Compare to another fellow for sorting. */
	compare(other: Fellow): -1 | 0 | 1 {
		const a = this.name.toLowerCase()
		const b = other.name.toLowerCase()
		if (a === b) {
			return 0
		} else if (a < b) {
			return -1
		} else {
			return 1
		}
	}

	/**
	 * Compare to another fellow for equivalency.
	 * Uses {@link Fellow.ids} for the comparison.
	 * @param other The other fellow to compare ourselves with
	 * @returns Returns `true` if they appear to be the same person, or `false` if not.
	 */
	same(other: Fellow): boolean {
		const ids = new Set(this.ids)
		const otherIds = new Set(other.ids)
		for (const id of ids) {
			if (otherIds.has(id)) {
				return true
			}
		}
		return false
	}

	// -----------------------------------
	// Static

	/**
	 * Sort a list of fellows.
	 * Uses {@link Fellow.compare} for the comparison.
	 */
	static sort(list: Array<Fellow> | Set<Fellow>) {
		if (list instanceof Set) {
			list = Array.from(list.values())
		}
		list = list.sort(comparator)
		return list
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

	/**
	 * With the value, see if an existing fellow exists in our singleton list property with the value, otherwise create a new fellow instance with the value and add them to our singleton list.
	 * Uses {@link Fellow.same} for the comparison.
	 * @param input The value to create a new fellow instance or find the existing fellow instance with
	 * @param add Whether to add the created person to the list
	 * @returns The new or existing fellow instance
	 */
	static ensure(input: any, add: boolean = true): Fellow {
		if (input instanceof Fellow && this.fellows.includes(input)) return input
		const newFellow = this.create(input)
		for (const existingFellow of this.fellows) {
			if (newFellow.same(existingFellow)) {
				return existingFellow.set(input)
			}
		}
		if (add) {
			this.fellows.push(newFellow)
			return newFellow
		} else {
			throw new Error(`Fellow does not exist: ${input}`)
		}
	}

	/**
	 * Get a fellow from the singleton list
	 * @param input The value to fetch the value with
	 * @returns The fetched fellow, if they exist with that value
	 */
	static get(input: any): Fellow {
		return this.ensure(input, false)
	}

	/**
	 * Add a fellow or a series of people, denoted by the value, to the singleton list
	 * @param inputs The fellow or people to add
	 * @returns A de-duplicated array of fellow objects for the passed people
	 */
	static add(...inputs: any[]): Array<Fellow> {
		const list = new Set<Fellow>()
		for (const input of inputs) {
			if (input instanceof this) {
				list.add(this.ensure(input))
			} else if (typeof input === 'string') {
				for (const item of input.split(/, +/)) {
					list.add(this.ensure(item))
				}
			} else if (input instanceof Set || Array.isArray(input)) {
				for (const item of input) {
					list.add(this.ensure(item))
				}
			} else if (input) {
				list.add(this.ensure(input))
			}
		}
		return Array.from(list.values())
	}

	/** Create a new Fellow instance with the value, however if the value is already a fellow instance, then just return it */
	static create(value: any) {
		return value instanceof this ? value : new this(value)
	}

	// -----------------------------------
	// Repositories

	/** Set of GitHub repository slugs that the fellow authors */
	readonly authorOfRepositories = new Set<string>()

	/** Get all fellows who author a particular GitHub repository */
	static authorsOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.authorOfRepositories.has(repoSlug)
			})
		)
	}

	/** Set of GitHub repository slugs that the fellow maintains */
	readonly maintainerOfRepositories = new Set<string>()

	/** Get all fellows who maintain a particular GitHub repository */
	static maintainersOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.maintainerOfRepositories.has(repoSlug)
			})
		)
	}

	/** Map of GitHub repository slugs to the contribution count of the user */
	readonly contributionsOfRepository = new Map<string, number>()

	/** Set of GitHub repository slugs that the fellow contributes to */
	readonly contributorOfRepositories = new Set<string>()

	/** Get all fellows who contribute to a particular GitHub repository */
	static contributorsOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.contributorOfRepositories.has(repoSlug)
			})
		)
	}

	/** Set of GitHub repository slugs that the fellow initially financed */
	readonly funderOfRepositories = new Set<string>()

	/** Get all fellows who initally financed a particular GitHub repository */
	static fundersOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.funderOfRepositories.has(repoSlug)
			})
		)
	}

	/** Set of GitHub repository slugs that the fellow actively finances */
	readonly sponsorOfRepositories = new Set<string>()

	/** Get all fellows who actively finance a particular GitHub repository */
	static sponsorsOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.sponsorOfRepositories.has(repoSlug)
			})
		)
	}

	/** Set of GitHub repository slugs that the fellow has historically financed */
	readonly donorOfRepositories = new Set<string>()

	/** Get all fellows who have historically financed a particular GitHub repository */
	static donorsOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.donorOfRepositories.has(repoSlug)
			})
		)
	}

	// @todo figure out how to calculate this
	// /** Map of GitHub repository slugs to the sponsorship amount of the user */
	// readonly sponsorships = new Map<string, number>()

	// -----------------------------------
	// Formatting

	/** Get the first field from the list that isn't empty */
	getFirstField(fields: string[]) {
		for (const field of fields) {
			const value = this[field]
			if (value) return value
		}
		return null
	}

	/** Get the all the de-duplicated fields from the list that aren't empty */
	getFields(fields: string[]) {
		const set = new Set<string>()
		for (const field of fields) {
			const value = this[field]
			if (value) set.add(value)
		}
		return Array.from(set.values())
	}

	/**
	 * Convert the fellow into the usual string format
	 * @example `NAME <EMAIL> (URL)`
	 */
	toString(format: FormatOptions = {}): string {
		const parts = []
		if (!this.name) return ''

		// copyright
		if (format.displayCopyright) parts.push('Copyright &copy;')
		if (format.displayYears && this.years) parts.push(this.years)

		// name
		parts.push(this.name)

		// email
		if (format.displayEmail !== false && this.email) {
			parts.push(`<${this.email}>`)
		}

		// url
		const url = format.urlFields
			? this.getFirstField(format.urlFields)
			: this.url
		if (url) {
			parts.push(`(${url})`)
		}

		// return
		return parts.join(' ')
	}

	/**
	 * Convert the fellow into the usual text format
	 * @example `NAME 📝 DESCRIPTION 🔗 URL`
	 */
	toText(format: FormatOptions = {}): string {
		if (!this.name) return ''
		const parts = []

		// prefix
		if (format.prefix) parts.push(format.prefix)

		// name
		parts.push(`${this.name}`)

		// email
		if (format.displayEmail && this.email) {
			parts.push(`✉️ ${this.email}`)
		}

		// description
		if (format.displayDescription !== false && this.description) {
			parts.push(`📝 ${this.description}`)
		}

		// url
		if (format.displayUrl !== false && this.url) {
			parts.push(`🔗 ${this.url}`)
		}

		// return
		return parts.join(' ')
	}

	/**
	 * Convert the fellow into the usual markdown format
	 * @example `[NAME](URL) <EMAIL>`
	 */
	toMarkdown(format: FormatOptions = {}): string {
		if (!this.name) return ''
		const parts = []

		// copyright
		if (format.displayCopyright) parts.push('Copyright &copy;')
		if (format.displayYears && this.years) parts.push(this.years)

		// name + url
		const url = format.urlFields
			? this.getFirstField(format.urlFields)
			: this.url
		if (url) parts.push(`[${this.name}](${url})`)
		else parts.push(this.name)

		// email
		if (format.displayEmail && this.email) {
			parts.push(`<${this.email}>`)
		}

		// contributions
		if (
			format.displayContributions &&
			format.githubRepoSlug &&
			this.githubUsername
		) {
			const contributionsUrl = `https://github.com/${format.githubRepoSlug}/commits?author=${this.githubUsername}`
			parts.push(
				`— [view contributions](${contributionsUrl} "View the GitHub contributions of ${this.name} on repository ${format.githubRepoSlug}")`
			)
		}

		// return
		return parts.join(' ')
	}

	/**
	 * Convert the fellow into the usual HTML format
	 */
	toHTML(format: FormatOptions = {}): string {
		if (!this.name) return ''
		const parts = []

		// copyright
		if (format.displayCopyright) parts.push('Copyright &copy;')
		if (format.displayYears && this.years) parts.push(this.years)

		// name + url
		const url = format.urlFields
			? this.getFirstField(format.urlFields)
			: this.url
		if (url) parts.push(`<a href="${url}">${this.name}</a>`)
		else parts.push(this.name)

		// email
		if (format.displayEmail && this.email) {
			parts.push(
				`<a href="mailto:${this.email}" title="Email ${this.name}">&lt;${this.email}&gt;</a>`
			)
		}

		// contributions
		if (
			format.displayContributions &&
			format.githubRepoSlug &&
			this.githubUsername
		) {
			const contributionsUrl = `https://github.com/${format.githubRepoSlug}/commits?author=${this.githubUsername}`
			parts.push(
				`— <a href="${contributionsUrl}" title="View the GitHub contributions of ${this.name} on repository ${format.githubRepoSlug}">view contributions</a>`
			)
		}

		// return
		return parts.join(' ')
	}
}
