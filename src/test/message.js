require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string
const ObjectID = mongoose.Types.ObjectId;
const SAMPLE_MESSAGE_ID = new ObjectID()


describe('Message API endpoints', () => {
    beforeEach((done) => {
        // TODO: add any beforeEach code here
        const sampleUser = new User({
            username: 'username',
            password: 'password',
            _id: SAMPLE_OBJECT_ID
        })

        user.save((err, saveUser) => {
            if(err) {
                return done(err)
            }
            this.userId = saveUser._id
        })

        const sampleMessage = new Message({
            title: 'testTitle',
            body: 'testBody',
            author: user,
            _id: SAMPLE_MESSAGE_ID
        })

        message.save((err, saveMessage) => {
            if(err) {
                return done(err)
            }
            this.messageId = saveMessage._id
            done()
        })
        });
    });

    afterEach((done) => {
        // TODO: add any afterEach code here
        Message.deleteOne({ _id: this.messageId }, (err) => {
            if(err) {
                return done(err)
            }
            User.deleteOne({ _id: this.userId }, (err) => {
                if(err) {
                    return done(err)
                }
                done()
            })
        })
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get('/messages')
        .end((err, res) => {
            if (err) {
                done(err)
            } else {
                expect(res).to.have.status(200)
                expect(res.body.messages).to.be.an('array')
                done()
            }
        })
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        chai.request(app)
            .get(`/messages/${this.messageId}`)
            .end((err, res) => {
                res.should.have.status(200)
                res.should.be.json
                res.body.should.be.a('object')
                res.body.should.have.property('body')
                res.body.should.have.property('author')
                done()
            })     
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        const newMessage = {
            title: 'New Message',
            body: 'Hello. New Message',
            author: this.userId
        }

        chai.request(app)
            .post('/messages')
            .send(newMessage)
            .end((err, res) => {
                res.should.have.status(200)
                res.should.be.json;
                res.body.should.be.a('object')
                res.body.should.have.property('title').equal(newMessage.title)
                res.body.should.have.property('body').equal(newMessage.body)
                res.body.should.have.property('author').equal(String(this.userId))
                done();
            })
    })


    it('should update a message', (done) => {
        // TODO: Complete this
        const updatedMessage = {
            title: 'Update A Message',
            body: 'Hello. Update Message.'
        };

        chai.request(app)
            .put(`/messages/${this.messageId}`)
            .send(updatedMessage)
            .end((err, res) => {
                res.should.have.status(200)
                res.should.be.json;
                res.body.should.be.a('object')
                expect(res.body.message).to.have.property('title', updatedMessage.title)

                Message.findById(this.messageId, (err, message) => {
                    expect(message.title).to.equal(updatedMessage.title)
                    expect(message.body).to.equal(updatedMessage.body)
                    expect(message.author.toString()).to.equal(this.userId.toString())
                    expect(message).to.not.be.null
                    done();
            })
        })
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        chai.request(app)
            .delete(`/messages/${this.messageId}`)
            .end((err, res) => {
                res.should.have.status(200)
                Message.findById(this.messageId, (err, message) => {
                    expect(message).to.equal(null)
                    done()
            })
        })
    })
