const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const QuestionSchema = new Schema({
  questionText: { type: String, required: true },
  answer: { type: String, required: true },
  distractors: { type: String, required: true }
});
let QuestionModel;

export default class QuestionTransaction {
  static hello() {
    console.log('Hello');
    return 'hello';
  }

  static async closeDatabase(env) {
    mongoose.connection.close();
  }

  static createQuestion(questionText, answer, distractors) {
    // TODO: See if I can substitute variable above
    let data = mongoose.model('Questions', QuestionSchema)();
    data.questionText = questionText;
    data.answer = answer;
    data.distractors = distractors;
    return new Promise((resolve, reject) => {
      data.save((err, doc) => {
        retVal = returnRequestForDoc(err, doc);
        resolve(retVal);
      });
    });
  }

  static async deleteAllQuestions() {
    return new Promise((resolve, reject) => {
      QuestionModel.remove({}, (err, result) => {
        retVal = returnResultOrThrowErr(err, result);
        resolve(retVal);
      });
    });
  }

  static async deleteQuestionById(id) {
    return new Promise((resolve, reject) => {
      QuestionModel.findByIdAndRemove(id, (err, doc) => {
        retVal = returnRequestForDoc(err, doc);
        resolve(retVal);
      });
    });
  }

  static async getCountAllQuestions() {
    return new Promise((resolve, reject) => {
      QuestionModel.count({}, (err, count) => {
        retVal = returnResultOrThrowErr(err, count);
        resolve(retVal);
      });
    });
  }

  static getQuestions() {
    return new Promise((resolve, reject) => {
      QuestionModel.find((err, doc) => {
        retVal = returnRequestGeneric(err, doc);
        resolve(retVal);
      });
    });
  }

  static returnRequestForDoc(err, doc) {
    if (err) {
      return {
        success: false,
        message: err.message,
        errorDetail: err
      };
    } else if (!doc) {
      return { success: false, message: 'No record found.' };
    } else {
      message = 'Doc ' + doc.questionText + ' processed.';
      return { success: true, message: message, data: doc };
    }
  }

  static returnRequestGeneric(err, docs) {
    if (err) {
      return {
        success: false,
        message: err.message,
        errorDetail: err
      };
    } else {
      message = 'Request processed.';
      return { success: true, message: message, data: docs };
    }
  }

  static returnResultOrThrowErr(err, result) {
    if (err) {
      throw err;
    } else {
      return result;
    }
  }

  static async startDatabase(env) {
    const dbRoute = 'mongodb://localhost/ethanstromingerdb' + env;
    mongoose.connect(dbRoute, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.once('open', () => console.log('connected to the database ' + dbRoute));
    db.on(
      'error',
      console.error.bind(console, 'MongoDB connection error: ' + dbRoute)
    );
    QuestionModel = mongoose.model('Question', QuestionSchema);
  }
}
console.log('XXXX');