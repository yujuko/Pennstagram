const app = require('./server.js') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)
const User = require('./server/datasets/users');
const Upload = require('./server/datasets/posts');
const mongoose = require('mongoose');
var conn = mongoose.connection;
ObjectID = require('mongodb').ObjectID;
const body = { "email": "test@gmail.com", "password": "Password123" }
const userDoesntExist = { "email": "doesnt2@exist.com", "password": "Password123" }
const postImageBody = {
    user: 'Tom A. User',
    userId: '557',
    profilePic: 'https://i.stack.imgur.com/34AD2.jpg',
    postUpload: '/uploads/url.jpg',
    caption: 'this is a caption!'
}
const user1 = '123';
const user2 = '345';
const postActualImageBody = { userId: user1 }
const postActualImageBody2 = { userId: user2 }
const getImageBody = { following: [postActualImageBody] };
const followUser = { userId: user1, posterId: user2 }


jest.setTimeout(10500);

//dummy user u for testing
const u = new User();
conn.collection('users').insert(u);

//dummy user v for testing
const v = new User();
conn.collection('users').insert(v);

//dummy post p for testing
const p = new Upload();
conn.collection('posts').insert(p);


let server;
beforeAll(async() => {
    server = await app.listen(3001);
    // await mongoose.connect("mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb",
    //     { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    //         if (err) {
    //             console.error(err);
    //             process.exit(1);
    //         }
    //     });
});
afterAll(async(done) => {
    await server.close(done);
    mongoose.disconnect();
});


it('Has App Defined', () => {
    expect(app).toBeDefined();
});

it('gets the test endpoint', async done => {
    const response = await request.get('/')
    expect(response.status).toBe(200)
    done()
})

it('Can Register a User', async() => {
    await supertest(server)
        .post('/api/user/signup')
        .send(body)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

it('Can Login a User', async() => {
    await request
        .post('/api/user/login')
        .send(body)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});



it('Places uploaded photo and caption on page; yields 200', async() => {
    await supertest(server)
        .post('/api/post/post')
        .send(postImageBody)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

it('Retrieves the images only if user is following; yields 200', async() => {
    await supertest(server)
        .post('/api/post/get')
        .send(getImageBody)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//addAct
it('adds activity', async() => {
    await supertest(server)
        .post('/api/activity/addact')
        .send({ username: 'tom', userId: '557', posterUsername: 'tom', caption: 'this is a caption!' })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//getAct
it('gets activity', async() => {
    await supertest(server)
        .post('/api/activity/getacts')
        .send({ username: 'tom', userId: '557', posterUsername: 'tom', caption: 'this is a caption!' })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});


// postImage
it('posts image', async() => {
    await supertest(server)
        .post('/api/post/post')
        .send({
            email: "test@gmail.com",
            username: "tom",
            password: "123",
            image: "image.jpg",
            bio: "this is my bio!",
            following: [{ userId: user2 }],
            followers: [{ userId: user2 }],
            likes: [{ postId: "999" }]
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//getImage
it('gets image; following', async() => {
    await supertest(server)
        .post('/api/post/get')
        .send({
            email: "test@gmail.com",
            username: "tom",
            password: "123",
            image: "image.jpg",
            bio: "this is my bio!",
            following: [{ userId: user2 }],
            followers: [{ userId: user2 }],
            likes: [{ postId: "999" }]
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//getImage
it('gets image; not following', async() => {
    await supertest(server)
        .post('/api/post/get')
        .send({
            email: "test@gmail.com",
            username: "tom",
            password: "123",
            image: "image.jpg",
            bio: "this is my bio!",
            followers: [{ userId: user2 }],
            likes: [{ postId: "999" }]
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//postActualImage
it('attempts to post bad image', async() => {
    await supertest(server)
        .post('/api/upload/post')
        .send({ userId: '557' }, {
            files: {
                file: {
                    fieldName: 'file',
                    originalFilename: 'Screen Shot 2019-11-19 at 2.18.59 PM.png',
                    path: '/var/folders/dj/bb533f6j73j5fpjvj2tndj7w0000gn/T/vnQVoEh2hwQWIWnJW7EYs-Us.png',
                    name: 'Screen Shot 2019-11-19 at 2.18.59 PM.png',
                    type: 'image/png'
                }
            }
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(500)
});


//updateUsername
it('changes username to bobby tables', async() => {
    await supertest(server)
        .post('/api/profile/updateUsername')
        .send({ userId: u._id, username: 'bobby tables' })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});


//updateBio
it('changes bio for bobby tables', async() => {
    await supertest(server)
        .post('/api/profile/updateBio')
        .send({ userId: u._id, bio: 'hello i am bobby tables' })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});


//updatePhoto
it('attempts to modify profile pic with no file', async() => {
    await supertest(server)
        .post('/api/profile/editPhoto')
        .send({ userId: '557' })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(500)
});

//getUsers
it('gets all users', async() => {
    await supertest(server)
        .get('/api/users/get')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//caption
it('caption', async() => {
    await request
        .post('/api/post/comment')
        .send({
            userId: u._id,
            username: u.username,
            postId: p._id,
            comment: 'here is a caption for ya'
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//followUser -- test gets code coverage and does as expected but does not terminate, so it fails :(
it('u follows v -- test gets code coverage and does as expected but does not terminate, so it fails :(', async() => {
    await request
        .post('/api/users/follow')
        .send({
            userId: u._id,
            posterId: v._id
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

it('u unfollows v -- test gets code coverage and does as expected but does not terminate, so it fails :(', async() => {
    await request
        .post('/api/users/unfollow')
        .send({
            userId: u._id,
            posterId: v._id
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});


//likeImage
it('likeImage', async() => {
    await request
        .post('/api/post/likes')
        .send({
            userId: u._id,
            postId: p._id
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//likeImage
it('unlikeImage', async() => {
    await request
        .post('/api/post/unlikes')
        .send({
            userId: u._id,
            postId: p._id
        })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//delete post
it('delete post', async() => {
    await supertest(server)
        .post('/api/post/delete')
        .send({ postId: p._id })
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200)
});

//update post
// it('update post', async() => {
//     await request
//         .post('/api/post/update')
//         .send({
//             postId: p._id,
//             caption: 'actually this caption is better'
//         })
//         .set('Accept', 'application/json')
//         .set('Content-Type', 'application/json')
//         .expect(200)
// });


// //delete comment
// it('delete comment', async() => {
//     await request
//         .post('/api/post/comment/delete')
//         .send({
//             postId: p._id,
//             commentId: unsure how to get this
//         })
//         .set('Accept', 'application/json')
//         .set('Content-Type', 'application/json')
//         .expect(200)
// });


/* ignore below */

// it("Tries to login user who doesn't exist", async() => {
//     await request
//         .post('/api/user/login')
//         .send(userDoesntExist)
//         .set('Accept', 'application/json')
//         .set('Content-Type', 'application/json')
//         .expect(400)
// });


// it("Attempts to upload image that doesn't exist ; yields 500", async() => {
//     await supertest(server)
//         .post('/api/upload/post')
//         .send(postActualImageBody)
//         .set('Accept', 'application/json')
//         .set('Content-Type', 'application/json')
//         .expect(500)
// });
