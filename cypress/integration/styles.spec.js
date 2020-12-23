/// <reference types="cypress" />

context('Actions', () => {
    function navigate(url) {
        var baseUrl = 'http://localhost:8080/cypress/integration/styles.html';
        url = url || '';
        cy.visit(baseUrl + url);
    }

    // https://on.cypress.io/interacting-with-elements
  
    it('webserver is working properly', () => {
        navigate();
        cy.get('title').should('contain', 'Vue Blocks Test Page Styles')
    });

    it('Global style works', () => {
        cy.get('.component1.blue-global').should('have.css', 'color', 'rgb(0, 0, 255)');
        cy.get('.component2.blue-global').should('have.css', 'color', 'rgb(0, 0, 255)');
    });
    it('Scoped style works', () => {
        cy.get('.component2.unaffected').should('have.css', 'color', 'rgb(255, 0, 0)');
        // These should remain black.
        cy.get('.component1.unaffected').should('have.css', 'color', 'rgb(0, 0, 0)');

        // :root selector is implemented
        cy.get('.component2-root').should('have.css', 'background-color', 'rgb(200, 200, 200)');

        // :scope selector is implemented
        cy.get('.component2-root').should('have.css', 'color', 'rgb(50, 50, 50)');
    })
});