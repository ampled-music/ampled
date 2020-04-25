/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const commandLineArgs = require('command-line-args');
const getUsage = require('command-line-usage');
const cliProgress = require('cli-progress');

const optionDefinitions = [
  {
    name: 'account',
    type: String,
    description:
      'Optional Stripe Connect account to limit subscription results / changes to. Works with --addFee, --removeFee, and --showProcessedFees',
  },
  {
    name: 'getAccount',
    type: String,
    description: 'Show the account object for account {underline string}',
  },
  {
    name: 'details',
    type: Boolean,
    description: 'Show additional details where available',
  },
  { name: 'listSubs', type: Boolean, description: 'List subscriptions' },
  {
    name: 'addFee',
    type: Number,
    description: 'Add a fee of {underline number}% to subscriptions',
  },
  {
    name: 'removeFee',
    type: Boolean,
    description: 'Remove fee from subscriptions',
  },
  {
    name: 'showProcessedFees',
    type: Boolean,
    description: 'List processed application fees',
  },
  { name: 'help', type: Boolean, description: 'Show this help screen' },
  {
    name: 'sort',
    type: String,
    defaultValue: 'account',
    description: 'date_asc or date_desc. Works with --listSubs',
  },
];
const options = commandLineArgs(optionDefinitions);

const usageGuide = [
  {
    content: '{green application-fee-management}',
  },
  {
    header: 'TOOLS',
    optionList: optionDefinitions,
    hide: ['details', 'sort', 'account'],
  },
  {
    header: 'OPTIONS',
    optionList: optionDefinitions,
    hide: [
      'addFee',
      'removeFee',
      'help',
      'showProcessedFees',
      'getAccount',
      'listSubs',
    ],
  },
  {
    header: 'EXAMPLES',
  },
  {
    header: '  View accounts & subscriptions',
    content: [
      'List all connected accounts:',
      '{bold yarn start}',
      '',
      'List all connected accounts and subscriptions:',
      '{bold yarn start --listSubs}',
      '',
      'List all connected subscriptions for a connected account:',
      '{bold yarn start --listSubs --account {italic acct_000000}}',
      '',
      'List all connected accounts and subscriptions, oldest first:',
      '{bold yarn start --listSubs --sort date_asc}',
      '',
      'List all connected accounts and subscriptions, newest first:',
      '{bold yarn start --listSubs --sort date_desc}',
      '',
      'Display account object for a connected account:',
      '{bold yarn start --getAccount --account {italic acct_000000}}',
      '',
    ],
  },
  {
    header: '  Modify application (platform) fee rates',
    content: [
      'Add a 13.24% fee to all subscriptions:',
      '{bold yarn start --addFee {italic 13.24}}',
      '',
      'Add a 13.24% fee to subscriptions for account {underline acct_000000}:',
      '{bold yarn start --addFee {italic 13.24} --account {italic acct_000000}}',
      '',
      'Remove fees from all subscriptions:',
      '{bold yarn start --addFee {italic 0}}',
      '',
      'Remove fees from all subscriptions:',
      '{bold yarn start --removeFee}',
      '',
    ],
  },
  {
    header: '  View processed application (platform) fees',
    content: [
      'Display processed platform fees summary by account:',
      '{bold yarn start --showProcessedFees}',
      '',
      'Display all processed platform fees:',
      '{bold yarn start --showProcessedFees --details}',
      '',
      'Display all processed platform fees for a single account:',
      '{bold yarn start --showProcessedFees --details --account {italic acct_000000}}',
      '',
    ],
  },
  {
    header: '  Refund processed application (platform) fees',
    content: ['TKTK'],
  },
];

const addFees = async (subs, fee) => {
  if (options.account) {
    subs = subs.filter(
      ({ stripeAccount }) => stripeAccount === options.account,
    );
  }
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

const getConnectAccount = async (account) => {
  const data = await stripe.accounts.retrieve(account);

  return {
    id: data.id,
    email: data.email,
    display_name: data.display_name,
  };
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

const getProcessedFees = async (
  progress,
  account,
  starting_after,
  index = 0,
) => {
  const fees = await stripe.applicationFees.list(
    {
      starting_after,
    },
    {
      stripeAccount: account,
    },
  );

  progress.setTotal((index + 1) * 10);
  progress.update(index * 10);

  let { data, has_more } = fees;

  if (has_more) {
    data = [
      ...data,
      ...(await getProcessedFees(
        progress,
        account,
        data[data.length - 1].id,
        index + 1,
      )),
    ];
  }
  return data;
};

const getAllProcessedFees = async () => {
  const progress = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic,
  );
  progress.start(1, 10);
  let fees = await getProcessedFees(progress);
  progress.stop();

  const allFees = {};
  fees.map(({ account, amount, amount_refunded }) => {
    if (allFees[account]) {
      allFees[account] = {
        total: allFees[account].total + amount,
        total_refunded: allFees[account].total_refunded + amount_refunded,
        count: allFees[account].count + 1,
      };
    } else {
      allFees[account] = {
        total: amount,
        total_refunded: amount_refunded,
        count: 1,
      };
    }
  });

  for (let account in allFees) {
    if (options.account && account !== options.account) {
      delete allFees[account];
      continue;
    }
    allFees[account] = {
      ...allFees[account],
      total: `$${(allFees[account].total / 100).toFixed(2)}`,
      total_refunded: `$${(allFees[account].total_refunded / 100).toFixed(2)}`,
    };
  }

  if (options.details) {
    if (options.account) {
      fees = fees.filter(({ account }) => account === options.account);
    }
    console.table(
      fees.map(
        ({ id, account, amount, amount_refunded, created, refunded }) => ({
          id,
          account,
          amount: `$${(amount / 100).toFixed(2)}`,
          amount_refunded: `$${(amount_refunded / 100).toFixed(2)}`,
          refunded,
          created: new Date(created * 1000).toLocaleDateString(),
        }),
      ),
    );
  }

  console.table(allFees);
};

(async () => {
  if (options.help) {
    console.log(getUsage(usageGuide));
    return;
  } else if (options.getAccount) {
    const accountDetails = await getAccount(
      options.getAccount || options.account,
    );
    console.log(accountDetails);
    return;
  } else if (options.showProcessedFees) {
    await getAllProcessedFees();
    return;
  }
  let accounts;
  if (!options.account) {
    console.log('Loading connected accounts...');
    accounts = await getConnectAccounts();
    console.table(accounts);
  } else {
    console.log('Loading connected account...');
    accounts = [await getConnectAccount(options.account)];
    console.table(accounts);
  }

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
