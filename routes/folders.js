'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Folder = require('../models/folders');

const router = express.Router();

router.get('/', (req, res, next) => {
    
    
  Folder.find()
    
    .sort({ name: 'asc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
  
router.get('/:id', (req, res, next) => {
    
  const {id} = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findById(id)
    
    .sort({ name: 'asc' })
    .then(result => {
      if(result){
        res.location(`${req.originalUrl}/${result.id}`)
          .status(200)
          .json(result);
      }
      //request succeeded but no content
      else{
        next();
      }

    })
    .catch(err => {
      next(err);
    });
});


router.post('/', (req, res, next) =>{
  const {name} = req.body;
  const newFolder = {name};

  if(!name){
    const err = new Error('The `name` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.create(newFolder)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});


router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const updateName = { name };

  if(!name){
    const err = new Error('The `name` is not valid');
    err.status = 400;
    return next(err);
  }

  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Folder.findByIdAndUpdate(id, updateName, { new: true})
    .then(result => {
      if(result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) =>{
  const {id} = req.params;
  Folder.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});



module.exports = router;