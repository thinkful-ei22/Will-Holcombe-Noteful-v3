'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Note = require('../models/notes');

const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId } = req.query;
  console.log(searchTerm, folderId);


  let filter = {};
//pay special attention to regex vs. just $and = makes dynamic
  if (searchTerm) {
    filter.$or = [{title: {$regex: searchTerm, $options: 'i'}},
      {content: {$regex: searchTerm, $options: 'i'}}];
  }
  //{ $regex: searchTerm, $options: 'i' };

    //

  // Mini-Challenge: Search both `title` and `content`
  // const re = new RegExp(searchTerm, 'i');
  // filter.$or = [{ 'title': re }, { 'content': re }];
  
  if(folderId){
    filter.$and =[{folderId}];
    //folderId = folderId;  // NOT { $regex: folderId, $options: 'i'};

  }
  Note.find(filter)
    //.populate('folderId') //sort of joins but not actually
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req,  res, next) => {
  const { id } = req.params;


  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);

  

    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {

  const { title, content, folderId } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if(folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('folderId is not valid!');
    err.status = 400;
    return next(err);
  }

  const newNote = { title, content };


  Note.create(newNote)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id, folderId } = req.params;
  const { title, content } = req.body;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('folderId is not valid!');
    err.status = 400;
    return next(err);
  }

  const updateNote = { title, content };

  Note.findByIdAndUpdate(id, updateNote, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;