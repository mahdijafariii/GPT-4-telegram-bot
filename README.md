# GPT-4-Telegram-Bot

This project is a **Telegram Bot** that integrates with [one-api.ir](https://one-api.ir/) to provide access to AI engines such as **Copilot**, **GPT-3.5**, and **GPT-4**. The bot uses **Redis** and **SQL** for managing user sessions and data, and integrates with the **Zarinpal Payment Gateway** to enable users to purchase premium subscriptions for these engines.

## Technologies Used

- **Node.js**: The primary runtime for the bot.
- **Knex.js**: SQL query builder for interacting with the SQL database.
- **Redis**: Used for session management and caching.
- **Zarinpal Payment Gateway**: To handle user payments for premium plans.
- **Telegraf**: A framework for building Telegram bots in Node.js.

## Bot Features

- **Inline Subscription Buttons**: Users can choose their subscription plans using inline buttons for AI engines (GPT-3.5, GPT-4, Copilot). They can opt for one of the following time periods for their subscription: **7, 15, 30, or 90 days**. Users also have the option to subscribe to all available engines with the same time periods.

- **Inline Payment Button**: The bot provides users with a payment link via an inline button to complete the purchase on Zarinpal.

## Premium Subscription Process

1. Users can choose a subscription plan for any AI engine (Copilot, GPT-3.5, GPT-4) or for all engines combined.
2. They can select from four subscription periods: **7, 15, 30, or 90 days**.
3. The bot redirects the user to the Zarinpal payment page.
4. After successful payment, the bot updates the user’s subscription status, giving them access to the selected AI engine(s) for the chosen time period.

## Installation


To set up the bot on your local machine:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mahdijafariii/GPT-4-telegram-bot.git
   cd GPT-4-telegram-bot
   npm install
   npm start
   ```
   Just add your telegram bot api token and one-api api token
   دحئ
