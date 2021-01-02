module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    //CLIENT_ORIGIN: 'https://keepbox.vercel.app/', 
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/keepbox',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://dunder_mifflin@localhost/keepbox-test",
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1h',
  }