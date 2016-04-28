module.exports = {
    connect: {
        options: {
            port: 49632 /* 9000 pb of authentication */,
            // Change this to '0.0.0.0' to access the server from outside.
            hostname: 'localhost',
            livereload: 35729
        },
        demo: {
            options: {
                open: true,
                base: [
                  '<%= demoFolder %>'
                ],
                // middleware: function (connect, options) {
                //     var middlewares = [];
                //     middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
                //     options.base.forEach(function (base) {
                //         middlewares.push(connect.static(base));
                //     });
                //     return middlewares;
                // }
            }
        },
    }
}