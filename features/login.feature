Feature: User Login


Scenario: Successful Login with Valid Credentials
    Given the new user is registered using api
    Then the user is on the login page
    When the user enters valid credentials
    Then the user should be able to log in successfully