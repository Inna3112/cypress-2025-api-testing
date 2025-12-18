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
    cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })
    cy.loginToApplication()
})

it.only('modify api response', () => {
    cy.intercept('GET', '**/articles*', req => {
        req.continue( res => {
            res.body.articles[0].favoritesCount = 9999999
            res.send(res.body)
        })
    })
    cy.loginToApplication()
    cy.get('app-favorite-button').first().should('contain.text', '9999999')
})
