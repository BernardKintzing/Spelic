/**
 * @description object to hold teacher profile
 * 
 * @var teacher
 * @param {firebase.auth().user} auth
 * @param {[student]} students
 * @param {[word]} words
 */
var teacher = {
    auth: null,
    students: [],
    words: []
}

/**
 * @description object to hold student profile
 * 
 * @var student
 * @param {firebase.auth().user} auth
 */
var student = {
    auth: null
}

/**
 * @description object to hold a word and its hint
 * 
 * @var customWord
 * @param {String} word
 * @param {String} hint
 */
var customWord = {
    word: "",
    hint: ""
}