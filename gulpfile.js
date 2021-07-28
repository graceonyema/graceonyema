// const gulp = require('gulp');
const { src, dest, series, parallel, watch } = require('gulp');
const pug = require('gulp-pug');
const del = require('del');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const gulpIf = require('gulp-if');
const useref = require('gulp-useref');
const autoprefixer = require('gulp-autoprefixer');
const htmlclean = require('gulp-htmlclean');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const responsive = require('gulp-responsive-images');
const sourcemaps = require('gulp-sourcemaps');

// Site data
const siteData = require('./data.js');

//  Bootstrap links
const bootstrapCdn = {
  css: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">', 
  js: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'
};

const bootstrapLocal = {
  css: '<link rel="stylesheet" href="/styles/bootstrap.min.css">',
  js: '<script src="/scripts/bootstrap.bundle.min.js" defer></script>'
};

const clean = () => {
  return del([ 'web/dist/**/*', '!web/dist' ]);
}

const views = () => {
  return src('web/views/pages/*.pug')
    .pipe(
      pug({
        pretty: true,
        locals: siteData,
      })
    )
    .pipe(dest('web/src'));
};

// Create minified HTML, CSS and JS for distribution
const minifyFiles = () => {
  return src('web/src/*.html')
    .pipe(useref())
    
    //   Minify and create Sourcemap for JS files
    .pipe(gulpIf('*.js', sourcemaps.init()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.js', sourcemaps.write('.')))

    //   Minify and create Sourcemap for CSS files
    .pipe(gulpIf('*.css', sourcemaps.init()))
    .pipe(gulpIf('*.css', autoprefixer()))
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(gulpIf('*.css', sourcemaps.write('.')))

    //    Minify HTML files
    .pipe(gulpIf('*.html', replace(bootstrapLocal.css, bootstrapCdn.css)))
    .pipe(gulpIf('*.html', replace(bootstrapLocal.js, bootstrapCdn.js)))
    // .pipe(gulpIf('*.html', htmlclean()))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('web/dist'))
}

// Copy manifest and favicon
const copy = () => {
  return src([
    // 'web/src/favicon.ico',
    'web/src/sw.js',
    // 'web/src/manifest.json'
  ])
  .pipe(dest('web/dist'));
}

// Copy icons
// const icons = () => {
//   return src('web/src/icons/**')
//     .pipe(dest('web/dist/icons'));
// };

const optImages = () => {
  return src('web/src/assets/images/**/*')
    .pipe(responsive({
      '*': [
        {
          width: 400,
          quality: 75,
        },
        {
          width: 600,
          quality: 75,
          suffix: '-600'
        },
        {
          width: 600 * 2,
          quality: 75,
          suffix: '-600-2x'
        },
      ]
    }))
    .pipe(dest('web/dist/assets/images'));
};

const optIcons = () => {
  return src('web/src/assets/icons/**/*')
    .pipe(responsive({
      '*': [
        {
          quality: 75,
        },
      ]
    }))
    .pipe(dest('web/dist/assets/icons'));
};

// Watch for file changes

const watchFiles = () => {
  watch('web/src/*.html', minifyFiles);
}

// build optimized files
const build = series(clean, views, parallel(minifyFiles, copy, optIcons, optImages));
const images = parallel(optIcons, optImages);


module.exports = {
  default: build,
  views,
  images,
  watch: watchFiles
};