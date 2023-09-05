const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-clean-css");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const imagewebp = require("gulp-webp");
const browsersync = require("browser-sync").create();

const paths = {
  styles: {
    src: ["src/scss/*.scss", "src/css/*.css"],
    dest: "dist/css",
  },
  image: {
    src: "src/images/*.{jpg,png}",
    dest: "dist/images",
  },
  js: {
    src: "src/js/*.js",
    dest: "dist/js",
  },
};

// Tasks
const compilescss = () => {
  return src(paths.styles.src)
    .pipe(sass())
    .pipe(prefix("last 2 versions"))
    .pipe(minify())
    .pipe(dest(paths.styles.dest));
};

const optimizeimg = () => {
  return src(paths.image.src)
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 2 }),
      ])
    )
    .pipe(dest(paths.image.dest));
};

const webpImage = () => {
  return src(paths.image.dest + "/*.{jpg,png}")
    .pipe(imagewebp())
    .pipe(dest(paths.image.dest));
};

const jsmin = () => {
  return src(paths.js.src).pipe(terser()).pipe(dest(paths.js.dest));
};

const browsersyncServe = (done) => {
  browsersync.init({ server: { baseDir: "." } });
  done();
};

const browsersyncReload = (done) => {
  browsersync.reload();
  done();
};

// Watch task
const watchTask = () => {
  watch("*.html", series(compilescss, browsersyncReload));
  watch(paths.styles.src, series(compilescss, browsersyncReload));
  watch(paths.js.src, series(jsmin, browsersyncReload));
  watch(paths.image.src, series(optimizeimg, browsersyncReload));
  watch(paths.image.dest + "/*.{jpg,png}", series(webpImage, browsersyncReload));
};

exports.default = series(
  compilescss,
  jsmin,
  optimizeimg,
  webpImage,
  browsersyncServe,
  watchTask
);
