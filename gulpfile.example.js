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
//const svgstore = require('gulp-svgstore');
//const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');

/*
 SOURCE FILES
 */
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
        .pipe(gulp.dest('dist/assets/'));
}

function vendorStyles(){
    return gulp.src(cssNpmScripts)
        .pipe(concat('_vendor.scss'))
        .pipe(gulp.dest('src/styles/ac/'));

    //console.log("testing vendorStyles")

}

// compile scss into css
function styles() {
    return gulp.src('src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error',sass.logError))
        // .pipe(postcss([ autoprefixer(), cssnano() ]))
        //.pipe(concat('ac.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/'))
        .pipe(browserSync.stream());
}

function svgdefs() {
    return gulp
        .src('src/images/svg/*.svg')
        //.pipe(svgmin())
        .pipe(rename({prefix: 'icon-'}))
        .pipe(svgstore())
        .pipe(rename("defs.svg.liquid"))
        .pipe(gulp.dest('src/snippets'));
}

function serve() {
    browserSync.init({
        proxy: previewThemeUrl,
        browser: defaultBrowser,
        snippetOptions: {
            rule: {
                match: /<\/body>/i,
                fn: function (snippet, match) {
                    return snippet + match;
                }
            }
        }
    });

    gulp.watch("src/scss/**/*.scss",  styles);
    gulp.watch("src/assets/images/svg/**/*.svg", svgdefs).on('change', browserSync.reload);
    gulp.watch("src/templates/**/*.twig").on('change', browserSync.reload);
    gulp.watch("src/js/**/*.js", scripts ).on('change', browserSync.reload);

}

function watch() {
    gulp.watch('src/styles/**/*.scss',  styles);
    gulp.watch('src/scripts/**/*.js', scripts );
}

exports.serve = serve;
exports.styles = styles;
exports.scripts = scripts;
exports.svgdefs = svgdefs;
exports.vendorStyles = vendorStyles;

exports.watch = watch;
