# Change Log
All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Added ipinfo.io fallback for user geolocation if native browser geolocation fails
- Added WebdriverIO integration tests to overall dev workflow

### Changed
- Switched to using CDNs for jQuery, Bootstrap, and Font Awesome rather than bundling with app
- Changed LoadingIndicator.jsx to finish when geoJSON API calls return instead of waiting for Mapbox to also finish loading.
- Refactored FAQ.jsx to use Markdown for internal content
- Fixed initial mapcentering to re-center if geolocation info takes longer than normal to load
- Improved test coverage of a number of methods
- Switched to using Pug for initial server rendering

## [0.2.1] - 2017-04-25
### Changed
- Initial changelog creation.  See prior git commits.
