# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/abhi11verma/Consume/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/abhi11verma/Consume/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/abhi11verma/Consume/releases/tag/v1.0.0
