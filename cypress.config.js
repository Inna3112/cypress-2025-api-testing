const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    username: 'innula3112@gmail.com',
    password: '12345678',
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
    //Стільки спроб має Cypress зробити, якщо тест не пройшов
    // retries: 1,
    retries: {
      runMode: 1,
      openMode: 0
    }
  },
  viewportWidth: 1280,
  viewportHeight: 720
});
