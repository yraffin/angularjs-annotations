module.exports = {
    watch: {
        ts_demo: {
            files: 'demo/**/*.ts',
            tasks: ['ts:demo'],
            options: {
                livereload: true,
            },
        },
        ts: {
            files: 'src/**/*.ts',
            tasks: ['ts:dist', 'bowercopy:dist'],
            options: {
                livereload: true,
            },
        },
    }
}