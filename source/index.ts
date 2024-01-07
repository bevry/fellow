// external
import { a, ma } from '@bevry/render'

/** Verify an email */
export function verifyEmail(email: string): boolean {
	if (!email) return false
	return /.+?@.+/.test(email)
}

/** Verify a URL */
export async function fetchOk(url: string): Promise<boolean> {
	try {
		const resp = await fetch(url, { method: 'HEAD' })
		return resp.ok
	} catch (error) {
		return false
	}
}

/** Verify the failure of a URL */
export async function fetchNotOk(url: string): Promise<boolean> {
	const ok = await fetchOk(url)
	return !ok
}

/** Trim a value if it is a string */
function trim(input: any): typeof input {
	if (typeof input !== 'string') return input
	return input.trim()
}

/** Cleanup a URL for successful de-duplication */
function cleanUrl(input: any): string {
	if (typeof input !== 'string') return ''
	// strip schema to ensure https, strip www, strip trailing slashes
	return (
		`https://` +
		input
			.replace(/^.+?:[/][/]/, '')
			.replace(/^www\d*\./, '')
			.replace(/[/]+$/, '')
	)
}

/** A rendering style for {@link Fellow} */
export enum Format {
	/** Use {@link Fellow.toString} */
	string = 'string',
	/** Use {@link Fellow.toText} */
	text = 'text',
	/** Use {@link Fellow.toMarkdown} */
	markdown = 'markdown',
	/** Use {@link Fellow.toHtml} */
	html = 'html',
}

/**
 * Options for formatting the rendered outputs.
 * Defaults differ for each output.
 * Not all options are relevant on all outputs.
 */
export interface FormatOptions {
	/** When used with {@link Fellow.toFormat} this determines the format that is used. */
	format?: Format | null

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

	/** Whether or not to display a link to the user's contributions. Requires {@link FormatOptions.githubSlug} */
	displayContributions?: boolean

	/** The repository for using with {@link FormatOptions.displayContributions} */
	githubSlug?: string

	/** An array of fields to prefer for the URL. {@link Fellow.toString} will output each one. */
	urlFields?: Array<string>
}

/** Prevent GitHub username matches for the following. Generated by experience and with GitHub Copilot. */
const githubInvalidUsernames = [
	'sponsors',
	'orgs',
	'organizations',
	'about',
	'contact',
	'pricing',
	'apps',
	'marketplace',
	'nonprofit',
	'customer-stories',
	'security',
	'login',
	'join',
	'join-free',
	'business',
	'explore',
	'features',
	'topics',
	'collections',
	'trending',
	'marketplace',
	'pricing',
	'plans',
	'compare',
	'code-security',
	'enterprise',
]

/** GitHub URL */
function getUsernameFromGitHubUrl(url: string): string {
	const match = /^https?:\/\/github\.com\/([^/]+)\/?$/.exec(url)
	const username = (match && match[1]) || ''
	return username
}

