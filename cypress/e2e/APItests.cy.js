import posts from '../fixtures/db.json'
import userInfo from '../fixtures/users.json'
import { faker } from '@faker-js/faker';

posts.id = faker.number.int()
posts.title = faker.word.words()
posts.author = faker.person.firstName()

/*let requestBody = {"user":{"email": "","password": ""}} 
    requestBody.user.email = user.email;
    requestBody.user.password = user.password;
debugger
it('Register a new user', () => {
  cy.request('POST', '/register', requestBody).then(response => {
    debugger
    console.log(response)
    cy.log(`Request body: ${response.requestBody}`)
    expect(response.status).to.be.equal(200);
    //expect(response.headers["content-type"]).to.be.equal('application/json; charset=utf-8');
  })
})*/

it('Register a new user', () => {
  cy.request({
    method: 'POST',
    url: '/users',
    body: userInfo,
    failOnStatusCode: false
  }).then(response => {
    debugger
    console.log(response)
    cy.log(`Request body: ${response.body}`)
    console.log(`Request body: ${JSON.stringify(userInfo)}`)
    expect(response.status).to.be.equal(201);
    expect(response.body.user.email).to.be.equal(userInfo.email);    
  })
})



it.skip('Get all posts. Verify HTTP response status code and content type.', () => {
  cy.request('GET', '/664/posts').then(response => {
    debugger
    expect(response.status).to.be.equal(200);
    expect(response.headers["content-type"]).to.be.equal('application/json; charset=utf-8');
  })
})

it.skip('Get only first 10 posts. Verify HTTP response status code. Verify that only first posts are returned.', () => {
  cy.request('GET', '/664/posts?_start=0&_end=10').then(response => {
    debugger
    expect(response.status).to.be.equal(200);
    expect(response.body.length).to.be.equal(10);
  })
})

it.skip('Get posts with id = 55 and id = 60. Verify HTTP response status code. Verify id values of returned records.', () => {
  cy.request('GET', '/664/posts/?id=55&id=60').then(response => {
      debugger
      expect(response.status).to.be.equal(200);
      expect(response.body[0].id).to.be.equal(55);
      expect(response.body[1].id).to.be.equal(60);      
    })
})

it.skip('Create a post. Verify HTTP response status code.', () => {
 
    cy.request({
      method: 'POST',
      url: '/664/posts',
      body: posts
    }).then( response => {

      debugger
      expect(response.status).to.be.equal(201); //401
      //expect(response.body.id).to.be.equal(posts.id);
      //expect(response.body.title).to.be.equal(posts.title);
      //expect(response.body.author).to.be.equal(posts.author);
    })
})

it.skip('Create post with adding access token in header. Verify HTTP response status code. Verify post is created.', () => {
  
  

    cy.request({
      method: 'GET',
      url: `/664/posts/${response.body.id}`,
    }).then((getPostResponse) => {
      expect(getPostResponse.status).to.equal(200);
      expect(getPostResponse.body.title).to.equal(postBody.title);
      expect(getPostResponse.body.content).to.equal(postBody.content);
    });
  });


/*201 Created
{
  "accessToken": "xxx.xxx.xxx",
  "user": {
    "id": 1,
    "email": "olivier@mail.com"
  }
}*/

it.skip('Create post entity and verify that the entity is created. Verify HTTP response status code. Use JSON in body.', () => {
  
  cy.request({
    method: 'POST',
    url: '/posts',
    body: posts
  }).then( response => {
    expect(response.status).to.be.equal(201); 
    
  })
})

it.skip('Update non-existing entity. Verify HTTP response status code.', () => {
  
  cy.request({
    method: 'POST',
    url: '/posts',
    body: posts
  }).then( response => {
    expect(response.status).to.be.equal(404); 
    
  })
})

it.skip('Create post entity and update the created entity. Verify HTTP response status code and verify that the entity is updated.', () => {
  
  cy.request({
    method: 'POST',
    url: '/posts',
    body: posts
  }).then( response => {
    expect(response.status).to.be.equal(200); 
    
  })
})

it.skip('Delete non-existing post entity. Verify HTTP response status code.', () => {
  
  cy.request({
    method: 'DELETE',
    url: '/posts',
    body: posts
  }).then( response => {
    expect(response.status).to.be.equal(404); 
    
  })
})

it.skip('Create post entity, update the created entity, and delete the entity. Verify HTTP response status code and verify that the entity is deleted.', () => {
  
  cy.request({
    method: 'DELETE',
    url: '/posts',
    body: posts
  }).then( response => {
    expect(response.status).to.be.equal(200); 
    
  })
})







