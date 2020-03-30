// Import
import { suite } from 'kava'
import { equal, deepEqual, nullish } from 'assert-helpers'
import Fellow from './'

// Tests
suite('fellow', function (suite, test) {
	const name = 'Benjamin Lupton',
		email = 'b@lupton.cc',
		homepage = 'https://balupton.com',
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
			'additional email was added'
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
		nullish(fellow.homepage, 'homepage is empty as it was not set')

		// formats
		equal(fellow.toString(), text, 'string data is correct')
		equal(
			fellow.toMarkdown(),
			`[${name}](${githubUrl}) <${email}>`,
			'markdown data is correct'
		)
	})

	test('create instance with invalid email and url', function () {
		const text = `${name} <> ()`
		const fellow = new Fellow(text)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, '', 'email is correct')
		equal(fellow.url, '', 'url is correct')

		// formats
		equal(fellow.toString(), name, 'string data is correct')
		equal(fellow.toMarkdown(), name, 'markdown data is correct')
	})

	test('create instance with string value and homepage', function () {
		const fellow = new Fellow(`${name} <${email}> (${homepage})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepage, 'url is correct')
		equal(fellow.homepage, homepage, 'homepage is correct')
		nullish(fellow.githubUrl, 'githubUrl is empty as it was not set')

		// test homepage variation handling
		deepEqual(
			Array.from(fellow.urls),
			[homepage, homepageUnencrypted],
			'urls are correct'
		)
		fellow.homepage = homepageUnencrypted
		equal(
			fellow.homepage,
			homepageUnencrypted,
			'homepageUnencrypted is correct'
		)
		deepEqual(
			Array.from(fellow.urls),
			[homepage, homepageUnencrypted],
			'urls are correct'
		)
	})

	test('create instance via Fellow.create with string value and homepage', function () {
		const fellow = Fellow.create(`${name} <${email}> (${homepage})`)
		equal(
			fellow instanceof Fellow,
			true,
			'fellow via Fellow.create was a fellow instance'
		)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepage, 'url is correct')
		equal(fellow.homepage, homepage, 'homepage is correct')
		nullish(fellow.githubUrl, 'githubUrl is empty as it was not set')
	})

	test('create instance with string value then be able to update it', function () {
		const fellow = new Fellow(`${name} <${email}> (${githubUrl})`)

		fellow.set(`${name} <${email}> (${homepage})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepage, 'url was updated to the homepage')
		equal(fellow.homepage, homepage, 'homepage was updated to the homepage')
		equal(fellow.githubUrl, githubUrl, 'githubUrl is still present')

		fellow.set(`${name} <${email}> (${githubUrl})`)
		equal(fellow.url, homepage, 'url stayed as the the homepage')
		equal(fellow.homepage, homepage, 'homepage stayed as the homepage')
		equal(fellow.githubUrl, githubUrl, 'githubUrl stayed as the githubUrl')
	})

	suite('singleton', function (suite, test) {
		test('ensure first instance into the singleton', function () {
			const fellow = Fellow.create(`${name} <${email}> (${homepage})`)
			let fellows = Fellow.add(fellow)
			equal(fellows[0], fellow, 'added fellow was as expected')
			equal(Fellow.fellows[0], fellow, 'added fellow was in singleton')
			equal(Fellow.fellows.length, 1, 'only the one fellow was added')

			fellows = Fellow.add(fellow)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 1.1')
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 1.1'
			)

			fellows = [Fellow.ensure(fellow)]
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 1.2'
			)
			equal(fellows[0], fellow, 'fetched fellow was the previous fellow, 1.2')

			fellows = Fellow.add(`${name} <${email}> (${githubUrl})`)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 2')
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 2'
			)
			equal(fellow.githubUrl, githubUrl, 'githubUrl has now been set, 2')
			equal(fellow.homepage, homepage, 'homepage stayed as the homepage, 2')

			fellows = Fellow.add({ name: 'Ben Lupton', email: 'b@lupton.cc' })
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 3')
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 3'
			)
			equal(fellow.name, 'Ben Lupton', 'name has been updated, 3')

			fellows = Fellow.add([{ name: 'Bennie Lupton', email: 'b@lupton.cc' }])
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 4')
			equal(
				Fellow.fellows.length,
				1,
				'only the one fellow was added, no duplicates were added, 4'
			)
			equal(fellow.name, 'Bennie Lupton', 'name has been updated 4')

			fellows = Fellow.add([{ name: 'Bob' }, { name: 'Joe' }])
			equal(fellows.length, 2, 'two fellows were returned')
			equal(fellows[0].name, 'Bob')
			equal(fellows[1].name, 'Joe')
			equal(Fellow.fellows.length, 3, 'three fellows now exist')
			equal(Fellow.fellows[1].name, 'Bob')
			equal(Fellow.fellows[2].name, 'Joe')

			fellows = Fellow.add(`${name} <${email}> (${homepage})`)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 5')
			equal(
				Fellow.fellows.length,
				3,
				'three fellows still exist, a new one was not added, 5'
			)
			equal(fellow.homepage, homepage, 'homepage stayed as the homepage, 5')
			equal(fellow.githubUrl, githubUrl, 'githubUrl stayed as the homepage, 5')
		})
	})

	suite('repositories', function (suite, test) {
		test('fellow can contribute to repos', function () {
			Fellow.get({ email: 'b@lupton.cc' }).contributedRepositories.add(
				'bevry/projectz'
			)
			deepEqual(
				Fellow.contributesRepository('bevry/projectz').map(
					(fellow) => fellow.email
				),
				['b@lupton.cc'],
				'returns expected users'
			)
		})

		test('fellow can maintain repos', function () {
			Fellow.get({ email: 'b@lupton.cc' }).maintainedRepositories.add(
				'bevry/projectz'
			)
			deepEqual(
				Fellow.maintainsRepository('bevry/projectz').map(
					(fellow) => fellow.email
				),
				['b@lupton.cc'],
				'returns expected users'
			)
		})

		test('fellow can author repos', function () {
			Fellow.get({ email: 'b@lupton.cc' }).authoredRepositories.add(
				'bevry/projectz'
			)
			deepEqual(
				Fellow.maintainsRepository('bevry/projectz').map(
					(fellow) => fellow.email
				),
				['b@lupton.cc'],
				'returns expected users'
			)
		})
	})
})
