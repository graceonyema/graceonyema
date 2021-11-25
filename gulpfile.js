// const gulp = require('gulp');
const { src, dest, series, parallel, watch } = require('gulp');
const pug = require('gulp-pug');
const del = require('del');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify-es').default;
const critical = require('critical').stream;
const cleanCSS = require('gulp-clean-css');
const purgecss = require('gulp-purgecss');
const gulpIf = require('gulp-if');
const useref = require('gulp-useref');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const responsive = require('gulp-responsive-images');
const postcss = require('gulp-postcss');
const postcssCustomProperties = require('postcss-custom-properties');
const sourcemaps = require('gulp-sourcemaps');

// Site data
const siteData = require('./data.js');

//  Bootstrap links
const bootstrapCdn = {
  css: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">', 
  js: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous" defer></script>'
  // js: '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous" defer></script>'
};

const bootstrapLocal = {
  css: '<link rel="stylesheet" href="/styles/bootstrap.min.css">',
  js: '<script src="/scripts/bootstrap.bundle.min.js" defer></script>'
};

const emptyDist = () => {
  return del([ 'dist/**/*', '!dist' ]);
}

// Remove html generated in source during build
const removeHtmlSrc = () => {
  return del([ 'web/src/*.html', '!web/src' ]);
}

// Build HTML from template
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
    .pipe(gulpIf('*.css', postcss([
      postcssCustomProperties({
        preserve: false
      }),
    ])))
    .pipe(gulpIf('*.css', purgecss({
      content: ['web/src/**/*.html'],
      safelist: ['show']
    })))
    .pipe(gulpIf('*.css', autoprefixer()))
    .pipe(gulpIf('*.css', cleanCSS()))
    .pipe(gulpIf('*.css', sourcemaps.write('.')))

    //    Minify HTML files
    // .pipe(gulpIf('*.html', replace(bootstrapLocal.css, bootstrapCdn.css)))
    .pipe(gulpIf('*.html', replace(bootstrapLocal.js, bootstrapCdn.js)))
    // .pipe(gulpIf('*.html', htmlclean()))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'))
}

// inline critical css
const inlineCritical = () => {
  return src('dist/*.html')
    .pipe(
      critical({
        base: 'dist/',
        inline: true,
        css: ['dist/styles/*.css'],
        // dimensions: [
        //   {
        //     height: 200,
        //     width: 500,
        //   },
        //   {
        //     height: 900,
        //     width: 1200,
        //   },
        // ],
      })
    )
    // .pipe(postcss([
    //   postcssCustomProperties({
    //     preserve: false
    //   })
    // ]))
    .on('error', err => {
      console.log('ERROR:', err.message);
    })
    .pipe(dest('dist'));
}

// Copy manifest, favicon and other root files
const copy = () => {
  return src([
    'web/src/favicon.ico',
    'web/src/sw.js',
    'web/src/manifest.json'
  ])
  //   Minify root JS files
  .pipe(gulpIf('*.js', uglify()))
  .pipe(dest('dist'));
}

// Optimize Images
const minifyImages = () => {
  return src('web/src/assets/**/*')
    // .pipe(imagemin())
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo(),
      // imagemin.svgo({
      //   plugins: [
      //     { 
      //       removeXMLNS: true,
      //       removeViewBox: false,
      //     },
      //   ]
      // })
    ]))
    .pipe(dest('dist/assets'))
}

// Create respoonsive images
const respImages = () => {
  return src('web/src/assets/images/**/*')
    .pipe(responsive({
      '*_pic.{png,jpg}': [
        {
          width: 400,
          quality: 75,
          suffix: '-400'
        },
        {
          width: 500,
          quality: 75,
          suffix: '-500'
        },
        // {
        //   width: 600,
        //   quality: 75,
        //   suffix: '-600'
        // },
        {
          width: 400 * 2,
          quality: 75,
          suffix: '-400-2x'
        },
        {
          width: 500 * 2,
          quality: 75,
          suffix: '-500-2x'
        },
      ]
    }))
    .pipe(dest('web/src/assets/images'));
};

// Watch for file changes
const watchFiles = () => {
  // watch('web/src/*.html', minifyFiles);
  // watch('web/src/assets/images', respImages);
  watch('web/views', views);
}

// build optimized files
// const build = series(emptyDist, views, respImages, parallel(minifyFiles, copy, minifyImages), inlineCritical);
const build = series(emptyDist, views, respImages, parallel(minifyFiles, copy, minifyImages), removeHtmlSrc);
const images = series(respImages, minifyImages);
// const images = series(minifyFiles);


module.exports = {
  default: build,
  images,
  inlineCritical,
  views,
  watchFiles
};