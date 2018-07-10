'use strict';

const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/notes');

mongoose.connect(MONGODB_URI)
  .then(() => {
    const searchTerm = /article/i;
    let filter = {};

    if (searchTerm) {
      filter.title = { $regex: searchTerm };
    }
    /*
    find({$or: [{ title:{$regex: /searchTerm/i}}, {content:
    {$regex: /`${searchTerm}`/i}}]});
*/
return Note.find({$or : [filter, {content: { $regex: searchTerm }}]}).sort({ updatedAt: 'desc' });
  })       
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

  // mongoose.connect(MONGODB_URI)
  // .then(() => {
  //   const id = '000000000000000000000002';
   

  //   return Note.findById(id);
  // })    
  // .then(results => {
  //   console.log(results);
  // })
  // .then(() => {
  //   return mongoose.disconnect()
  // })
  // .catch(err => {
  //   console.error(`ERROR: ${err.message}`);
  //   console.error(err);
  // });


//CREATE

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const newItem = {
//         title: 'Guns and Baguettes',
//         content: 'French peace for a chance'
//     };
   

  //   return Note.create(newItem);
  // })    
  // .then(results => {
  //   console.log(results);
  // })
  // .then(() => {
  //   return mongoose.disconnect()
  // })
  // .catch(err => {
  //   console.error(`ERROR: ${err.message}`);
  //   console.error(err);
  // });

//FIND BY ID AND UPDATE
// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const id = ("000000000000000000000002");
//     const newItem = {
//         title: 'Guns and Baguettes',
//         content: 'French peace for a chance'
//     };
// return Note.findByIdAndUpdate(id, newItem,
//    {new:true, upsert: true});
// })    
// .then(results => {
//   console.log(results);
// })
// .then(() => {
//   return mongoose.disconnect()
// })
// .catch(err => {
//   console.error(`ERROR: ${err.message}`);
//   console.error(err);
// });

//FIND BY ID AND REMOVE

// mongoose.connect(MONGODB_URI)
//   .then(() => {
//     const id = ("000000000000000000000002");
    
// return Note.findByIdAndRemove(id);
// })    
// .then(results => {
//   console.log(results);
// })
// .then(() => {
//   return mongoose.disconnect()
// })
// .catch(err => {
//   console.error(`ERROR: ${err.message}`);
//   console.error(err);
// });