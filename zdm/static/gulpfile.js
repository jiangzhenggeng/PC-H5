/**
 * Created by wuhongshan on 2017/4/6.
 */
var router='./dist';
var gulp=require('gulp');
var uglify=require('gulp-uglify');
var concat=require('gulp-concat');
var css=require('gulp-minify-css')
var less=require('gulp-less');
var amdOptimize=require('amd-optimize');
var livereload=require('gulp-livereload');
gulp.task('js',function(){
    gulp.src(['./develope/js/*.js'])
        .pipe(amdOptimize('main',{
            paths:{
                'jquery':'./develope/js/lib/jquery.min'
            },
            shim:{

            }
        }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(''+router+'/js'));
});
gulp.task('less',function () {
    gulp.src(['./develope/less/*.less'])
        .pipe(less())
        .pipe(css())
        .pipe(gulp.dest(''+router+'/css'))
        .pipe(livereload());
});

gulp.task('default',['js','less'],function(){
    livereload.listen();
    gulp.watch('./develope/less/*.less',['less'])
    console.log('成功');
});