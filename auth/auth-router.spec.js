const request = require("supertest");
const server = require('../api/server');
const db = require('../database/dbConfig.js');

describe('auth-router', function () {

  beforeEach(async () => {
    await db('users').truncate();
  });


  describe('Empty post /api/auth/register', () => {
    test('It should not allow a bad registration', (done) => {
      request(server).post('/api/auth/register')
        .send({
          username: '',
          password: ''
        })
        .then((response) => {
          expect(response.status).toBe(500);
          expect(response.body).toEqual({ error: "Invalid credentials for creating user" });
          done();
        });
    });
  });

  describe('Test the register path', () => {
    test('Correct post /api/auth/register', (done) => {
      request(server).post('/api/auth/register')
        .send({
          username: 'sydney',
          password: 'secretValue'
        })
        .set('Accept', 'application/json')
        .then(response => {
          expect(response.status).toBe(200);
          done();

        })
    })
  });


  describe('Empty post /api/auth/login', () => {
    test('It should not allow a bad login', (done) => {
      request(server).post('/api/auth/login')
        .send({
          username: '',
          password: ''
        })
        .then((response) => {
          expect(response.body).toEqual({ error: "There was an error signing the user into the database." });

          done();
        });
    });
  });

  describe('Correct post /api/auth/login', () => {
    test('It should allow a good login', (done) => {
      request(server).post('/api/auth/register')
        .send({
          username: 'sydney',
          password: 'secretValue'
        })
        //need to set the user to remember the log in
        .set('Accept', 'application/json').then((createUser) => {
        request(server).post('/api/auth/login')
          .send({
            username: 'sydney',
            password: 'secretValue'
          })
          .then((response) => {
            expect(response.body.user.username).toEqual('sydney');
            done();
          });
      });
    })
  });

})
