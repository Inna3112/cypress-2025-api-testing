const { defineConfig } = require("cypress");
//тоді можна викликати з терміналу npx cypress open --config-file cypress.dev.config.js
module.exports = defineConfig({
  env: {
    username: 'innula3112DEV@gmail.com',
    password: '12345678DEV',
    apiUrl: 'https://conduit-api.bondaracademy.com/api'
  },
  e2e: {
    baseUrl: 'https://conduit.bondaracademy.com/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      //тоді можна запустити через термінал команду USER_NAME='innula3112@gmail.com' PASSWORD='12345678' npm run cy_run_dev
      config.env.username = process.env.USERNAME;
      config.env.password = process.env.PASSWORD

      return config;
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720
});
