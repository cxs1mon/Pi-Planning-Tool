describe('Automated E2E tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('A-03 - See Planning status', () => {
    cy.intercept('POST', '**/api/pis').as('createPi');

    cy.get('input[formcontrolname="name"]').clear().type('Test PI 26-01');
    cy.get('input[formcontrolname="startDate"]').type('2026-01-01');
    cy.get('input[formcontrolname="endDate"]').type('2026-03-01');
    cy.get('.create-pi').find('button[type="submit"]').click();

    cy.wait('@createPi').then((interception) => {
      const piId = interception.response?.body.id;

      cy.request('POST', `http://localhost:3001/api/pis/${piId}/employees`, {
        name: 'Test Employee',
        role: 'Developer',
        feCapacity: 5,
        beCapacity: 10,
      })
        .its('status')
        .should('eq', 201);

      cy.request('POST', `http://localhost:3001/api/pis/${piId}/features`, {
        featureNumber: 'Feat-01',
        title: 'Test Feature',
        description: 'Feature für Planning Status Test',
        feEffort: 3,
        beEffort: 2,
      })
        .its('status')
        .should('eq', 201);

      cy.contains('.nav__link', 'Planung').click();

      cy.reload();

      cy.get('.status-card')
        .first()
        .within(() => {
          cy.get('.status-card__title').should('have.text', 'Backend:');
          cy.get('.status-card__row').should('contain', '10'); // capacity
          cy.get('.status-card__row').should('contain', '2'); // effort
          cy.get('.status-card__row').should('contain', '8'); // remaining
          cy.get('.status__tag').should('have.text', ' unterplant ');
        });

      cy.get('.status-card')
        .last()
        .within(() => {
          cy.get('.status-card__title').should('have.text', 'Frontend:');
          cy.get('.status-card__row').should('contain', '5'); // capacity
          cy.get('.status-card__row').should('contain', '3'); // effort
          cy.get('.status-card__row').should('contain', '2'); // remaining
          cy.get('.status__tag').should('have.text', ' unterplant ');
        });
    });
  });
});
