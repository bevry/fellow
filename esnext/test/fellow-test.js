// Import
const joe = require('joe')
const {equal, deepEqual} = require('assert-helpers')
const Fellow = require('../../')

// Tests
joe.suite('fellow', function (suite, test) {
	const name = 'Benjamin Lupton', email = 'b@lupton.cc', homepage = 'https://balupton.com', githubUrl = 'https://github.com/balupton'

	test('create instance with string value and githubUrl', function () {
		const fellow = new Fellow(`${name} <${email}> (${githubUrl})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, githubUrl, 'url is correct')
		equal(fellow.githubUrl, githubUrl, 'githubUrl is correct')
		equal(fellow.homepage, null, 'homepage is empty as it was not set')
	})

	test('create instance with string value and homepage', function () {
		const fellow = new Fellow(`${name} <${email}> (${homepage})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepage, 'url is correct')
		equal(fellow.homepage, homepage, 'homepage is correct')
		equal(fellow.githubUrl, null, 'githubUrl is empty as it was not set')
	})

	test('create instance via Fellow.create with string value and homepage', function () {
		const fellow = Fellow.create(`${name} <${email}> (${homepage})`)
		equal(fellow instanceof Fellow, true, 'fellow via Fellow.create was a fellow instance')
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepage, 'url is correct')
		equal(fellow.homepage, homepage, 'homepage is correct')
		equal(fellow.githubUrl, null, 'githubUrl is empty as it was not set')
	})

	test('create instance with string value then be able to update it', function () {
		const fellow = new Fellow(`${name} <${email}> (${githubUrl})`)

		fellow.setValue(`${name} <${email}> (${homepage})`)
		equal(fellow.name, name, 'name is correct')
		equal(fellow.email, email, 'email is correct')
		equal(fellow.url, homepage, 'url was updated to the homepage')
		equal(fellow.homepage, homepage, 'homepage was updated to the homepage')
		equal(fellow.githubUrl, githubUrl, 'githubUrl is still present')

		fellow.setValue(`${name} <${email}> (${githubUrl})`)
		equal(fellow.url, homepage, 'url stayed as the the homepage')
		equal(fellow.homepage, homepage, 'homepage stayed as the homepage')

		fellow.name = '2015+ Benjamin Lupton'
		equal(fellow.years, '2015+', 'year was extracted')
		equal(fellow.name, name, 'name was extracted from combined year')

		fellow.name = '2015-2016 Benjamin Lupton'
		equal(fellow.years, '2015-2016', 'year was extracted')
		equal(fellow.name, name, 'name was extracted from combined year')

		fellow.name = '2015 Benjamin Lupton'
		equal(fellow.years, '2015', 'year was extracted')
		equal(fellow.name, name, 'name was extracted from combined year')
	})

	suite('singleton', function (suite, test) {
		test('ensure first instance into the singleton', function () {
			const fellow = Fellow.create(`${name} <${email}> (${homepage})`)
			let fellows = Fellow.add(fellow)
			equal(fellows[0], fellow, 'added fellow was as expected')
			equal(Fellow.list[0], fellow, 'added fellow was in singleton')
			equal(Fellow.list.length, 1, 'only the one fellow was added')

			fellows = Fellow.add(fellow)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 1')
			equal(Fellow.list.length, 1, 'only the one fellow was added, no duplicates were added, 1.1')

			fellows = [Fellow.get(fellow)]
			equal(fellows[0], fellow, 'fetched fellow was the previous fellow')
			equal(Fellow.list.length, 1, 'only the one fellow was added, no duplicates were added, 1.2')

			fellows = Fellow.add(`${name} <${email}> (${githubUrl})`)
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 2')
			equal(Fellow.list.length, 1, 'only the one fellow was added, no duplicates were added, 2')
			equal(fellow.githubUrl, githubUrl, 'githubUrl has now been set')

			fellows = Fellow.add({name: 'Ben Lupton', email: 'b@lupton.cc'})
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 3')
			equal(Fellow.list.length, 1, 'only the one fellow was added, no duplicates were added, 3')
			equal(fellow.name, 'Ben Lupton', 'name has been updated')

			fellows = Fellow.add([{name: 'Bennie Lupton', email: 'b@lupton.cc'}])
			equal(fellows[0], fellow, 'added fellow was the previous fellow, 4')
			equal(Fellow.list.length, 1, 'only the one fellow was added, no duplicates were added, 4')
			equal(fellow.name, 'Bennie Lupton', 'name has been updated')

			fellows = Fellow.add([{name: 'Bob'}, {name: 'Joe'}])
			equal(fellows.length, 2, 'two fellows were returned')
			equal(fellows[0].name, 'Bob')
			equal(fellows[1].name, 'Joe')
			equal(Fellow.list.length, 3, 'three fellows now exist')
			equal(Fellow.list[1].name, 'Bob')
			equal(Fellow.list[2].name, 'Joe')
		})
	})

	suite('github repositories', function (suite, test) {
		test('fellow can contribute to repos', function () {
			const fellow = Fellow.get({email: 'b@lupton.cc'}).contributesToGithubRepository('bevry/projectz')
			deepEqual(fellow.contributedGithubRepositories, ['bevry/projectz'], 'contributed github repository slugs are as expected, 1')
			fellow.contributesToGithubRepository('bevry/projectz')
			deepEqual(fellow.contributedGithubRepositories, ['bevry/projectz'], 'contributed github repository slugs are as expected, 2')
			fellow.contributesToGithubRepository('bevry/ambi')
			deepEqual(fellow.contributedGithubRepositories, ['bevry/projectz', 'bevry/ambi'], 'contributed github repository slugs are as expected')
		})

		test('fellow can maintain repos', function () {
			const fellow = Fellow.get({email: 'b@lupton.cc'}).maintainsGithubRepository('bevry/projectz')
			deepEqual(fellow.maintainedGithubRepositories, ['bevry/projectz'], 'maintained github repository slugs are as expected, 1')
			fellow.maintainsGithubRepository('bevry/projectz')
			deepEqual(fellow.maintainedGithubRepositories, ['bevry/projectz'], 'maintained github repository slugs are as expected, 2')
			fellow.maintainsGithubRepository('bevry/joe')
			deepEqual(fellow.maintainedGithubRepositories, ['bevry/projectz', 'bevry/joe'], 'maintained github repository slugs are as expected')
		})

		test('fellow can author repos', function () {
			const fellow = Fellow.get({email: 'b@lupton.cc'}).authorsGithubRepository('bevry/projectz')
			deepEqual(fellow.authoredGithubRepositories, ['bevry/projectz'], 'authored github repository slugs are as expected, 1')
			fellow.authorsGithubRepository('bevry/projectz')
			deepEqual(fellow.authoredGithubRepositories, ['bevry/projectz'], 'authored github repository slugs are as expected, 2')
			fellow.authorsGithubRepository('bevry/fellow')
			deepEqual(fellow.authoredGithubRepositories, ['bevry/projectz', 'bevry/fellow'], 'authored github repository slugs are as expected')
		})
	})


})
