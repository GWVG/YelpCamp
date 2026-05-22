# YelpCamp

A learning project (Udemy Web Development) — a Yelp-like CRUD web app for campgrounds built with Node.js, Express, MongoDB, EJS, Passport, Mapbox and Cloudinary.

---

## Overview

YelpCamp is a server-rendered web application that lets users register, create campground listings with photos and locations, and post reviews. It was built as part of a Udemy full-stack web development course to practice Express, MongoDB, authentication, file uploads, and third-party APIs.

This repository is a learning project and demonstrates common web development concepts (routing, middleware, authentication, validation and deployment-ready concerns like CSP and input sanitization), but is not hardened for production use without further changes. See the "Notes" section below.

## Tech stack

- Node.js (Express)
- MongoDB (Mongoose)
- EJS templates (ejs-mate layout engine)
- Passport (passport-local, passport-local-mongoose) for authentication
- Cloudinary + Multer for image uploads
- Mapbox (geocoding) for location -> GeoJSON coordinates
- Joi + sanitize-html for server-side validation and sanitization
- Helmet, express-mongo-sanitize, sanitize-html for basic security

## Main folders and files

- `app.js` — main application file, Express configuration and route mounting
- `controllers/` — request handlers for campgrounds, reviews and users
- `routes/` — Express routers for campgrounds, reviews and user auth
- `models/` — Mongoose schemas (`Campground`, `Review`, `User`) and image sub-schema
- `views/` — EJS templates (layouts, partials, pages)
- `public/` — static assets: CSS and front-end JavaScript (map handling)
- `cloudinary/` — Cloudinary + multer-storage setup
- `middleware.js` — custom middleware (auth checks, Joi validations, helpers)
- `schemas.js` — Joi schemas with custom sanitize-html extension
- `utils/` — small utilities (`ExpressError`, `catchAsync`)
- `seeds/` — DB seed scripts (sample data helpers)

## Features

- User authentication: register, login, logout (sessions stored in MongoDB)
- CRUD for campgrounds: create (with images and geocoding), read, update (add/remove images), delete
- Reviews: add and delete reviews with ratings and text
- Image uploads stored in Cloudinary via Multer
- Mapbox geocoding to convert a location string into GeoJSON coordinates (used for display on maps)
- Server-side validation using Joi (with HTML-sanitizing string rule)
- Basic security hardening: Helmet CSP configuration, input sanitization, and mongo operator sanitization

## Dependencies

See `package.json` for full versions. Key libraries include:

- `express`, `ejs`, `ejs-mate`
- `mongoose`
- `passport`, `passport-local`, `passport-local-mongoose`
- `multer`, `multer-storage-cloudinary`, `cloudinary`
- `@mapbox/mapbox-sdk`
- `joi`, `sanitize-html`
- `helmet`, `express-mongo-sanitize`
- `connect-mongo`, `express-session`, `connect-flash`

## Environment variables

The app uses `dotenv` in development. Create a `.env` (not committed) with these variables:

- `DB_URL` — MongoDB connection string (defaults to `mongodb://localhost:27017/yelp-camp`)
- `MAPBOX_publicToken` — Mapbox API token for geocoding
- `CLOUDINARY_cloudName`, `CLOUDINARY_key`, `CLOUDINARY_secret` — Cloudinary credentials
- `SECRET` — session secret (strong random value for production)

Example `.env` (do not commit):

```
DB_URL=mongodb://localhost:27017/yelp-camp
MAPBOX_publicToken=pk.your_mapbox_token_here
CLOUDINARY_cloudName=your_cloud_name
CLOUDINARY_key=your_cloudinary_key
CLOUDINARY_secret=your_cloudinary_secret
SECRET=some_long_random_secret
```

## Local setup

1. Install dependencies

```bash
npm install
```

2. (Optional) Populate the database with sample data using the `seeds/` scripts (inspect `seeds/index.js` for usage).

3. Run the app locally

```bash
node app.js
```

Open http://localhost:3000 in your browser.

## Notes & limitations (learning project)

- This project was implemented as a Udemy course exercise; it demonstrates concepts for learning and portfolio display but is not production-ready without further work.
- Missing for production: automated tests, CI/CD configuration, a `.env.example`, secure session secret management, HTTPS / deployment scripts, and comprehensive logging/monitoring.
- Session secret and Cloudinary credentials are expected from environment variables — change the placeholder strings before publishing or deploying.

## Contributing / Attribution

This repository is a personal learning project. If you reuse or extend it, please add tests and remove hard-coded fallback secrets before production use.
