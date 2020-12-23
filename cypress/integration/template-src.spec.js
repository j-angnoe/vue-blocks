/// <reference types="cypress" />

context('Actions', () => {
    function navigate(url) {
        var baseUrl = 'http://localhost:8080/cypress/integration/template-src.html';
        url = url || '';
        cy.visit(baseUrl + url);
    }

    // https://on.cypress.io/interacting-with-elements
  
    it('webserver is working properly', () => {
        navigate();
        cy.get('title').should('contain', 'Vue Blocks Test Page Template src')
    });

    it('Vue Single File Component is loaded asynchronously', () => {
        // Vue file template is shown
        cy.get('#app-container').should('contain', 'Success: Showing example-vue-file');

        // Vue file (scoped) style is applied
        cy.get('#app-container').should('contain', 'Success: Vue component initialized');

        // Vue file script is processed.
        cy.get('#app-container .red').should('have.css', 'color', 'rgb(255, 0, 0)');
    });

    it('Vue Blocks HTML file can be (recursively) loaded asynchronously', () => {
        // Vue file template is shown
        cy.get('#app-container').should('contain', 'Sample 1');
        cy.get('#app-container').should('contain', 'Sample 2');

        // Two components recursively loaded components.
        cy.get('#app-container').should('contain', 'Sample 3');
        cy.get('#app-container').should('contain', 'Sample 4');
    });


});