/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const commandLineArgs = require('command-line-args');
const cliProgress = require('cli-progress');

const optionDefinitions = [
  { name: 'addFee', alias: 'a', type: Number },
  { name: 'removeFee', alias: 'r', type: Boolean },
  { name: 'help', type: Boolean },
];
const options = commandLineArgs(optionDefinitions);

const addFees = async (subs, fee) => {
  const progress = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic,
  );
  progress.start(subs.length, 0);
  const results = [];
  for (let a = 0; a < subs.length; a++) {
    progress.update(a + 1);
    const { id, stripeAccount, application_fee_percent } = subs[a];
    if (application_fee_percent === fee) {
      continue;
    }
    try {
      const response = await stripe.subscriptions.update(
        id,
        { application_fee_percent: fee },
        {
          stripeAccount: stripeAccount,
        },
      );
      results.push({
        ...subs[a],
        application_fee_percent: response.application_fee_percent,
        status: 'ok',
      });
    } catch (e) {
      console.error(e);
      results.push({
        ...subs[a],
        status: 'error',
      });
    }
  }
  progress.stop();
  return results;
};

const getConnectAccounts = async (starting_after) => {
  const accounts = await stripe.accounts.list({ starting_after });
  let { data, has_more } = accounts;

  if (has_more) {
    data = [...data, ...(await getConnectAccounts(data[data.length - 1].id))];
  }

  return data.map(({ id, email, display_name }) => ({
    id,
    email,
    display_name,
  }));
};

const getAccountSubscriptions = async (accountId, starting_after) => {
  const subs = await stripe.subscriptions.list(
    { starting_after, expand: ['data.customer'] },
    {
      stripeAccount: accountId,
    },
  );

  let { data, has_more } = subs;

  if (has_more) {
    data = [
      ...data,
      ...(await getAccountSubscriptions(accountId, data[data.length - 1].id)),
    ];
  }
  return data;
};

(async () => {
  if (options.help) {
    console.log(`
    application-fee-management
    
      List all connected accounts and subscriptions: yarn start
      Add a 13.84% fee to all subscriptions: yarn start --addFee 13.84
      Remove fees from all subscriptions: yarn start --removeFee
      Remove fees from all subscriptions: yarn start --addFee 0
    `);
    return;
  }
  console.log('Loading connected accounts...');
  const accounts = await getConnectAccounts();

  console.table(accounts);

  let allSubs = [];

  for (let a = 0; a < accounts.length; a++) {
    console.log(`Loading subscriptions for ${accounts[a].display_name}...`);
    const subs = await getAccountSubscriptions(accounts[a].id);
    allSubs = [
      ...allSubs,
      ...subs.map((sub) => ({
        id: sub.id,
        stripeAccount: accounts[a].id,
        accountName: accounts[a].display_name,
        customerName: sub.customer.name,
        customerEmail: sub.customer.email,
        application_fee_percent: sub.application_fee_percent,
      })),
    ];
  }

  console.table(allSubs);
  console.log('Total subscriptions found: ' + allSubs.length);

  if (options.addFee || options.removeFee) {
    console.log('Processing fee change...');
    const newFees = await addFees(allSubs, options.addFee || 0);
    console.table(newFees);
  }
})();
