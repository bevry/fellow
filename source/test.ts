// Import
import kava from 'kava'
import { equal, deepEqual } from 'assert-helpers'
import Fellow, { FormatOptions } from './index.js'

const showEmail: FormatOptions = { displayEmail: true }

// Tests
kava.suite('fellow', function (suite, test) {
	const name = 'Benjamin Lupton',
		email = 'b@lupton.cc',
		homepageEncrypted = 'https://balupton.com',
		homepageUnencrypted = 'http://balupton.com',
		githubUrl = 'https://github.com/balupton'

	test('create instance with string value', function () {
		const fellow = new Fellow(`${name} <${email}>`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')

		fellow.email = 'bennie@lupton.cc'
		deepEqual(
			Array.from(fellow.emails),
			[email, 'bennie@lupton.cc'],
			'additional email was added',
		)
		equal(fellow.email, email, 'first email remails primary')
	})

	test('create instance with string value and githubUrl', function () {
		const text = `${name} <${email}> (${githubUrl})`
		const fellow = new Fellow(text)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, githubUrl, 'url is correct')
		equal(fellow.githubUrl, githubUrl, 'githubUrl is correct')
		equal(fellow.homepage, '', 'homepage is empty as it was not set')

		// formats
		equal(fellow.toString(showEmail), text, 'string data is correct')
		equal(
			fellow.toMarkdown(showEmail),
			`[${name}](${githubUrl}) <${email}>`,
			'markdown data is correct',
		)
	})

	test('create instance with invalid email and url', function () {
		const text = `${name} <> ()`
		const fellow = new Fellow(text)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, '', 'email is correct')
		equal(fellow.url, '', 'url is correct')

		// formats
		equal(fellow.toString(showEmail), name, 'string data is correct')
		equal(fellow.toMarkdown(showEmail), name, 'markdown data is correct')
	})

	test('create instance with string value and homepage', function () {
		const fellow = new Fellow(`${name} <${email}> (${homepageEncrypted})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepageEncrypted, 'url is correct')
		equal(fellow.homepage, homepageEncrypted, 'homepage is correct')
		equal(fellow.githubUrl, '', 'githubUrl is empty as it was not set')

		// test homepage variation handling
		deepEqual(Array.from(fellow.urls), [homepageEncrypted], 'urls are correct')
		fellow.homepage = homepageUnencrypted
		equal(fellow.homepage, homepageEncrypted, 'homepageUnencrypted is correct')
		deepEqual(Array.from(fellow.urls), [homepageEncrypted], 'urls are correct')
	})

	test('create instance via Fellow.create with string value and homepage', function () {
		const fellow = Fellow.create(`${name} <${email}> (${homepageEncrypted})`)
		equal(
			fellow instanceof Fellow,
			true,
			'fellow via Fellow.create was a fellow instance',
		)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepageEncrypted, 'url is correct')
		equal(fellow.homepage, homepageEncrypted, 'homepage is correct')
		equal(fellow.githubUrl, '', 'githubUrl is empty as it was not set')
	})

	test('multiple years, urls, and description', function () {
		const fellow = new Fellow(
			'2011-2012,2015+ Bob <bob@bob.com> (https://bob.com) (https://github.com/bob): this is my description',
		)
		deepEqual(
			fellow.urls,
			['https://bob.com', 'https://github.com/bob'],
			'urls were parsed correctly',
		)
		equal(
			fellow.githubUsername,
			'bob',
			'githubUsername was extracted from the additional url correctly',
		)
		equal(
			fellow.description,
			'this is my description',
			'description was extracted correctly',
		)
		// additional description methods
		equal(
			new Fellow(
				'2011-2012,2015+ Bob <bob@bob.com> (https://bob.com): this is my description',
			).description,
			'this is my description',
			'description was extracted correctly',
		)
		equal(
			new Fellow('2011-2012,2015+ Bob <bob@bob.com>: this is my description')
				.description,
			'this is my description',
			'description was extracted correctly',
		)
		equal(
			new Fellow('2011-2012,2015+ Bob: this is my description').description,
			'this is my description',
			'description was extracted correctly',
		)
		equal(
			new Fellow('2011-2012,2015+ Bob:this is my description').description,
			'this is my description',
			'description was extracted correctly',
		)
	})

	test('create instance with string value then be able to update it', function () {
		const fellow = new Fellow(`${name} <${email}> (${githubUrl})`)

		fellow.set(`${name} <${email}> (${homepageEncrypted})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepageEncrypted, 'url was updated to the homepage')
		equal(
			fellow.homepage,
			homepageEncrypted,
			'homepage was updated to the homepage',
		)
		equal(fellow.githubUrl, githubUrl, 'githubUrl is still present')
		equal(
			fellow.toString({ displayEmail: true }),
			`${name} <${email}> (${homepageEncrypted}) (${githubUrl})`,
			'toString worked as expected',
		)

		// as we now have a distinct homepage from github url, verify get first field works correctly
		equal(
			fellow.getFirstField(['githubUrl', 'url']),
			githubUrl,
			'getFirstField worked as expected',
		)
		equal(
			fellow.toString({ displayEmail: true, urlFields: ['githubUrl', 'url'] }),
			`${name} <${email}> (${githubUrl}) (${homepageEncrypted})`,
			'toString:urlFields worked as expected',
		)

		fellow.set(`${name} <${email}> (${githubUrl})`)
		equal(fellow.url, homepageEncrypted, 'url stayed as the the homepage')
		equal(fellow.homepage, homepageEncrypted, 'homepage stayed as the homepage')
		equal(fellow.githubUrl, githubUrl, 'githubUrl stayed as the githubUrl')
	})

	suite('singleton', function (suite, test) {
		test('ensure first instance into the singleton', function () {
			const fellow = Fellow.create(`${name} <${email}> (${homepageEncrypted})`)
			let fellows = Fellow.add(fellow)
			equal(fellows[0], fellow, 'added fellow was as expected')
			equal(Fellow.fellows[0], fellow, 'added fellow was in singleton')
			equal(Fellow.fellows.length, 1, 'only the one fellow was added')

			fellows = Fellow.add(fellow)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 1.1')
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 1.1',
			)

			fellows = [Fellow.ensure(fellow)]
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 1.2',
			)
			equal(fellows[0], fellow, 'fetched fellow was the previous fellow, 1.2')

			fellows = Fellow.add(`${name} <${email}> (${githubUrl})`)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 2')
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 2',
			)
			equal(fellow.githubUrl, githubUrl, 'githubUrl has now been set, 2')
			equal(
				fellow.homepage,
				homepageEncrypted,
				'homepage stayed as the homepage, 2',
			)

			fellows = Fellow.add({ name: 'Ben Lupton', email: 'b@lupton.cc' })
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 3')
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 3',
			)
			equal(fellow.name, 'Ben Lupton', 'name has been updated, 3')

			fellows = Fellow.add([{ name: 'Bennie Lupton', email: 'b@lupton.cc' }])
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 4')
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 4',
			)
			equal(fellow.name, 'Bennie Lupton', 'name has been updated 4')

			fellows = Fellow.add([{ name: 'Bob' }, { name: 'Joe' }])
			equal(fellows.length, 2, 'two fellows were returned')
			equal(fellows[0].name, 'Bob')
			equal(fellows[1].name, 'Joe')
			equal(Fellow.fellows.length, 3, 'three fellows now exist')
			equal(Fellow.fellows[1].name, 'Bob')
			equal(Fellow.fellows[2].name, 'Joe')

			fellows = Fellow.add(`${name} <${email}> (${homepageEncrypted})`)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 5')
			equal(
				Fellow.fellows.length,
				3,
				'three fellows still exist, a new one was not added, 5',
			)
			equal(
				fellow.homepage,
				homepageEncrypted,
				'homepage stayed as the homepage, 5',
			)
			equal(fellow.githubUrl, githubUrl, 'githubUrl stayed as the homepage, 5')
		})
	})

	// use bob to note interfere with the earlier singleton tests
	test('merge authors with years', function () {
		const result = Fellow.add(
			'2011-2012 Bob <bob@bob.com> (https://bob.com), 2013-2015 Bob Pty Ltd <us@bob.me> (http://bob.me), 2015+ Bob <bob@bob.com> (https://bob.com)',
		)
		equal(result.length, 2, 'only two fellows were returned')
		equal(result[0].years, '2011-2012,2015+', 'years were merged')
		const fellow = new Fellow(result[0].toString({ displayYears: true }))
		equal(
			fellow.years,
			'2011-2012,2015+',
			'merged years were kept after recreation',
		)
	})

	suite('repositories', function (suite, test) {
		test('fellow can contribute to repos', function () {
			Fellow.get({ email: 'b@lupton.cc' }).contributorOfRepositories.add(
				'bevry/projectz',
			)
			deepEqual(
				Fellow.contributorsOfRepository('bevry/projectz').map(
					(fellow) => fellow.email,
				),
				['b@lupton.cc'],
				'returns expected users',
			)
		})

		test('fellow can maintain repos', function () {
			Fellow.get({ email: 'b@lupton.cc' }).maintainerOfRepositories.add(
				'bevry/projectz',
			)
			deepEqual(
				Fellow.maintainersOfRepository('bevry/projectz').map(
					(fellow) => fellow.email,
				),
				['b@lupton.cc'],
				'returns expected users',
			)
		})

		test('fellow can author repos', function () {
			Fellow.get({ email: 'b@lupton.cc' }).authorOfRepositories.add(
				'bevry/projectz',
			)
			deepEqual(
				Fellow.authorsOfRepository('bevry/projectz').map(
					(fellow) => fellow.email,
				),
				['b@lupton.cc'],
				'returns expected users',
			)
		})
	})
})
