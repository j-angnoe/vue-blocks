/// <reference types="cypress" />

context('Actions', () => {
    function navigate(url) {
        var baseUrl = 'http://localhost:8080/cypress/integration/module.html';
        url = url || '';
        cy.visit(baseUrl + url);
    }

    // https://on.cypress.io/interacting-with-elements
  
    it('webserver is working properly', () => {
        navigate();
        cy.get('title').should('contain', 'Vue Blocks Test Page Module')
    });

    it('require objects defined on window', () => {
        cy.get('#app-container').should('contain', 'Test: windowUnit = windowUnitValue');
    })
    
    it('require objects defined on template[module] with module.exports', () => {
        cy.get('#app-container').should('contain', 'Test: myDefinedModule = myDefinedModule (module.exports)');
    })

    it('require objects defined on template[module] with export default', () => {
        cy.get('#app-container').should('contain', 'Test: myDefinedModule = myDefinedModule2 (export default)');
    })

    it('require npm modules from jspm', () => {
        cy.get('#app-container').should('contain', 'est: random-quotes = function randomQuotes()');
    });
});