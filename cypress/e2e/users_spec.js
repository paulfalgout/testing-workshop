import {
  visitApp,
  sel,
  getRandomUserData,
  createNewUser,
  loginAsNewUser,
} from '../utils'

describe('Users', () => {
  it('should allow a new user to sign up and log out', () => {
    const {username, email, password} = getRandomUserData()
    visitApp()
    cy
      .get(sel('sign-up-link'))
      .click()
      .get(`form ${sel('username')}`)
      .type(username)
      .get(`form ${sel('email')}`)
      .type(email)
      .get(`form ${sel('password')}`)
      .type(password)
      .get('form')
      .submit()

    verifyLoggedIn(username)

    cy.get(sel('settings')).click().get(sel('logout')).click()
    // TODO: make this assertion work
    // cy
    //   .window()
    //   .its('localStorage')
    //   .invoke('getItem', 'jwt')
    //   .should('be.empty')
    cy.get(sel('profile-link')).should('not.exist')
  })

  it('should allow an existing user to login', () => {
    createNewUser().then(({email, username, password}) => {
      visitApp()
      cy
        .get(sel('sign-in-link'))
        .click()
        .get(sel('email'))
        .type(email)
        .get(sel('password'))
        .type(password)
        .get('form')
        .submit()
      verifyLoggedIn(username)
    })
  })

  it('should allow an existing user to update their settings', () => {
    loginAsNewUser().then(user => {
      // route needs to be set properly
      visitApp('/settings')
      const newUsername = `${user.username}55`
      const photoUrl = 'https://randomuser.me/api/portraits/lego/7.jpg'
      const newBio = 'a new bio'
      const newEmail = `${user.username}_55@example.com`
      cy
        .get(sel('profile-url'))
        .type(photoUrl)
        .get(sel('username'))
        .clear()
        .type(newUsername)
        .get(sel('bio'))
        .type(newBio)
        .get(sel('email'))
        .clear()
        .type(newEmail)
        .get(sel('password'))
        .type('5uper-5ecure')
        .get('form')
        .submit()

      cy.wait(500)

      visitApp('/settings')

      cy.get(sel('profile-url')).should('have.value', photoUrl)
      cy.get(sel('username')).should('have.value', newUsername)
      // TODO: this is a bug. It's not saving the bio!
      // cy.get(sel('bio')).should('have.value', newBio)
      cy.get(sel('email')).should('have.value', newEmail)
    })
  })
})

function verifyLoggedIn(username) {
  const hash = Cypress.env('E2E_DEV') ? '#/' : ''
  // TODO: make this assertion work
  // cy
  //   .window()
  //   .its('localStorage')
  //   .invoke('getItem', 'jwt')
  //   .should('not.be.empty')
  return cy
    .get(sel('profile-link'))
    .should('contain.text', username)
    .and('have.attr', 'href', `${hash}@${username}`)
}
