'use strict'

// Import
const kava = require('kava')
const { equal, deepEqual, nullish } = require('assert-helpers')
const Fellow = require('./')

// Tests
kava.suite('fellow', function (suite, test) {
	const name = 'Benjamin Lupton',
		email = 'b@lupton.cc',
		homepage = 'https://balupton.com',
		homepage2 = 'http://balupton.com',
		githubUrl = 'https://github.com/balupton'

	test('create instance with string value', function () {
		const fellow = new Fellow(`${name} <${email}>`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		deepEqual(fellow.json, { emails: [email], name }, 'json data is correct')

		fellow.email = 'bennie@lupton.cc'
		equal(fellow.email, 'bennie@lupton.cc', 'updated email is correct')
		deepEqual(
			fellow.emails,
			['bennie@lupton.cc', email],
			'updated emails are correct'
		)

		fellow.email = email
		equal(fellow.email, email, 'reverted email is correct')
		deepEqual(
			fellow.emails,
			[email, 'bennie@lupton.cc'],
			'reverted emails are correct'
		)
	})

	test('create instance with string value and githubUrl', function () {
		const fellow = new Fellow(`${name} <${email}> (${githubUrl})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, githubUrl, 'url is correct')
		equal(fellow.githubUrl, githubUrl, 'githubUrl is correct')
		nullish(fellow.homepage, 'homepage is empty as it was not set')
	})

	test('create instance with string value and homepage', function () {
		const fellow = new Fellow(`${name} <${email}> (${homepage})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepage2, 'url is correct')
		equal(fellow.homepage, homepage2, 'homepage is correct')
		nullish(fellow.githubUrl, 'githubUrl is empty as it was not set')
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
		equal(fellow.url, homepage2, 'url is correct')
		equal(fellow.homepage, homepage2, 'homepage is correct')
		nullish(fellow.githubUrl, 'githubUrl is empty as it was not set')
	})

	test('create instance with string value then be able to update it', function () {
		const fellow = new Fellow(`${name} <${email}> (${githubUrl})`)

		fellow.set(`${name} <${email}> (${homepage})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepage2, 'url was updated to the homepage')
		equal(fellow.homepage, homepage2, 'homepage was updated to the homepage')
		equal(fellow.githubUrl, githubUrl, 'githubUrl is still present')

		fellow.set(`${name} <${email}> (${githubUrl})`)
		equal(fellow.url, homepage2, 'url stayed as the the homepage')
		equal(fellow.homepage, homepage2, 'homepage stayed as the homepage')
		equal(fellow.githubUrl, githubUrl, 'githubUrl stayed as the githubUrl')
	})

	suite('singleton', function (suite, test) {
		test('ensure first instance into the singleton', function () {
			const fellow = Fellow.create(`${name} <${email}> (${homepage})`)
			let fellows = Fellow.add(fellow)
			equal(fellows[0], fellow, 'added fellow was as expected')
			equal(Fellow.list[0], fellow, 'added fellow was in singleton')
			equal(Fellow.list.length, 1, 'only the one fellow was added')

			fellows = Fellow.add(fellow)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 1.1')
			equal(
				Fellow.list.length,
				1,
				'only the one fellow was added, no duplicates were added, 1.1'
			)

			fellows = [Fellow.get(fellow)]
			equal(fellows[0], fellow, 'fetched fellow was the previous fellow, 1.2')
			equal(
				Fellow.list.length,
				1,
				'only the one fellow was added, no duplicates were added, 1.2'
			)

			fellows = Fellow.add(`${name} <${email}> (${githubUrl})`)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 2')
			equal(
				Fellow.list.length,
				1,
				'only the one fellow was added, no duplicates were added, 2'
			)
			equal(fellow.githubUrl, githubUrl, 'githubUrl has now been set, 2')
			equal(fellow.homepage, homepage2, 'homepage stayed as the homepage, 2')

			fellows = Fellow.add({ name: 'Ben Lupton', email: 'b@lupton.cc' })
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 3')
			equal(
				Fellow.list.length,
				1,
				'only the one fellow was added, no duplicates were added, 3'
			)
			equal(fellow.name, 'Ben Lupton', 'name has been updated, 3')

			fellows = Fellow.add([{ name: 'Bennie Lupton', email: 'b@lupton.cc' }])
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 4')
			equal(
				Fellow.list.length,
				1,
				'only the one fellow was added, no duplicates were added, 4'
			)
			equal(fellow.name, 'Bennie Lupton', 'name has been updated 4')

			fellows = Fellow.add([{ name: 'Bob' }, { name: 'Joe' }])
			equal(fellows.length, 2, 'two fellows were returned')
			equal(fellows[0].name, 'Bob')
			equal(fellows[1].name, 'Joe')
			equal(Fellow.list.length, 3, 'three fellows now exist')
			equal(Fellow.list[1].name, 'Bob')
			equal(Fellow.list[2].name, 'Joe')

			fellows = Fellow.add(`${name} <${email}> (${homepage2})`)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 5')
			equal(
				Fellow.list.length,
				3,
				'three fellows still exist, a new one was not added, 5'
			)
			equal(fellow.homepage, homepage2, 'homepage stayed as the homepage, 5')
			equal(fellow.githubUrl, githubUrl, 'githubUrl stayed as the homepage, 5')
		})
	})

	suite('repositories', function (suite, test) {
		test('fellow can contribute to repos', function () {
			const fellow = Fellow.get({ email: 'b@lupton.cc' })
			fellow.contributesRepository('bevry/projectz')
			deepEqual(
				fellow.contributedRepositories,
				['bevry/projectz'],
				'contributed repository slugs are as expected, 1'
			)
			fellow.contributesRepository('bevry/projectz')
			deepEqual(
				fellow.contributedRepositories,
				['bevry/projectz'],
				'contributed repository slugs are as expected, 2'
			)
			fellow.contributesRepository('bevry/ambi')
			deepEqual(
				fellow.contributedRepositories,
				['bevry/projectz', 'bevry/ambi'],
				'contributed repository slugs are as expected'
			)
		})

		test('fellow can maintain repos', function () {
			const fellow = Fellow.get({ email: 'b@lupton.cc' })
			fellow.maintainsRepository('bevry/projectz')
			deepEqual(
				fellow.maintainedRepositories,
				['bevry/projectz'],
				'maintained repository slugs are as expected, 1'
			)
			fellow.maintainsRepository('bevry/projectz')
			deepEqual(
				fellow.maintainedRepositories,
				['bevry/projectz'],
				'maintained repository slugs are as expected, 2'
			)
			fellow.maintainsRepository('bevry/kava')
			deepEqual(
				fellow.maintainedRepositories,
				['bevry/projectz', 'bevry/kava'],
				'maintained repository slugs are as expected'
			)
		})

		test('fellow can author repos', function () {
			const fellow = Fellow.get({ email: 'b@lupton.cc' })
			fellow.authorsRepository('bevry/projectz')
			deepEqual(
				fellow.authoredRepositories,
				['bevry/projectz'],
				'authored repository slugs are as expected, 1'
			)
			fellow.authorsRepository('bevry/projectz')
			deepEqual(
				fellow.authoredRepositories,
				['bevry/projectz'],
				'authored repository slugs are as expected, 2'
			)
			fellow.authorsRepository('bevry/fellow')
			deepEqual(
				fellow.authoredRepositories,
				['bevry/projectz', 'bevry/fellow'],
				'authored repository slugs are as expected'
			)
		})
	})
})
