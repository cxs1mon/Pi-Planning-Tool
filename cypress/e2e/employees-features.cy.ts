describe('Automated E2E tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('A-02 - Delete Employee', () => {
    cy.intercept('POST', '**/api/pis').as('createPi');

    cy.get('input[formcontrolname="name"]').clear().type('Test PI 26-01');
    cy.get('input[formcontrolname="startDate"]').type('2026-01-01');
    cy.get('input[formcontrolname="endDate"]').type('2026-03-01');
    cy.get('.create-pi').find('button[type="submit"]').click();

    cy.wait('@createPi').then((interception) => {
      const piId = interception.response?.body.id;
      const employeeName = `Test User ${Date.now()}`;

      cy.request('POST', `http://localhost:3001/api/pis/${piId}/employees`, {
        name: employeeName,
        role: 'Developer',
        feCapacity: 5,
        beCapacity: 10,
      });

      cy.contains('.nav__link', 'Mitarbeiter').click();

      cy.intercept('DELETE', '**/api/pis/**/employees/**').as('deleteEmployee');

      cy.get('.employees__element').should('exist');
      cy.contains('.employees__element', employeeName).within(() => {
        cy.get('.employees__edit-button--delete').click();
      });

      cy.get('.dialog__button--delete').click();

      cy.wait('@deleteEmployee').its('response.statusCode').should('eq', 204);

      cy.contains('.employees__element', employeeName).should('not.exist');
    });
  });
});
