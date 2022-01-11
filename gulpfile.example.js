const previewThemeid = '';
const themeUrl = 'https://mysite.myshopify.com/';
const previewThemeUrl = themeUrl + '/?preview_theme_id=' + previewThemeid;
const defaultBrowser = ['C:\\Program Files \\Firefox Developer Edition\\firefox.exe', 'Chrome'];

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
//const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const pipeline = require('readable-stream').pipeline;
const terser = require('gulp-terser');
const svgstore = require('gulp-svgstore');
//const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const copy = require('gulp-copy');
const del = require('del');

/*
 SOURCE FILES
 */
const source = 'src/theme/**/*.*';
const output = 'dist';
let jsScripts;
const jsPath = 'src/js/';
const jsNpmPath = 'node_modules/';
const jsCustomScripts = [
    'acstk.js',
    // 'custom.js',
];

const jsNpmScripts = [
    // All ready deprecated with browserify
    'jquery/dist/jquery.js',
    'fitvids/dist/fitvids.js',
    'remodal/dist/remodal.js',
    'flickity/dist/flickity.pkgd.js',
    'flickity-imagesloaded/flickity-imagesloaded.js',
    'js-cookie/src/js.cookie.js'
];

const cssNpmScripts = [
    //Add any vendor css scripts here that you want to include
    'flickity/dist/flickity.css',
    'remodal/dist/remodal.css',
    'remodal/dist/remodal-default-theme.css',
];

for (let i = 0; i < jsCustomScripts.length; i++) {
    // Add the default path
    jsCustomScripts[i] = jsPath + jsCustomScripts[i];
}
for (let i = 0; i < jsNpmScripts.length; i++) {
    // Add the default path
    jsNpmScripts[i] = jsNpmPath + jsNpmScripts[i];
}

for (let i = 0; i < cssNpmScripts.length; i++) {
    // Add the default path
    cssNpmScripts[i] = jsNpmPath + cssNpmScripts[i];
}

// Concat the vendor scripts with the custom scripts
jsScripts = jsNpmScripts.concat(jsCustomScripts);

/*
 GULP TASKS
 */

// TASK: scripts - Concat and uglify all the vendor and custom javascript
function scripts() {
    return gulp.src(jsScripts)
        .pipe(concat('main.js'))
        .pipe(terser())
        .pipe(gulp.dest('src/theme/assets/'));
}

// TASK: vendorStyles -  Compile the npm css files to scss partial
function vendorStyles(){
    return gulp.src(cssNpmScripts)
        .pipe(concat('_vendor.scss'))
        .pipe(gulp.dest('src/scss/'));
}

// TASK: styles - Compile scss into css
function styles() {
    return gulp.src('src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error',sass.logError))
        // .pipe(postcss([ autoprefixer(), cssnano() ]))
        //.pipe(concat('ac.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/theme/assets/'))
        .pipe(browserSync.stream());
}

// TASK: template - Copy a template to the dist folder
function template(path) {
    return gulp.src(path)
        .pipe(copy(output, { prefix: 1 }));
}

// TASK: template - Copy a template to the dist folder
function templates() {
    let path = source;
    return gulp.src(path)
        .pipe(copy(output, { prefix: 2 }));
}

// TASK: svgToLiquid - Copy a the svg to a liquid partial
function svgToLiquid(path) {
    return gulp.src(path)
        .pipe(rename({
            dirname: "",
            prefix: "icon-",
            extname: ".liquid"
        })).pipe(gulp.dest('src/theme/snippets'));

}

// TASK: svgdefs - Compile the svg files in to a liquid snippet
function svgdefs() {
    return gulp
        .src('src/images/svg/*.svg')
        //.pipe(svgmin())
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore())
        .pipe(rename("defs.svg.liquid"))
        .pipe(gulp.dest('src/theme/snippets'));
}

// TASK: serve - Start BrowserSync and watch the src files
function serve() {
    browserSync.init({
        proxy: previewThemeUrl,
        browser: defaultBrowser,
        reloadDelay: 4000,
        snippetOptions: {
            rule: {
                match: /<\/body>/i,
                fn: function (snippet, match) {
                    return snippet + match;
                }
            }
        },
        middleware: function(req,res,next) {

            var arr = req.url.split('?');
            if (arr.length > 1 && arr[1] != '') {
                req.url = req.url + '&_fd=0'

            }else{
                req.url =  req.url + '?_fd=0'
            }

            return next();
        }
    });

    gulp.watch("src/scss/**/*.scss",  styles).on('change', browserSync.reload);
    gulp.watch("src/js/**/*.js", scripts ).on('change', browserSync.reload);
    gulp.watch("src/images/svg/**/*.svg", svgdefs).on('change', browserSync.reload);
    gulp.watch("src/images/svg/**/*.svg").on('change',function(path, stats){ svgToLiquid(path) }).on('change', browserSync.reload);
    gulp.watch("src/**/*.liquid").on('change', function(path){ templates(path); }).on('change', browserSync.reload);
    gulp.watch("src/config/settings_schema.json").on('change', function(path){ templates(path); }).on('change', browserSync.reload);
    gulp.watch("src/locales/**/*.json").on('change', function(path){ templates(path); }).on('change', browserSync.reload);
}

// Task: watch - Watch the src files
function watch() {
    gulp.watch('src/styles/**/*.scss',  styles);
    gulp.watch('src/scripts/**/*.js', scripts );
    gulp.watch("src/assets/images/svg/**/*.svg", svgdefs);
    gulp.watch("src/**/*.liquid").on('change', function(path){ template(path) });
    gulp.watch("src/config/settings_schema.json").on('change', function(path){ template(path); });
    gulp.watch("src/locales/**/*.json").on('change', function(path){ template(path); });
}

// Task: clean - delete the files in dist
function clean() {
    return del([
        'dist/**/*'
    ]);
}


exports.serve = serve;
exports.template = template;
exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.svgdefs = svgdefs;
exports.vendorStyles = vendorStyles;
exports.clean = clean;

exports.watch = watch;

exports.default = gulp.series(vendorStyles, styles, scripts, svgdefs, clean, templates, watch);

