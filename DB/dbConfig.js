let mongoose = require('mongoose')
let dbConnect = () => {
  try {
    mongoose.connect(
      `mongodb+srv://alisajadi001010:${process.env.DB_PASS}@ali.m6pjpq7.mongodb.net/Auth?retryWrites=true&w=majority&appName=ali`
    );
    console.log('mongodb connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnect;
