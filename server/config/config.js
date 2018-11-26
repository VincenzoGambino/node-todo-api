var env = process.env.NODE_ENV || 'development';

switch (env) {
  case'development':
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoApp';
    console.log('env ******', env);
    break;
  case 'test':
    console.log('env ******', env);
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
    break;
}
