/// <reference types="cypress" />

//------------ЗВЕРНИ УВАГУ!!!!!------------------
//у дашборді під час виконання тестівти можеш бачити у вкладці зліва запити як POST url
//біля нього зелене або обведене зеленим коло - це значить в першому випадку що запит пішов на сервер,
//в другому випадку що ми його перехопили і замінили відповідь на свою (стабінг)
//------------ЗВЕРНИ УВАГУ!!!!!------------------

it('first test', () => {
    //this we use spying and response stubbing
    //learn doc here: https://docs.cypress.io/api/commands/intercept

    //!!!!!!!робити моки треба до виконання тестового сценарію,
    // тому що під час виконання сценарію відбувається запит на сервер
    cy.intercept('GET', '**/tags', { fixture: 'tags.json' })
    // cy.intercept({ method: 'GET', pathname: 'tags' }, { fixture: 'articles.json' })
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })
    cy.loginToApplication()
})

it('modify api response', () => {
    cy.intercept('GET', '**/articles*', req => {
        req.continue( res => {
            res.body.articles[0].favoritesCount = 9999999
            res.send(res.body)
        })
    })
    cy.loginToApplication()
    cy.get('app-favorite-button').first().should('contain.text', '9999999')
})

it('waiting for apis', () => {
    //це завжди працюватиме тому що should буде викликатися поки елемент з'явиться на сторінці
    // cy.loginToApplication()
    // cy.get('app-article-list').should('contain.text', 'Bondar Academy')

    cy.intercept('GET', '**/articles*').as('artcileApiCall')
    cy.loginToApplication()
    cy.wait('@artcileApiCall').then( apiArticleObject => {
        // console.log(apiArticleObject);
        expect(apiArticleObject.response.body.articles[0].title).to.contain('Bondar Academy')
    })
    cy.get('app-article-list').invoke('text').then( allArticleTexts => {
        expect(allArticleTexts).to.contain('Bondar Academy')
    })
})

it('delete article', () => {
    //тут пройдено весь процес - авторизація, створення статті через апі, видалення статті через UI
    cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/users/login',
        method: 'POST',
        body: {
            "user": {
                "email": "innula3112@gmail.com",
                "password": "12345678"
            }
        }
    }).then(response => {
        expect(response.status).to.equal(200)
        const accessToken = 'Token ' + response.body.user.token

        cy.request({
            url: 'https://conduit-api.bondaracademy.com/api/articles/',
            method: 'POST',
            body: {
                "article": {
                    "title": "Test title Cypress",
                    "description": "Some description",
                    "body": "This is a body",
                    "tagList": []
                }
            },
            headers: {'Authorization': accessToken}
        }).then( response => {
            expect(response.status).to.equal(201)
            expect(response.body.article.title).to.equal('Test title Cypress')
        })
    })

    cy.loginToApplication()
    cy.contains('Test title Cypress').click()
    cy.intercept('GET', '**/articles*').as('artcileApiCall')
    cy.contains('button', 'Delete Article').first().click()
    //НЕ ЗАБУВАЙ ЧЕКАТИ ВИКЛИК api
    cy.wait('@artcileApiCall')
    cy.get('app-article-list').should('not.contain.text', 'Test title Cypress')
})

it.only('api testing', () => {
    //Pure API test - without UI interaction
    cy.request({
        url: 'https://conduit-api.bondaracademy.com/api/users/login',
        method: 'POST',
        body: {
            "user": {
                "email": "innula3112@gmail.com",
                "password": "12345678"
            }
        }
    }).then(response => {
        expect(response.status).to.equal(200)
        const accessToken = 'Token ' + response.body.user.token

        cy.request({
            url: 'https://conduit-api.bondaracademy.com/api/articles/',
            method: 'POST',
            body: {
                "article": {
                    "title": "Test title Cypress API Testing",
                    "description": "Some description",
                    "body": "This is a body",
                    "tagList": []
                }
            },
            headers: {'Authorization': accessToken}
        }).then( response => {
            expect(response.status).to.equal(201)
            expect(response.body.article.title).to.equal('Test title Cypress API Testing')
        })

        cy.request({
            url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
            method: 'GET',
            headers: {'Authorization': accessToken}
        }).then( response => {
            expect(response.status).to.equal(200)
            expect(response.body.articles[0].title).to.equal('Test title Cypress API Testing')
            const slugID = response.body.articles[0].slug

            cy.request({
                url: `https://conduit-api.bondaracademy.com/api/articles/${slugID}`,
                method: 'DELETE',
                headers: {'Authorization': accessToken}
            }).then(response => {
                expect(response.status).to.equal(204)
            })
        })

        cy.request({
            url: 'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
            method: 'GET',
            headers: {'Authorization': accessToken}
        }).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body.articles[0].title).to.not.equal('Test title Cypress API Testing')
        })
    })
})
