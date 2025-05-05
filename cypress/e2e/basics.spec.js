/// <reference types="cypress" />

context('Actions', () => {
    function navigate(url) {
        var baseUrl = 'http://localhost:8080/cypress/e2e/basics.html';
        url = url || '';
        cy.visit(baseUrl + url);
    }
    beforeEach(() => {
      navigate();
    })
  
    // https://on.cypress.io/interacting-with-elements
  
    it('webserver is working properly', () => {
        cy.get('title').should('contain', 'Vue Blocks Test Page 1')
    });

    it('vue blocks is loaded property', () => {
        cy.get('#app-container').should('contain', 'Success: Showing you the main page')
    });

    it('vue-router is working properly', () => {
        navigate('#/page2');
        cy.get('#app-container').should('contain', 'Success: Showing you page 2')
        navigate('#/');
        cy.get('#app-container').should('contain', 'Success: Showing you the main page');
    });
});