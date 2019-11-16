const request = require('supertest');

const server = require('./server');

it('Should set db env to test', function () {
    expect(process.env)
  })
  describe('server', function () {
    describe('Get /', function () {
      it('should return 200 ok', function () {
        request(server).get('/').then(response => {
          expect(response.status).toBe(200);
        });
      });
      it('should return JSON formatted response', function () {
        request(server).get('/').then(response => {
          expect(response.type).toMatch(/json/i);
        });
      });
      it('should return Json formatted response', function () {
        request(server).get('/').then(response => {
          expect(response.body).toEqual({ api: "running" });
        });
      });
    });
  });