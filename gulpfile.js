const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const prefix = require("gulp-autoprefixer");
const minify = require("gulp-clean-css");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const imagewebp = require("gulp-webp");
const browsersync = require("browser-sync").create();

// Tasks
const compilescss = () => {
  return src("src/sass/*.scss")
    .pipe(sass())
    .pipe(prefix("last 2 versions"))
    .pipe(minify())
    .pipe(dest("dist/css"));
};

const optimizeimg = () => {
  return src("src/images/*.{jpg,png}")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imagemin.optipng({ optimizationLevel: 2 }),
      ])
    )
    .pipe(dest("dist/images"));
};

const webpImage = () => {
  return src("dist/images/*.{jpg,png}")
    .pipe(imagewebp())
    .pipe(dest("dist/images"));
};

const jsmin = () => {
  return src("src/js/*.js").pipe(terser()).pipe(dest("dist/js"));
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
  watch(
    [
      "*.html",
      "src/sass/**/*.scss",
      "src/js/*.js",
      "src/images/*",
      "dist/images/*.{jpg,png}",
    ],
    browsersyncReload
  );
  watch("src/sass/**/*.scss", compilescss);
  watch("src/js/*.js", jsmin);
  watch("src/images/*", optimizeimg);
  watch("dist/images/*.{jpg,png}", webpImage);
};

exports.default = series(
  compilescss,
  jsmin,
  optimizeimg,
  webpImage,
  browsersyncServe,
  watchTask
);
