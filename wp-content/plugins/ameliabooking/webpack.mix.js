let mix = require('laravel-mix')

mix.setResourceRoot('../../')

mix.setPublicPath('public')

mix
  .js('assets/js/backend/amelia-booking.js', 'public/js/backend')
  .js('assets/js/frontend/amelia-booking.js', 'public/js/frontend')
  .less('assets/less/backend/amelia-booking.less', 'public/css/backend')
  .less('assets/less/external/vendor.less', 'public/css/frontend')
  .less('assets/less/external/quill.less', 'public/css/frontend')
  .less('assets/less/frontend/amelia-booking.less', 'public/css/frontend/amelia-booking-1-2-23.css')
  .less('assets/less/backend/elementor.less', 'public/css/frontend')
  .copyDirectory('assets/img', 'public/img')
  .copyDirectory('extensions/wpdt/assets/css', 'public/css/backend')
  .copyDirectory('extensions/wpdt/assets/img', 'public/wpdt/img')
  .copyDirectory('assets/json', 'public/json')
  .copyDirectory('assets/js/tinymce', 'public/js/tinymce')
  .copyDirectory('assets/js/gutenberg', 'public/js/gutenberg')
  .copyDirectory('assets/js/plugins', 'public/js/plugins')
  .copyDirectory('assets/js/paddle', 'public/js/paddle')
  .copyDirectory('assets/js/wc', 'public/js/wc')
  .webpackConfig({
    entry: {
      app: ['idempotent-babel-polyfill', './assets/js/backend/amelia-booking.js', './assets/js/frontend/amelia-booking.js']
    },
    output: {
      chunkFilename: process.env.NODE_ENV !== 'production' ? 'js/chunks/amelia-booking-[name].js' : 'js/chunks/amelia-booking-[name]-[hash].js',
      publicPath: '',
      jsonpFunction: 'wpJsonpAmeliaBookingPlugin'
    }
  })

if (!mix.inProduction()) {
  mix.sourceMaps()
}
