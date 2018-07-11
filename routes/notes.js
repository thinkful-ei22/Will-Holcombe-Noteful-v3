'use strict';

const express = require('express');

const router = express.Router();
const Note = require('../models/notes');
/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  let filter = {};
  if (searchTerm) {
    filter.title = { $regex: searchTerm };
  }
  return Note.find(filter).sort({ updatedAt: 'desc' })      
    .then(results => {
      if(results){
        res.json(results);
      }else{
        next();
      }
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  
  
  return Note.findById(id).sort({ updatedAt: 'desc' })      
    .then(results => {
      if(results){
        res.json(results);
      }else{
        next();
      }
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const {title, content} = req.body;
  const newItem = {
    title,
    content
  };
  console.log(newItem);
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  return Note.create(newItem)   
  .then(([result]) => {
    res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
  });

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  console.log('Update a Note');
  res.json({ id: 1, title: 'Updated Temp 1' });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  console.log('Delete a Note');
  res.status(204).end();
});

module.exports = router;