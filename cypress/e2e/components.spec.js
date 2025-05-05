/// <reference types="cypress" />

context('Actions', () => {
    function navigate(url) {
        var baseUrl = 'http://localhost:8080/cypress/e2e/components.html';
        url = url || '';
        return cy.visit(baseUrl + url);
    }  
    // https://on.cypress.io/interacting-with-elements
  
    beforeEach(() => navigate());

    it('On the right page', () => {
        cy.get('title').should('contain', 'Vue Blocks Test Page Components')
    });

    it('component-1 gets loaded as it should', () => {
        cy.get('#app-container').should('contain', 'Success: Showing you component-1');
    });

    it('Vue component definitions work', () => {
        cy.get('#app-container').should('contain', 'Success: Showing you component-2');
    })

    it('Short syntax vue components work', () => {
        cy.get('#app-container').should('contain', 'Success: Showing you component-3');
    });

    it('Module.exports vue component works', () => {
        cy.get('#app-container').should('contain', 'Success: Showing you component-4');
    })
    
    it('Template component props works',  () => {
        cy.get('#app-container').should('contain', 'Success: Showing you comp-5-prop1, comp-5-prop2');
    })
    it('Classic component props works',  () => {
        cy.get('#app-container').should('contain', 'Success: Showing you comp-6-prop1, comp-6-prop2');
    })
    it('Short syntax component props works',  () => {
        cy.get('#app-container').should('contain', 'Success: Showing you comp-7-prop1, comp-7-prop2');
    })
    it('Short syntax classic props works',  () => {
        cy.get('#app-container').should('contain', 'Success: Showing you comp-8-prop1, comp-8-prop2');
    })
    // it('vue-router is working properly', () => {
        // navigate('#/page2');
        // cy.get('#app-container').should('contain', 'Success: Showing you page 2')
        // navigate('#/');
        // cy.get('#app-container').should('contain', 'Success: Showing you the main page');
    // });
});