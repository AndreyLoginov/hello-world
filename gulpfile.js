var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    babel = require("gulp-babel"),
    browserify = require("browserify"),
    babelify = require("babelify"),
    source = require("vinyl-source-stream");

    gulp.task('scss', function() {
        return gulp.src('app/scss/*.scss') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true}))
    });

    gulp.task('bs', function() {
        browserSync({ // Выполняем browser Sync
            server: { // Определяем параметры сервера
                baseDir: 'app' // Директория для сервера - app
            },
            notify: false // Отключаем уведомления
        });
    });

    gulp.task("react", function () {
	  // return gulp.src("app/js/index.js")
	  return browserify({
            entries: 'app/js/index.jsx',
            extensions: ['.jsx'],
            debug: true
        })
	  	.transform(babelify, {presets: ["env", "react"]})
	  	.bundle()
	  	.on('error', (err) => {
            console.error(err.message);
        })
        .pipe(source('app.js'))
	    // .pipe(babel())
	    .pipe(gulp.dest("app/js"));
	});

    gulp.task('jsx', ['react'], function() {
        browserSync.reload;
    });

    gulp.task('watch', ['bs', 'scss', 'react'], function() {
        gulp.watch('app/scss/*.scss', ['scss']); // Наблюдение за sass файлами
        gulp.watch('app/*.html', browserSync.reload);
        gulp.watch('app/js/*.jsx', ['react']);
        gulp.watch('app/js/*.js', browserSync.reload);
    });

    gulp.task('scripts', function() {
        return gulp.src([ // Берем все необходимые библиотеки
            'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
            'app/libs/glidejs/dist/*.min.js'
            ])
            .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
            .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
    });