import db from '../fixtures/db.json'
import userInfo from '../fixtures/users.json'
import { faker } from '@faker-js/faker';

db.posts[0].id = faker.number.int();
db.posts[0].title = faker.word.words();
db.posts[0].author = faker.person.firstName();


it('+Register a new user', () => {
  cy.request({
    method: 'POST',
    url: '/register',
    body: userInfo,
    failOnStatusCode: false
  }).then(response => {
    console.log(response)
    cy.log(`Request body: ${response.body.accessToken}`)
    console.log(`Request body: ${JSON.stringify(userInfo)}`)
    expect(response.status).to.be.equal(201);
    expect(response.body.user.email).to.be.equal(userInfo.email);
  })
})

it('+Log an existing user', () => {
  cy.request({
    method: 'POST',
    url: '/login',
    body: userInfo,
    failOnStatusCode: false
  }).then(response => {
    console.log(response)
    cy.log(`Request body: ${response.body.accessToken}`)
    console.log(`Request body: ${JSON.stringify(userInfo)}`)
    expect(response.status).to.be.equal(200);
    expect(response.body.user.email).to.be.equal(userInfo.email);
  })
})

it('+1.Get all posts. Verify HTTP response status code and content type.', () => {
  cy.request('GET', '/posts').then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.headers["content-type"]).to.be.equal('application/json; charset=utf-8');
  })
})

it('+2.Get only first 10 posts. Verify HTTP response status code. Verify that only first posts are returned.', () => {
  cy.request('GET', '/posts?_start=0&_end=10').then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.body.length).to.be.equal(10);
  })
})

it('+3.Get posts with id = 55 and id = 60. Verify HTTP response status code. Verify id values of returned records.', () => {
  cy.request('GET', '/posts/?id=55&id=60').then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.body[0].id).to.be.equal(55);
    expect(response.body[1].id).to.be.equal(60);
  })
})

it('+4.Create a post. Verify HTTP response status code.', () => {

  cy.request({
    method: 'POST',
    url: '/664/posts',
    body: db.posts[0],
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.be.equal(401);
  })
})

it('+5.Create post with adding access token in header. Verify HTTP response status code. Verify post is created.', () => {


  cy.log('Login to get access token');
  cy.request({
    method: 'POST',
    url: '/login',
    body: userInfo,
    failOnStatusCode: false,
  }).then((response) => {
    cy.log(`Request body: ${JSON.stringify(userInfo)}`);
    expect(response.status).to.equal(200);
    expect(response.body.accessToken).to.exist;

    cy.log('Post request to create a post with header');
    cy.request({
      method: 'POST',
      url: '/664/posts',
      headers: {
        'Authorization': `Bearer ${response.body.accessToken}`,
        'Content-Type': response.headers["content-type"]
      },
      body: db.posts[0]

    }).then((response) => {
      expect(response.status).to.equal(201);

      cy.request('GET', `/posts/${db.posts[0].id}`)
        .then(response1 => {
          expect(response1.status).to.be.equal(200);
          expect(response1.body.id).to.be.equal(db.posts[0].id);
          expect(response1.body.title).to.be.equal(db.posts[0].title);
          expect(response1.body.author).to.be.equal(db.posts[0].author);
        })
    });
  });
});

it('+6.Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body.', () => {

  let req = { "id": 104, "title": "some title", "author": "nass" }

  cy.log('Create post entity');
  cy.request({
    method: 'POST',
    url: '/posts',
    body: req
  }).then(response => {
    expect(response.status).to.be.equal(201);

    cy.log('verify that the entity is created');
    cy.request('GET', '/posts/104')
      .then(response => {
        expect(response.status).to.be.equal(200);
        expect(response.body.id).to.be.equal(req.id);
      })
  })
})

it('+7.Update non-existing entity. Verify HTTP response status code.', () => {

  cy.request({
    method: 'PUT',
    url: '/posts',
    body: db.posts,
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.be.equal(404);
  })
})

it('+8.Create post entity and update the created entity. Verify HTTP response status code and verify that the entity is updated.', () => {

  db.posts[0].id = faker.number.int();

  cy.log('Create post entity')
  cy.request({
    method: 'POST',
    url: '/posts',
    body: db.posts[0]
  }).then(response => {
    expect(response.status).to.be.equal(201);

    cy.log('Update created entity')

    db.posts[0].title = 'Another title';
    db.posts[0].author = 'Another author';

    cy.request({
      method: 'PUT',
      url: `/posts/${db.posts[0].id}`,
      body: db.posts[0],
    }).then(response2 => {
      expect(response2.status).to.be.equal(200);
      expect(response2.body.title).to.be.equal(db.posts[0].title);
      expect(response2.body.author).to.be.equal(db.posts[0].author);
    })
  })
})

it('+9.Delete non-existing post entity. Verify HTTP response status code.', () => {

  cy.request({
    method: 'DELETE',
    url: '/posts',
    body: db.posts[0],
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.be.equal(404);
  })
})

it('+10.Create post entity, update the created entity, and delete the entity. Verify HTTP response status code and verify that the entity is deleted.', () => {
  
  db.posts[0].id = faker.number.int();

  cy.log('Create post entity')
  cy.request({
    method: 'POST',
    url: '/posts',
    body: db.posts[0]
  }).then(response => {
    expect(response.status).to.be.equal(201);

    cy.log('Update created entity')

    db.posts[0].title = 'Another title';
    db.posts[0].author = 'Another author'
    cy.request({
      method: 'PUT',
      url: `/posts/${db.posts[0].id}`,
      body: db.posts[0],
    }).then(response1 => {
      expect(response1.status).to.be.equal(200);
      expect(response1.body.title).to.be.equal(db.posts[0].title);
      expect(response1.body.author).to.be.equal(db.posts[0].author);

      cy.log('delete the entity')
      cy.request({
        method: 'DELETE',
        url: `/posts/${db.posts[0].id}`,
        body: db.posts[0]
      }).then(response2 => {
        expect(response2.status).to.be.equal(200);

        cy.log('verify that the entity is deleted')
        cy.request({
          method: 'GET',
          url: `/posts/${db.posts[0].id}`,
          failOnStatusCode: false
        }).then(response3 => {
          expect(response3.status).to.be.equal(404);
        })
      })
    })
  })
})