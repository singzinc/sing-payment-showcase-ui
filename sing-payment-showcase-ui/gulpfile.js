var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
	bower = require('gulp-bower'),
	filter = require('gulp-filter'),
	stripDebug = require('gulp-strip-debug'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

var DEST = 'app/public/build/';

gulp.task('scripts', function() {
    return gulp.src([
        'src/js/helpers/*.js',
        'src/js/*.js',
      ])
      .pipe(concat('custom.js'))
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(DEST+'/js'))
      .pipe(browserSync.stream());
});

gulp.task('bower', function() {
 /*const f = filter([ '**' ]);*/
 const f = filter(['!**/index.js','**/*.{ttf,woff,woff2,eof,svg,js,css}']);
 return bower({ directory: 'vendors' })
	.pipe(f)
    .pipe(gulp.dest('app/public/vendors/'))
});

// TODO: Maybe we can simplify how sass compile the minify and unminify version
var compileSASS = function (filename, options) {
  return sass('src/scss/*.scss', options)
        .pipe(autoprefixer('last 2 versions', '> 5%'))
        .pipe(concat(filename))
        .pipe(gulp.dest(DEST+'/css'))
        .pipe(browserSync.stream());
};

gulp.task('sass', function() {
    return compileSASS('custom.css', {});
});

gulp.task('sass-minify', function() {
    return compileSASS('custom.min.css', {style: 'compressed'});
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        },
        startPath: './app/main.html'
    });
});

gulp.task('watch', function() {
  // Watch .html files
  gulp.watch('app/*.html', browserSync.reload);
  // Watch .js files
  gulp.watch('src/js/*.js', ['scripts']);
  // Watch .scss files
  gulp.watch('src/scss/*.scss', ['sass', 'sass-minify']);
});


gulp.task('dest', function() {
	return  gulp.src('app/**')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('dest'));
});

gulp.task('dest2', function() {
	return  gulp.src('app/public/build/js/custom.js')
	//.pipe(stripDebug())
	.pipe(removeLogs())
    // Perform minification tasks, etc here
    .pipe(gulp.dest('dest/custom.js'));
});


// Default Task
gulp.task('default', ['bower', 'browser-sync', 'scripts', 'sass-minify', 'watch']);
gulp.task('production', ['bower', 'scripts', 'sass-minify', 'dest']);