module.exports = {
    watch: {
        ts_demo: {
            files: 'demo/**/*.ts',
            tasks: ['ts:demo'],
            options: {
                livereload: true,
            },
        },
        ts_lib: {
            files: 'src/**/*.ts',
            tasks: ["ts:debug", "bowercopy:src_demo"],
            options: {
                livereload: true,
            },
        },
    }
}