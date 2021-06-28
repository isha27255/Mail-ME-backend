const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MailSchema = new Schema({
 to : {
    type: String,
    required: true
  } ,
  cc : {
      type: String,
      required: true
  },
  subject : {
    type: String,
    required: true
  },
  schedule : {
    type: String,
    required: true
  },
  recur: {
      type: Number,
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  weekly_day: {
    type: Number,
  },
  mail_body : {
    type: String,
    required: true
  },
  user : 
    {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }

},
{
    timestamps: true
});

module.exports = Mail = mongoose.model("Mail", MailSchema);