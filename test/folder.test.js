'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folders');


const seedFolders = require('../db/seed/folders');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Folders API resource', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI )
      .then(() => mongoose.connection.db.dropDatabase());
  });
    
  beforeEach(function () {
   
    return Promise.all([
      Folder.insertMany(seedFolders),
      Folder.createIndexes()
    ]);
  });
    
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
    
  after(function () {
    return mongoose.disconnect();
  });
    
  describe('GET /api/folders',function () {
    it('should return complete list of folders', function () {
      let res;
      return chai.request(app)
        .get('/api/folders')

        .then((_res) => {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length.of.at.least(1);
    
          return Folder.find()
            .then(function(data) {
              expect(res.body).to.have.length(data.length);
            });

        });
    });
  });

  describe('GET /api/folders/:id', function () {
    it('should return folder by id', function () {
      let data;
      return Folder.findOne()
        .then(_data => {
          data = _data;
          
          return chai.request(app).get(`/api/folders/${data.id}`);

        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });
  

  describe('POST /api/folders', function () {
    it('should create and return a new item when given valid data', function () {

      const newItem = {
        'name': 'Alita Battle Angel',
      };

      let res;
      return chai.request(app)
        .post('/api/folders')
        .send(newItem)
        .then(function (_res) {
          //this is necessary to use _res (res for this promise) in the next promise
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Folder.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('PUT /api/folders/:id', function () {
    it('should update item and return said item if provided valid data', function () {
      const updateItem = {
        'name': 'Merovingian'
      };
      let res, data;
      return Folder.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).put(`/api/folders/${data.id}`)
            .send(updateItem);
        })
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
            
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Folder.findById(res.body.id);
        })
      // 3) then compare the API response to the database results
        .then(updatedData => {
          expect(res.body.id).to.equal(updatedData.id);
          expect(res.body.name).to.equal(updatedData.name);
          expect(new Date(res.body.createdAt)).to.eql(updatedData.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(updatedData.updatedAt);
        });
        
    });
  });



});