# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] - 2026-07-23

### Fixed
- Edit item modal is now scrollable on mobile — fields no longer hidden behind the keyboard
- Edit item modal is properly centered on desktop (regression from mobile bottom-sheet change)
- Thumbnail upload zone no longer collapses when a blank or transparent image is set
- SVG `og:image` values (usually site logos) are now ignored during metadata fetch; the generated tile thumbnail is shown instead

## [1.1.0] - 2026-07-23

### Added
- **Dynamic categories** — categories are no longer hardcoded; create custom ones inline when adding content (pick a name, icon, colour, and tile shape)
- **List view** — toggle between grid and compact list view on the home screen and all category screens
- **Settings page** — accessible from the sidebar; theme toggle moved here
- **Responsive mobile and tablet layout** — collapsing icon-only sidebar on tablet, bottom navigation bar on mobile
- **PWA support** — installable as a home screen app on Android and iOS; service worker for offline navigation
- **Share to Consume** — app appears in the system share sheet; shared URLs open directly in the add dialog
- **CasaOS icon** — app icon now appears correctly in the CasaOS dashboard

### Changed
- **News removed from defaults** — default categories are now Videos, Books, Articles, Podcasts; existing News items fall back gracefully
- Logo and app name in sidebar now link back to the home screen
- Trash and edit buttons on tiles swapped (trash left, edit right) for safer muscle memory
- Trash and edit icons in list rows are larger with more spacing between them

### Fixed
- Dark mode preference is now applied instantly on page load (no flash of light theme)
- Light mode background refined for better contrast with card surfaces

## [1.0.1] - 2026-07-23

### Fixed
- Session cookie no longer requires HTTPS — app now works correctly over HTTP on CasaOS and other local network installs (`COOKIE_SECURE` env var, defaults to `false`)

## [1.0.0] - 2026-07-22

### Added
- Initial release
- Add links by URL — metadata (title, thumbnail, description, author) fetched server-side
- Organize by type: Videos, Books, Articles, Podcasts, News
- Upload or paste custom thumbnails
- Export and import library as JSON
- Multi-user with admin and user roles
- Admin panel: create users, purge items, manage roles
- Dark mode
- CasaOS-compatible docker-compose (multi-container: app + PostgreSQL)
- Published to GHCR (`ghcr.io/abhi11verma/consume`)

[Unreleased]: https://github.com/abhi11verma/Consume/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/abhi11verma/Consume/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/abhi11verma/Consume/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/abhi11verma/Consume/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/abhi11verma/Consume/releases/tag/v1.0.0