/** GitHub Gist URL */
function getUsernameFromGitHubGistUrl(url: string): string {
	const match = /^https?:\/\/gist\.github\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** GitHub Sponsors URL */
function getUsernameFromGitHubSponsorsUrl(url: string): string {
	const match = /^https?:\/\/github\.com\/sponsors\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** GitHub Website URL */
function getUsernameFromGitHubWebsiteUrl(url: string): string {
	const match = /^https?:\/\/([^/]+)\.github\.io\/?$/.exec(url)
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

/** Patreon Username from Patreon URL */
function getUsernameFromPatreonUrl(url: string): string {
	const match = /^https?:\/\/patreon\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
}

/** Patreon ID from Patreon URL */
function getIdFromPatreonUrl(url: string): string {
	const match =
		/^https?:\/\/patreon\.com\/user(?:\/?(?:creators)?)\?u=([^/]+)\/?$/.exec(
			url,
		)
	return (match && match[1]) || ''
}

/** OpenCollective URL */
function getUsernameFromOpenCollectiveUrl(url: string): string {
	const match = /^https?:\/\/opencollective\.com\/([^/]+)\/?$/.exec(url)
	return (match && match[1]) || ''
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

	/** Patreon ID */
	patreonId: string = ''

	/** Fields used to resolve {@link Fellow.username} */
	protected readonly usernameFields = [
		'githubUsername',
		'gitlabUsername',
		'twitterUsername',
		'facebookUsername',
		'opencollectiveUsername',
		'patreonUsername',
		'patreonId',
	]

	/** Get all unique resolved social usernames */
	get usernames(): Array<string> {
		return this.getFields(this.usernameFields)
	}

	/** Get the first resolved {@link Fellow.usernameFields} that is truthy. */
	get username() {
		return this.getFirstField(this.usernameFields) || ''
	}

	/** Storage of the years */
	private _years: string = ''
	/** Get the resolved years: years active for the current repository, extracted from the name */
	get years() {
		return this._years
	}
	/**
	 * Set the resolved years, additive to existing years, joined by comma
	 * Correct merges of things like:
	 * 2011-2012 Benjamin Lupton <b@lupton.cc> (https://balupton.com), 2013-2015 Bevry Pty Ltd <us@bevry.me> (http://bevry.me), 2015+ Benjamin Lupton <b@lupton.cc> (https://balupton.com)
	 * into:
	 * 2011-2012,2015+ Benjamin Lupton <b@lupton.cc> (https://balupton.com), 2013-2015 Bevry Pty Ltd <us@bevry.me> (http://bevry.me)
	 */
	set years(input: string) {
		input = trim(input)
		if (!input) return
		if (this._years) {
			if (this._years.includes(input)) return
			this._years += ','
		}
		this._years += input
	}

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
		input = trim(input)
		if (!input) return
		const match = /^((?:[0-9]+[-+,]?)+)?(.+)$/.exec(input)
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

	/** Get {@link Fellow.nomen} if resolved, otherwise {@link Fellow.username} */
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
			getUsernameFromGitHubUrl(input) ||
			getUsernameFromGitHubGistUrl(input) ||
			getUsernameFromGitHubSponsorsUrl(input) ||
			getUsernameFromGitHubWebsiteUrl(input) // don't fetch from thanksdev url, as that will disable enabling the thanksdev url
		if (username) {
			if (githubInvalidUsernames.includes(username.toLowerCase())) {
				throw new Error(
					`Invalid GitHub Profile URL containing reserved namespace: ${input}`,
				)
			} else {
				this.githubUsername = username
			}
		} else if (input.includes('github.')) {
			// it is probably something like [https://github.com/apps/dependabot] which appears from contributors
			// ignore as it is not a person
		} else {
			throw new Error(`Invalid GitHub Profile URL: ${input}`)
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
		const username = getUsernameFromGitLabUrl(input) // don't fetch from thanksdev url, as that will disable enabling the thanksdev url
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

	/** Get the Patreon URL from the {@link Fellow.patreonUsername} or {@link Fellow.patreonId} */
	get patreonUrl() {
		return this.patreonUsername
			? `https://patreon.com/${this.patreonUsername}`
			: this.patreonId
				? `https://patreon.com/user?u=${this.patreonId}`
				: ''
	}
	/** Set the Patreon URL and username/id from an input */
	set patreonUrl(input: string) {
		const username = getUsernameFromPatreonUrl(input)
		if (username) {
			this.patreonUsername = username
		} else {
			const id = getIdFromPatreonUrl(input)
			if (id) {
				this.patreonId = id
			} else {
				throw new Error(`Invalid Patreon URL: ${input}`)
			}
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

	/** Store whether or not the thanksdev url is enabled */
	_thanksdevUrlEnabled: boolean = false
	/** Get the ThanksDev URL from the {@link Fellow.githubUsername} or {@link Fellow.gitlabUsername} but only if it has been explicitly set */
	get thanksdevUrl() {
		return this._thanksdevUrlEnabled === false
			? ''
			: this.githubUsername
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
			this._thanksdevUrlEnabled = true
		} else {
			const gitlabUsername = getGitLabUsernameFromThanksDevUrl(input)
			if (gitlabUsername) {
				this.gitlabUsername = gitlabUsername
				this._thanksdevUrlEnabled = true
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
		'thanksdevUrl',
		'opencollectiveUrl',
		'patreonUrl',
		'twitterUrl',
		'facebookUrl',
	]

	/** Remove invalid username urls */
	async verifyUrls(): Promise<void> {
		for (const field of this.urlFields) {
			const url = this[field]
			if (!url) continue
			switch (field) {
				case 'githubUrl':
					if (await fetchNotOk(url)) this.githubUsername = ''
					break
				case 'gitlabUrl':
					if (await fetchNotOk(url)) this.gitlabUsername = ''
					break
				case 'thanksdevUrl':
					if (await fetchNotOk(url)) this._thanksdevUrlEnabled = false
					break
				case 'opencollectiveUrl':
					if (await fetchNotOk(url)) this.opencollectiveUsername = ''
					break
				case 'patreonUrl':
					if (await fetchNotOk(url)) {
						this.patreonUsername = ''
						this.patreonId = ''
					}
					break
				case 'twitterUrl':
					if (await fetchNotOk(url)) this.twitterUsername = ''
					break
				case 'facebookUrl':
					if (await fetchNotOk(url)) this.facebookUsername = ''
					break
				default:
					// unknown, ignore
					continue
			}
		}
	}

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
		input = cleanUrl(input)
		if (input) {
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
		if (!verifyEmail(input)) return
		this.emails.add(input)
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
		if (!input) return
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
	 * Emails are most reliable, then usernames (which are only social usernames).
	 * Don't use urls as usernames already cover that as they are derived from urls, and employees/contributors often set websiteUrl to their company, which causes false de-duplications, as such urls cannot be used.
	 */
	protected readonly idFields = ['emails', 'usernames']

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
		// 2011-2012,2015+ Benjamin Lupton <b@lupton.cc> (https://balupton.com) (https://github.com/balupton): this is a description
		if (typeof fellow === 'string') {
			const match =
				/^(?<yearsAndName>[^:<(]+)\s*(?:<(?<email>.*?)>)?\s*(?<urls>(?:\(.*?\)\s*)*)\s*(?::\s*(?<description>.*))?$/.exec(
					trim(fellow),
				)
			if (!match) {
				throw new Error('Invalid fellow string')
			}

			const yearsAndName = trim(match.groups?.yearsAndName)
			if (yearsAndName) this.name = yearsAndName

			const email = trim(match.groups?.email)
			if (email) this.email = email

			const urls = (match.groups?.urls?.split(/\s+/) || [])
				.map((url) => trim(url || '').replace(/^\(|\)$/g, ''))
				.filter(Boolean)
			for (const url of urls) {
				this.url = url
			}

			const description = trim(match.groups?.description)
			if (description) this.description = description
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
	 * First checks if any of the ids match, using {@link Fellow.ids}, otherwise checks if their {@link Fellow.toString} result is the same, otherwise checks if one is only a name that matches the other.
	 * Note that `Adrian <adrian@gmail.com>, Adrian` will not be de-duplicated, as no way to tell they are the same.
	 * @param other The other fellow to compare ourselves with
	 * @returns Returns `true` if they appear to be the same person, or `false` if not.
	 */
	same(other: Fellow): boolean {
		// compare id fields (emails, usernames)
		const ids = this.ids
		const otherIds = other.ids
		for (const id of ids) {
			if (otherIds.includes(id)) {
				return true
			}
		}
		// compare overall entity (name, email, urls including homepage)
		const str = this.toString()
		const otherStr = other.toString()
		if (str === otherStr) return true
		// if one of them is only the name, do the names match?
		const name = this.name
		const otherName = other.name
		if (
			/* names are the same */
			name === otherName &&
			/* this is only a name, or other is only a name */
			(name === str || otherName === otherStr)
		)
			return true
		// no match
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
					// don't do this.ensure, as that will cause ['name: description with, comma'] being treated as CSV string 'person, person'
					// if this turns out impractical, then encode/decode [,] with [&comma;] and other such things with https://github.com/mathiasbynens/he to be comprehensive
					// the alternative is change those fields to be JSON instead of strings, and then we can save things such as contributions as well
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
			}),
		)
	}

	/** Set of GitHub repository slugs that the fellow maintains */
	readonly maintainerOfRepositories = new Set<string>()

	/** Get all fellows who maintain a particular GitHub repository */
	static maintainersOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.maintainerOfRepositories.has(repoSlug)
			}),
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
			}),
		)
	}

	/** Set of GitHub repository slugs that the fellow initially financed */
	readonly funderOfRepositories = new Set<string>()

	/** Get all fellows who initally financed a particular GitHub repository */
	static fundersOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.funderOfRepositories.has(repoSlug)
			}),
		)
	}

	/** Set of GitHub repository slugs that the fellow actively finances */
	readonly sponsorOfRepositories = new Set<string>()

	/** Get all fellows who actively finance a particular GitHub repository */
	static sponsorsOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.sponsorOfRepositories.has(repoSlug)
			}),
		)
	}

	/** Set of GitHub repository slugs that the fellow has historically financed */
	readonly donorOfRepositories = new Set<string>()

	/** Get all fellows who have historically financed a particular GitHub repository */
	static donorsOfRepository(repoSlug: string): Array<Fellow> {
		return this.sort(
			this.fellows.filter(function (fellow) {
				return fellow.donorOfRepositories.has(repoSlug)
			}),
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
	toString(opts: FormatOptions = {}): string {
		if (!this.name) return ''
		const parts = []

		// copyright
		if (opts.displayCopyright) parts.push('Copyright &copy;')
		if (opts.displayYears && this.years) parts.push(this.years)

		// name
		parts.push(this.name)

		// email
		if (opts.displayEmail !== false && this.email) {
			parts.push(`<${this.email}>`)
		}

		// urls
		const urls = opts.urlFields?.length
			? this.getFields(opts.urlFields)
			: this.urls
		for (const url of urls) {
			parts.push(`(${url})`)
		}

		// add description without space before :, and return
		let result = parts.join(' ')
		if (opts.displayDescription && this.description) {
			result += `: ${this.description}`
		}
		return result
	}

	/**
	 * Convert the fellow into the usual text format
	 * @example `NAME 📝 DESCRIPTION 🔗 URL`
	 */
	toText(opts: FormatOptions = {}): string {
		if (!this.name) return ''
		const parts = []

		// name
		parts.push(`${this.name}`)

		// email
		if (opts.displayEmail && this.email) {
			parts.push(`✉️ ${this.email}`)
		}

		// description
		if (opts.displayDescription !== false && this.description) {
			parts.push(`📝 ${this.description}`)
		}

		// url
		const url =
			opts.displayUrl === false
				? ''
				: opts.urlFields?.length
					? this.getFirstField(opts.urlFields)
					: this.url
		if (url) parts.push(`🔗 ${this.url}`)

		// return
		return parts.join(' ')
	}

	/**
	 * Convert the fellow into the usual markdown format
	 * @example `[NAME](URL) <EMAIL>`
	 */
	toMarkdown(opts: FormatOptions = {}): string {
		if (!this.name) return ''
		const parts = []

		// copyright
		if (opts.displayCopyright) parts.push('Copyright &copy;')
		if (opts.displayYears && this.years) parts.push(this.years)

		// name + url
		const url =
			opts.displayUrl === false
				? ''
				: opts.urlFields?.length
					? this.getFirstField(opts.urlFields)
					: this.url
		if (url) parts.push(ma({ url, inner: this.name }))
		else parts.push(this.name)

		// email
		if (opts.displayEmail && this.email) {
			parts.push(`<${this.email}>`)
		}

		// contributions
		if (opts.displayContributions && opts.githubSlug && this.githubUsername) {
			const contributionsUrl = `https://github.com/${opts.githubSlug}/commits?author=${this.githubUsername}`
			parts.push(
				'— ' +
					ma({
						url: contributionsUrl,
						inner: 'view contributions',
						title: `View the GitHub contributions of ${this.name} on repository ${opts.githubSlug}`,
					}),
			)
		}

		// description
		if (opts.displayDescription && this.description) {
			parts.push(`— ${this.description}`)
		}

		// return
		return parts.join(' ')
	}

	/** Convert the fellow into the usual HTML format */
	toHtml(opts: FormatOptions = {}): string {
		if (!this.name) return ''
		const parts = []

		// copyright
		if (opts.displayCopyright) parts.push('Copyright &copy;')
		if (opts.displayYears && this.years) parts.push(this.years)

		// name + url
		const url =
			opts.displayUrl === false
				? ''
				: opts.urlFields?.length
					? this.getFirstField(opts.urlFields)
					: this.url
		if (url) parts.push(a({ url, inner: this.name }))
		else parts.push(this.name)

		// email
		if (opts.displayEmail && this.email) {
			parts.push(
				a({
					url: `mailto:${this.email}`,
					inner: `&lt;${this.email}&gt;`,
					title: `Email ${this.name}`,
				}),
			)
		}

		// contributions
		if (opts.displayContributions && opts.githubSlug && this.githubUsername) {
			const contributionsUrl = `https://github.com/${opts.githubSlug}/commits?author=${this.githubUsername}`
			parts.push(
				'— ' +
					a({
						url: contributionsUrl,
						inner: 'view contributions',
						title: `View the GitHub contributions of ${this.name} on repository ${opts.githubSlug}`,
					}),
			)
		}

		// description
		if (opts.displayDescription && this.description) {
			parts.push(`— ${this.description}`)
		}

		// return
		return parts.join(' ')
	}

	/** Convert the fellow into the specified format */
	toFormat(opts: FormatOptions & { format: Format }): string {
		switch (opts.format) {
			case Format.string:
				return this.toString(opts)
			case Format.text:
				return this.toText(opts)
			case Format.markdown:
				return this.toMarkdown(opts)
			case Format.html:
				return this.toHtml(opts)
			default:
				throw new Error(`Invalid format: ${opts.format}`)
		}
	}
}
