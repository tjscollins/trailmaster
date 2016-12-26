<<<<<<< 5e3f5acbc44633d89cd2abb3a8eee462900db02a
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var webpack = require('gulp-webpack');
var del = require('del');
var spawn = require('child_process').spawn,
  node;
=======
const gulp = require('gulp');
const livereload = require('gulp-livereload');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const webpack = require('gulp-webpack');
const env = require('gulp-env');
const nodemon = require('gulp-nodemon');
const del = require('del');

//Set Environment Variables
env({file: '.env.json'});
>>>>>>> Improved task runner setup

//File Paths
const SRC_PATH = './app/';
const DIST_PATH = './public/';
const HTML_PATH = SRC_PATH + 'html/';
const SCRIPTS_PATH = SRC_PATH + '/**/*.jsx';
const SCSS_PATH = SRC_PATH + 'styles/';

//SCSS
//font-awesome source
const fontAwesome = { in: 'node_modules/font-awesome/'
};
// Bootstrap scss source
const bootstrapSass = { in: './node_modules/bootstrap-sass/'
};

//Mapbox-gl css
const mapboxgl = { in: './node_modules/mapbox-gl/dist/'
};

// fonts
const fonts = { in: [
    SRC_PATH + 'fonts/*.*',
    bootstrapSass. in + 'assets/fonts/**/*',
    fontAwesome. in + 'fonts/**/*'
  ],
  out: DIST_PATH + 'fonts/'
};

const scss = { in: SCSS_PATH,
  out: DIST_PATH,
  watch: SRC_PATH + 'scss/**/*.scss',
  sassOpts: {
    outputStyle: 'compressed',
    precison: 3,
    errLogToConsole: true,
    includePaths: [
      bootstrapSass. in + 'assets/stylesheets',
      mapboxgl. in,
      fontAwesome. in + 'scss/'
    ]
  }
};

// copy bootstrap required fonts to dest
gulp.task('Fonts', function() {
  return gulp
    .src(fonts. in)
    .pipe(gulp.dest(fonts.out));
});

gulp.task('HTML', function() {
  return gulp
    .src(HTML_PATH + 'index.html')
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

gulp.task('SCSS', ['Fonts'], function() {
  return gulp
    .src(SCSS_PATH + 'app.scss')
    .pipe(plumber(function(err) {
      console.log('Styles task error\n', err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(sass(scss.sassOpts))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(scss.out))
    .pipe(livereload());
});

// Scripts
gulp.task('JSX', function() {
  return gulp
    .src(SRC_PATH + 'app.jsx')
    .pipe(plumber(function(err) {
      console.log('Scripts task error\n', err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

gulp.task('Clean', function() {
  return del.sync([DIST_PATH + '/**/']);
});

gulp.task('default', [
  'HTML', 'SCSS', 'JSX'
], function() {
  return;
});

gulp.task('Load-Server', function() {
  nodemon({script: './server/server.js', ext: 'js json', ignore: './public/bundle.js'});
});

gulp.task('watch', [
  'default', 'Load-Server'
], function() {
  livereload.listen();
  gulp.watch(HTML_PATH + '**/*.html', ['HTML']);
  gulp.watch(SCRIPTS_PATH, ['JSX']);
  gulp.watch(SCSS_PATH + '**/*.scss', ['SCSS']);
});
