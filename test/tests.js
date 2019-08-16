const expect=require("chai").expect
const auth=require("./../controller/auth_controller")
const sinon=require("sinon")
const User=require('./../models/user')

const assert=require('assert')
const auth_route=require('./../routes/auth_route')
const request=require('supertest')
const chai=require('chai')
const chai_http=require('chai-http')
const mongoose=require('mongoose')

const route=require("./../routes/route")

chai.use(chai_http);

const app=require('./../index')


describe('Autentication tesing',function(){
    

    it('should verify if the get "/" route is working ',function(done){
        chai.request('http://localhost:3000')
            .get('/contact')
            .end(function(err, res) {
                expect(res).to.have.status(200); 
                done()   // <= Test completes before this runs
              });  
    })

    it('should verify if the get "/checkout" route is working ',function(done){
        chai.request('http://localhost:3000')
            .get('/checkout')
            .end(function(err, res) {
                expect(res).to.have.status(200); 
                done()   // <= Test completes before this runs
              });  
    })

    it('should verify if the get "/item/:id" route is working ',function(done){
        chai.request('http://localhost:3000')
            .get('/item/5d5531911ab79a27f46137f7')
            .end(function(err, res) {
                expect(res).to.have.status(200); 
                done()   // <= Test completes before this runs
              });  
    })

    it('should verify if redirect is working when autentication is required ',function(done){
        chai.request('http://localhost:3000')
            .get('/admin_panel')
            .end(function(err, res) {
                expect(res).to.redirectTo('http://localhost:3000/'); 
                done()   // <= Test completes before this runs
              });  
    })

    it('should verify if the get "/admin_panel" route is working with autentication ',function(done){
        chai.request('http://localhost:3000')
            .get('/admin_panel')
            .auth('croitorgheorghita@yahoo.com','asdfgh')
            .end(function(err, res) {
                expect(res).to.have.status(200); 
                done()   // <= Test completes before this runs
              });  
    })
    /*before(function() {
        return this.spy = sinon.spy(auth_route, 'render');
      });
      after(function() {
        return this.spy.restore();
      });

      it('should exist', function() {
        return request(auth_route).get('/').expect(200);
      });
      return it('should render the "index" view', function() {
        return expect(this.spy.getCall(0).args[0]).to.be.eql('index');
      });*/

   // it('should exist ',function(done){

   // })
   /*it('should show a message if the email is not in database',function(done){

    const req={
        body:{
            email: 'test@yahoo.com',
            password: 'test'
        }
    }
    const res={
       render: sinon.spy()
    }

    console.log('11111',res)
    auth.login(req,res).then(response=>{
        console.log('1',res.spy.args[0])
        return expect(res.spy.getCall(0).args[0]).to.be.eql('account')
    })
    done()
  })
    
  /*return it('should show a message ',function(){
    let con=request(auth_route).get('/account')
    
    chai.request(auth_route).get('/account').end((res)=>{
        console.log(res.render)
    })
    
    //.end((err,res)=>{
      //  console.log(res)
   // })

    /*request(auth_route)
        .get('/account')
        .then((response)=>{
            assert.equal(response.status, 200)
        })
    
  })*/

  /*it('should show a message ',function(done){

    var req = {
        body:{
            email: 'test@yahoo.com',
            password: 'test'
        }
    };
    res = {
        render: function(view, viewData) {
            console.log('asas',view)
            view.should.equal('accdount')
            }}

      console.log("aici")
      auth.login(req,{}).then((resul)=>{
          console.log(resul)
      }) 
   done()
  })*/

})
