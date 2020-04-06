/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const commandLineArgs = require('command-line-args');
const cliProgress = require('cli-progress');

const optionDefinitions = [
  { name: 'getAccount', type: String },
  { name: 'listSubs', type: Boolean },
  { name: 'addFee', alias: 'a', type: Number },
  { name: 'removeFee', alias: 'r', type: Boolean },
  { name: 'help', type: Boolean },
  { name: 'sort', type: String, defaultValue: 'account' },
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
    const { id, stripeAccount, fee: application_fee_percent } = subs[a];
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

const getAccount = async (account_id) => {
  return await stripe.accounts.retrieve(account_id);
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
    
      List all connected accounts: yarn start
      List all connected accounts and subscriptions: yarn start --listSubs
      List all connected accounts and subscriptions, oldest first: yarn start --listSubs --sort date_asc
      List all connected accounts and subscriptions, newest first: yarn start --listSubs --sort date_desc
      Display account object for a connected account: yarn start --getAccount acct_000000
      Add a 13.24% fee to all subscriptions: yarn start --addFee 13.24
      Remove fees from all subscriptions: yarn start --removeFee
      Remove fees from all subscriptions: yarn start --addFee 0
    `);
    return;
  } else if (options.getAccount) {
    const accountDetails = await getAccount(options.getAccount);
    console.log(accountDetails);
    return;
  }
  console.log('Loading connected accounts...');
  const accounts = await getConnectAccounts();

  console.table(accounts);

  if (!(options.addFee || options.removeFee || options.listSubs)) {
    return;
  }

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
        details: sub.customer.description,
        created: new Date(sub.created * 1000),
        monthStart: new Date(
          sub.current_period_start * 1000,
        ).toLocaleDateString(),
        monthEnd: new Date(sub.current_period_end * 1000).toLocaleDateString(),
        fee: sub.application_fee_percent,
      })),
    ];
  }

  if (options.sort === 'date_asc' || options.sort === 'date_desc') {
    const ascend = options.sort === 'date_asc';
    allSubs = allSubs.sort((a, b) =>
      ascend ? a.created - b.created : b.created - a.created,
    );
  }
  allSubs = allSubs.map((sub) => ({
    ...sub,
    created: sub.created.toLocaleDateString(),
  }));

  console.table(allSubs);
  console.log('Total subscriptions found: ' + allSubs.length);

  if (options.addFee || options.removeFee) {
    console.log('Processing fee change...');
    const newFees = await addFees(allSubs, options.addFee || 0);
    console.table(newFees);
  }
})();
