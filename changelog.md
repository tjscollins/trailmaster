# Change Log
All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Added displayFeatureOnMap and hideFeatureOnMap in addition to the existing toggleVisibility to allow more fine-grained control of what is displayed on the map.
- Attempting to save a trail when not logged in now produces an alert advising the user to login and then displays the login prompt.

### Changed
- Renamed toggleVisibility to toggleFeatureOnMap for more consistent naming
- Fixed distance calculation of trails with PoIs but no routes
- Fixed AddTrails component to display lengths of routes included in the new saved trail.
- Improved integration tests.
- Minor CSS fixes.


## [0.2.2] - 2017-04-29
### Added
- Added ipinfo.io fallback for user geolocation if native browser geolocation fails
- Added WebdriverIO integration tests to overall dev workflow

### Changed
- Fixed unMockPos action/reducer to instantly recenter map when clearing mocked position
- When setting Mock Locations the map now zooms instantly to the new location.
- Reduced auto-center time for map to 250 ms from 5000 ms to solve a ui bug caused by dragging map while it eases.
- Switched to using CDNs for jQuery, Bootstrap, and Font Awesome rather than bundling with app
- Changed LoadingIndicator.jsx to finish when geoJSON API calls return and when Mapbox-gl has loaded.
- Refactored FAQ.jsx to use Markdown for internal content
- Fixed initial mapcentering to re-center if geolocation info takes longer than normal to load
- Improved test coverage of a number of methods
- Switched to using Pug for initial server rendering

## [0.2.1] - 2017-04-25
### Changed
- Initial changelog creation.  See prior git commits.
