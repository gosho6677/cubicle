module.exports = {
    development: {
        port: process.env.PORT || 3000
    },
    COOKIE_NAME: 'SESSION_DATA',
    TOKEN_SECRET: 'some idiomatic secret',
    production: {}
};