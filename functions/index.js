const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.addStudentRole = functions.https.onCall(async (data, context) => {
  console.log("::addStudentRole called with data ", data);
  try {
    let user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, {
      student: true
    });
    return {
      message: `Success! ${data.email} is assigned student role`
    };
  } catch (error) {
    console.log("::addStudentRole ending with error ", error);
    return error;
  }
});
exports.addTeacherRole = functions.https.onCall(async (data, context) => {
  console.log("::addTeacherRole called with data ", data);
  try {
    let user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, {
      teacher: true
    });
    return {
      message: `Success! ${data.email} is assigned teacher role`
    };
  } catch (error) {
    console.log("::addTeacherRole ending with error ", error);
    return error;
  }
});
