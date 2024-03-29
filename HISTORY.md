# History

## v7.4.0 2024 January 8

-   Sorting of accented names of Fellows now works as expected
-   `.add` results are now sorted
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io), [Frontend Masters](https://FrontendMasters.com), [Mr. Henry](https://mrhenry.be), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.3.0 2024 January 8

-   Support Patreon ID URLs
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io), [Frontend Masters](https://FrontendMasters.com), [Mr. Henry](https://mrhenry.be), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.2.1 2023 December 30

-   Fellows will now be merged if their `.toString()` matches (an overall match), or if one is only a name that matches the other
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.2.0 2023 December 29

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.1.2 2023 December 28

-   Improved cleaning of URLs, especially `schema://www.` patterns, such as `https://www.pleo.io/` becoming `https://pleo.io`
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io/), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.1.1 2023 December 28

-   Trim trailing slashes to prevent duplicates on [bevry/cson](https://github.com/bevry/cson/commit/e30f735e4bc3b0b1159c1c20891507b82d596b39#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R72-R73)
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io/), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.1.0 2023 December 27

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io/), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.0.4 2023 December 27

-   Fix `fetchOk` sometimes throwing
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io/), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.0.3 2023 December 27

-   Renamed `githubRepoSlug` to `githubSlug`
-   Emails are now verified before being applied
-   Add `verifyUrls` method
-   Use [`bevry/render`](https://github.com/bevry/render) for rendering
-   Add `toFormat` method
-   URLs are without schema are now corrected to `https://` and `www.` removed
-   Fixed description outputs containing `:` instead of `: `
-   Thank you to the sponsors: [Andrew Nesbitt](https://nesbitt.io), [Balsa](https://balsa.com), [Codecov](https://codecov.io/), [Poonacha Medappa](https://poonachamedappa.com), [Rob Morris](https://github.com/Rob-Morris), [Sentry](https://sentry.io), [Syntax](https://syntax.fm)

## v7.0.2 2023 December 21

-   Renamed `toHTML` to `toHtml` to be consistent with other naming
-   `toText` now respects `FormatOptions.urlFields`
-   `toMarkdown` and `toHtml` now respect `FormatOptions.displayDescription`

## v7.0.1 2023 December 21

-   Prevent fellows that use their company url as their homepage from being merged together, now `idFields` prefers `emails` and uses `usernames` instead of `urls` as intended
-   Remove `prefix` option, such parental rendering extensions are best handled outside the scope of the children
-   Prevent githubUsername being a reserved username
-   Support parsing `github.io` URLs
-   ThanksDev URLs will only be enabled if explicitly set
-   String format now supports parsing and rendering with multiple URLs (now outputting all `urlFields`) and a description (`: description`), to expand de-duplication accuracy and offline tooling
-   Renamed `getUsernameFromGistUrl` to `getUsernameFromGitHubGistUrl`
-   Years are now combined, supporting when a particular author has paused authorship then resumed later

## v7.0.0 2023 December 20

-   Huge improvements to enable backers support in [bevry/github](https://github.com/bevry/github)
-   Added `prefix` format option, and corrected description and types for others
-   Now intelligently handles usernames and urls for a number of services
-   Now trims inputs to prevent blank values over-writing non-blank values (opencollective descriptions can be blank)
-   Adding now supports Set type as well
-   Properties related to backers have been renamed
-   Added the `toText` format
-   Make `displayEmail` default to enabled on `toString` as necessary to prevent duplicates
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.25.0 2023 November 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Updated license from [`MIT`](http://spdx.org/licenses/MIT.html) to [`Artistic-2.0`](http://spdx.org/licenses/Artistic-2.0.html)

## v6.24.0 2021 July 30

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.23.0 2021 July 29

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.22.0 2021 July 28

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.21.0 2020 October 29

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.20.0 2020 September 4

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.19.0 2020 August 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.18.0 2020 August 4

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.17.0 2020 July 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.16.0 2020 July 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.15.0 2020 June 25

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.14.0 2020 June 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.13.0 2020 June 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.12.0 2020 June 20

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.11.0 2020 June 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.10.0 2020 June 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.9.0 2020 May 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.8.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.7.0 2020 May 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.6.0 2020 May 8

-   Allow spread to `add` method
-   New `urlFields` formatting option for `to*` methods
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.5.0 2020 May 4

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.4.0 2020 March 30

-   Added formatting options
-   Format without email by default, add it back with the `displayEmail: true` format option

## v6.3.0 2020 March 30

-   Do not fail hard on malformed text/string entries

## v6.2.0 2020 March 27

-   Added `Fellow::years`

## v6.1.0 2020 March 27

-   Added `Fellow::contributions`, `Fellow::administeredRepositories`, `Fellow.administersRepository`

## v6.0.0 2020 March 27

-   Added `Fellow.flatten` and `Fellow.sort`, renamed `Fellow::compare` to `Fellow:same` and introduced a new `Fellow::compare` for sorting.

## v5.0.0 2020 March 27

-   Rewrote in TypeScript with breaking API changes for simplicity as new native abilities allows us to do more with less

## v4.0.0 2020 March 26

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=8` to `node: >=10` to keep up with mandatory ecosystem changes

## v3.3.0 2019 December 9

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.2.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.1.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.0.0 2019 November 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=0.12` to `node: >=8` to keep up with mandatory ecosystem changes

## v2.6.0 2019 November 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v2.5.0 2019 November 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v2.4.0 2019 January 1

-   Fixed `twitterUrl` not being set due to a typo
-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v2.3.0 2016 June 13

-   Fellow homepage will now change `https` to `http` to prevent duplicates

## v2.2.0 2016 April 30

-   Updated internal conventions

## v2.1.0 2015 December 9

-   Updated internal conventions

## v2.0.0 2015 September 18

-   Removed `years`, it was too specific to the [bevry/projectz](https://github.com/bevry/projectz) use case
-   Added new `compare` method
-   Added new `json` dynamic property
-   Setting an `email` will now keep an `emails` array up to date, for multiple email support
-   Renamed `setValue` to just `set`
-   `ensureFields` no longer caches, and now supports array fields

## v1.2.0 2015 September 16

-   Added name fallbacks to githubUsername then twitterUsername

## v1.1.0 2015 September 16

-   Added repository helpers

## v1.0.0 2015 September 16

-   Initial working release
