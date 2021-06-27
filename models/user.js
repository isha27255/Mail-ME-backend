const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 firstname : {
    type: String,
    trim: true,
    required: true
  } ,
  lastname: {
      type: String,
      trim: true,
      required: true
  },
  username: {
      type: String,
      trim: true,
      required: true
  },
  email: {
      type: String,
      trim: true,
      required: true
  },
  password: {
    type: String,
    trim: true,
    required: true,
    validate: [
        function (input) {
          return input.length >= 6;
        },
        'Password should be longer.',
      ],
  }, 
  encrypt_pass: {
        type: String,
        trim: true
  },
  mails : [
      {
          type: Schema.Types.ObjectId,
          ref: 'Mail',
      }
  ]
},{
    timestamps: true
});

module.exports = User = mongoose.model("User", UserSchema);