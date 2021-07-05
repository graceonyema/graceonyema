// const gulp = require('gulp');
const { src, dest, series, parallel, watch } = require('gulp');
// const pug = require('gulp-pug');
const del = require('del');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const gulpIf = require('gulp-if');
const useref = require('gulp-useref');
const autoprefixer = require('gulp-autoprefixer');
const htmlclean = require('gulp-htmlclean');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');

//  Bootstrap links
const bootstrapCdn = {
  css: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">', 
  js: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>'
};

const bootstrapLocal = {
  css: '<link rel="stylesheet" href="/styles/bootstrap.min.css">',
  js: '<script src="/scripts/bootstrap.bundle.min.js"></script>'
};

const clean = () => {
  return del([ 'web/dist/**/*', '!web/dist' ]);
}

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
    .pipe(gulpIf('*.html', htmlclean()))
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

// Optimize Images
const optimizeImages = () => {
  return src('web/src/images/**/*')
    .pipe(imagemin())
    /*.pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))*/
    .pipe(dest('web/dist/images'))
}

// Watch for file changes
const watchFiles = () => {
  watch('web/src/*.html', minifyFiles);
}

// build optimized files
const build = series(clean, parallel(minifyFiles, copy, optimizeImages));


module.exports = {
  default: build,
  watch: watchFiles
};