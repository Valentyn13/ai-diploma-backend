const httpStatus = require('http-status');
const Category = require('../models/category.model');
const Meditation = require('../models/meditation.model');
const Course = require('../models/course.model');
const Instructor = require('../models/instructor.model');

exports.initSchema = async (req, res, next) => {
  try {
    const createdModels = {};

    const { deleteOnly } = req.body;


    await Category.deleteMany({});
    await Instructor.deleteMany({});
    await Meditation.deleteMany({});
    await Course.deleteMany({});

    if (deleteOnly) {
      res.status(httpStatus.OK);
      res.json({ status: 'all collections deleted' });
      return;
    }

    // Categories

    const category1 = new Category();
    category1.name = 'sleep';
    category1.title = 'שינה';
    category1.info = 'משפט או שניים המסבירים על הקטגוריה. צריך להיות מושך ולא מאיים. וגם בלה בלה';
    const savedCategory1 = await category1.save();

    const category2 = new Category();
    category2.name = 'army';
    category2.title = 'צבא';
    category2.info = 'משפט או שניים המסבירים על הקטגוריה. צריך להיות מושך ולא מאיים. וגם בלה בלה';
    const savedCategory2 = await category2.save();

    createdModels.categories = [savedCategory1, savedCategory2];

    // Instructors

    const instructor = new Instructor();
    instructor.name = 'דנה מאיר';
    instructor.info = 'דנה מאיר היא מורת מדיטציה ופסיכולוגית בשרות משרד החינוך';
    const savedInstructor = await instructor.save();
    createdModels.instructors = [savedInstructor];

    // Meditations

    const meditation1 = new Meditation();
    meditation1.name = 'שינה יותר טובה';
    meditation1.url = 'https://www.avihay.net/wp-content/uploads/2017/12/hebcorazon.mp3';
    meditation1.categories = [
      category1.id,
    ];
    meditation1.instructor = instructor.id;
    meditation1.duration = 200;
    const savedMeditation1 = await meditation1.save();

    const meditation2 = new Meditation();
    meditation2.name = 'לפני אימון';
    meditation2.url = 'https://www.avihay.net/wp-content/uploads/2017/12/hebcorazon.mp3';
    meditation2.categories = [
      category2.id,
    ];
    meditation2.instructor = instructor.id;
    meditation2.duration = 400;
    const savedMeditation2 = await meditation2.save();

    const meditation3 = new Meditation();
    meditation3.name = 'איך נושמים';
    meditation3.url = 'https://www.avihay.net/wp-content/uploads/2017/12/hebcorazon.mp3';
    meditation3.duration = 315;

    const savedMeditation3 = await meditation3.save();

    createdModels.meditations = [
      savedMeditation1,
      savedMeditation2,
      savedMeditation3,
    ];

    // Courses

    const course = new Course();
    course.instructor = instructor.id;
    course.name = 'קורס ראשון';
    course.info = "אי אפשר להתעלם מהיתרונות הרבים של לימוד מדיטציה בקבוצה, במסגרת קורס, סדנה, 'ריטריט' (Retreat) או מפגשי תרגול קבועים, אך לימוד מדיטציה אחד על אחד עם מורה למדיטציה מכיל תועלות חשובות ויוצאות דופן.ציה בקבוצה, במסגרת קורס, סדנה, 'ריטריט' (Retreat) או מפגשי תרגול קבועים, אך לימוד מדיטציה אחד על אחד עם מורה למדיטציה מכיל תועלות חשובות ויוצאות דופן. ציה בקבוצה, במסגרת קורס, סדנה, ריטריט (Retreat) או מפגשי תרגול קבועים, אך לימוד מדיטציה אחד על אחד עם מורה למדיטציה מכיל תועלות חשובות ויוצאות דופן.";
    course.meditations = [
      meditation3.id,
    ];
    const savedCourse = await course.save();
    createdModels.courses = [savedCourse];

    res.status(httpStatus.CREATED);
    res.json(createdModels);
  } catch (error) {
    next(error);
  }
};
