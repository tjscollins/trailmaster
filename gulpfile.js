var gulp = require('gulp');
var uglify = require('gulp-uglify');
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

//File Paths
const SRC_PATH = './app/';
const DIST_PATH = './public/';
const HTML_PATH = SRC_PATH + 'html/'
const SCRIPTS_PATH = SRC_PATH + '/**/*.jsx';
const SCSS_PATH = SRC_PATH + 'styles/';
const SERVER = './server';

//SCSS
//font-awesome source
var fontAwesome = { in: 'node_modules/font-awesome/'
};
// Bootstrap scss source
var bootstrapSass = { in: './node_modules/bootstrap-sass/'
};

//Mapbox-gl css
var mapboxgl = { in: './node_modules/mapbox-gl/dist/'
};

// fonts
var fonts = { in: [
    SRC_PATH + 'fonts/*.*',
    bootstrapSass. in + 'assets/fonts/**/*',
    fontAwesome. in + 'fonts/**/*'
  ],
  out: DIST_PATH + 'fonts/'
};

var scss = { in: SCSS_PATH,
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
  // console.log('starting scripts task');
  return gulp
    .src(SRC_PATH + 'app.jsx')
    .pipe(plumber(function(err) {
      console.log('Scripts task error\n', err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(webpack(require('./webpack.config.js')))
    // .pipe(uglify())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

gulp.task('Clean', function() {
  return del.sync([DIST_PATH + '/**/']);
});

gulp.task('Default', [
  'SCSS', 'JSX', 'Load-Server'
], function() {
  console.log('Starting default task');
  gulp
    .src(HTML_PATH + 'index.html')
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
});

gulp.task('Load-Server', function() {
  // console.log('Reloading the server');
  if (node)
    node.kill();
  node = spawn('node', ['./server/server.js'], {stdio: 'inherit'});
  livereload.listen();
  node.on('close', (code) => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('watch', ['Default'], function() {
  gulp.watch(SERVER + '**/*js', ['Load-Server']);
  gulp.watch(SCRIPTS_PATH, ['JSX']);
  gulp.watch(SCSS_PATH + '**/*.scss', ['SCSS']);
  gulp.watch(HTML_PATH + '**/*.html', ['Default']);
});
