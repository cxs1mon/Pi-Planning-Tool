describe('Automated E2E tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('A-01 - Create PI', () => {
    cy.intercept('POST', '**/api/pis').as('createPi');

    cy.get('input[formcontrolname="name"]').clear().type('Test PI 26-01');
    cy.get('input[formcontrolname="startDate"]').type('2026-01-01');
    cy.get('input[formcontrolname="endDate"]').type('2026-03-01');
    cy.get('.create-pi').find('button[type="submit"]').click();

    cy.wait('@createPi').its('response.statusCode').should('eq', 201);
    cy.get('.status__title').should('have.text', 'Planungsübersicht');
  });

  it('A-04 - Edit PI', () => {
    cy.intercept('POST', '**/api/pis').as('createPi');

    cy.get('input[formcontrolname="name"]').clear().type('Test PI 26-01');
    cy.get('input[formcontrolname="startDate"]').type('2026-01-01');
    cy.get('input[formcontrolname="endDate"]').type('2026-03-01');
    cy.get('.create-pi').find('button[type="submit"]').click();

    cy.intercept('PUT', '/api/pis/**').as('updatePi');

    cy.get('.status__title').should('have.text', 'Planungsübersicht');
    cy.get('.nav__link').contains('PI Einstellungen').click();
    cy.get('.edit-pi__title').should('have.text', 'PI Einstellungen');

    // formular ausfüllen
    cy.get('input[formcontrolname="name"]').clear().type('PI 26-07 New');
    cy.get('input[formcontrolname="startDate"]').type('2026-01-01');
    cy.get('input[formcontrolname="endDate"]').type('2026-03-01');

    cy.get('button[type="submit"]').click();

    cy.wait('@updatePi').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
    cy.get('.status__title').should('have.text', 'Planungsübersicht');
  });

  it('A-05 - Delete PI', () => {
    cy.intercept('POST', '**/api/pis').as('createPi');

    cy.get('input[formcontrolname="name"]').clear().type('Test PI 26-01');
    cy.get('input[formcontrolname="startDate"]').type('2026-01-01');
    cy.get('input[formcontrolname="endDate"]').type('2026-03-01');
    cy.get('.create-pi').find('button[type="submit"]').click();

    cy.intercept('DELETE', '/api/pis/**').as('deletePi');

    cy.get('.nav__link').contains('PI Einstellungen').click();
    cy.get('.edit-pi__title').should('have.text', 'PI Einstellungen');

    // pi löschen
    cy.get('button[type="button"]').click();

    cy.get('.dialog__button').contains('Löschen').click();

    cy.wait('@deletePi').then((interception) => {
      expect(interception.response?.statusCode).to.equal(204);
    });
    cy.get('.pi-overview').should('exist');
  });
});
