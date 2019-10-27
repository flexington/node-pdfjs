let gulp = require('gulp');
let del = require('del');

let ts = require('gulp-typescript');
let project = ts.createProject('tsconfig.json');

gulp.task('clean', () => {
    return del([
        './dist'
    ]);
});

gulp.task('compile', () => {
    return project.src()
        .pipe(project())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('copy-static', () => {
    return gulp.src([
        './src/static/**/*',
        '!./src/static/**/*.ts',
    ])
        .pipe(gulp.dest('./dist/static'));
});

gulp.task('copy-cmaps', () => {
    return gulp.src([
        './node_modules/pdfjs-dist/cmaps/**/*',
    ])
        .pipe(gulp.dest('./dist/static/cmaps'));
});

gulp.task('copy-pdfjs', () => {
    return gulp.src([
        './node_modules/pdfjs-dist/build/pdf.min.js',
        './node_modules/pdfjs-dist/build/pdf.worker.min.js',
    ])
        .pipe(gulp.dest('./dist/static'));
});

gulp.task('copy-jquery', () => {
    return gulp.src([
        './node_modules/jquery/dist/jquery.min.js'
    ])
        .pipe(gulp.dest('./dist/static'));
});

gulp.task('build', gulp.series('clean', 'compile', 'copy-static', 'copy-pdfjs', 'copy-cmaps', 'copy-jquery'));