'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import pug from 'gulp-pug';
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';

const baseDirs = {
	src: 'src/',
	dist: 'dist/'
};

const routes = {
	templates: {
		pug: `${baseDirs.src}templates/*.pug`,
		_pug: `${baseDirs.src}templates/_includes/*.pug`
	},
	styles: {
		scss: `${baseDirs.src}styles/*.scss`,
		_scss: `${baseDirs.src}styles/_includes/*.scss`
	},
	files: {
		html: `${baseDirs.dist}`,
		css: `${baseDirs.dist}css/`
	}
};

gulp.task('templates', () => {
	return gulp.src([routes.templates.pug, '!' + routes.templates._pug])
		.pipe(plumber({}))
		.pipe(pug({
			locals: {
				'emojis': require('./gitmojis.json')
			}
		}))
		.pipe(gulp.dest(routes.files.html))
		.pipe(browserSync.stream())
});

gulp.task('styles', () => {
	return gulp.src(routes.styles.scss)
		.pipe(plumber({}))
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(gulp.dest(routes.files.css))
		.pipe(browserSync.stream())
});

gulp.task('serve', () => {
	browserSync.init({
		server: `${baseDirs.dist}`
	});

	gulp.watch([routes.templates.pug, routes.templates._pug], ['templates']);
	gulp.watch([routes.styles.scss, routes.styles._scss], ['styles']);
});

gulp.task('dev', ['templates', 'styles', 'serve']);

gulp.task('default', () => {
	gulp.start('dev');
});