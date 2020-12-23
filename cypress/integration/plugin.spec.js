context('Actions', () => {
    // https://on.cypress.io/interacting-with-elements
  
    it('webserver is working properly', () => {
        cy.visit('http://localhost:8080/cypress/integration/plugin-normal.html');

        cy.get('title').should('contain', 'Vue Blocks Test Page Plugin')
    });

    it('VueBlocks as plugin does its job', () => {
        
        cy.get('#app-container').should('contain', 'Success: VueBlocks plugin worked!');

    });

    it('VueBlocks works under asynchronous conditions', () => {
        cy.visit('http://localhost:8080/cypress/integration/plugin-async.html');
        cy.get('title').should('contain', 'Vue Blocks Test Page Plugin Async')

        cy.get('#app-container').should('contain', 'Success: VueBlocks plugin async worked!');
        cy.get('#app-container').should('contain', 'Success: Showing example-vue-file');
        cy.get('#app-container').should('contain', 'Sample 1');
        cy.get('#app-container').should('contain', 'Sample 2');
        cy.get('#app-container').should('contain', 'Sample 3');
        cy.get('#app-container').should('contain', 'Sample 4');
    });


    it('VueBlocks plugin works in concert with external Vue Router', () => {
        cy.visit('http://localhost:8080/cypress/integration/plugin-vue-router.html');
        cy.get('title').should('contain', 'Vue Blocks Test Page Plugin VueRouter')

        cy.get('#app-container').should('contain', 'Success: VueBlocks plugin worked!');
        cy.get('#app-container').should('contain', 'Page 2');

        cy.contains('Page 2').click();

        cy.get('#app-container').should('contain', 'Success: Page 2 werkt ook');
    });

});
