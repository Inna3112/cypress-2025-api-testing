// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginToApplication', () => {
    // cy.visit('/')
    // cy.contains('Sign in').click()
    // cy.get('[placeholder="Email"]').type('innula3112@gmail.com')
    // cy.get('[placeholder="Password"]').type('12345678')
    // cy.contains('button', 'Sign in').click()
    
    cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/users/login',
        method: 'POST',
        body: {
            "user": {
                "email": "innula3112@gmail.com",
                "password": "12345678"
            }
        }
    }).then( response => {
        expect(response.status).to.equal(200)
        const accessToken = response.body.user.token
        cy.wrap(accessToken).as('accessToken')
        cy.visit('/', {
            // додаємо токен в локал сторедж перед завантаженням сторінки
            // це дозволяє уникнути UI авторизації
            onBeforeLoad(window){
                window.localStorage.setItem('jwtToken', accessToken)
            }
        })
    })
})
