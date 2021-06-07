module StripeIntegrationTestHelper # rubocop:disable Metrics/ModuleLength
  def self.create_subscription_with_stripe_subscription(stripe_token: "tok_visa",
                                                        user: nil, artist_page: nil, plan: nil)
    user ||= create_user_with_stripe_customer(stripe_token: stripe_token)
    artist_page ||= create_artist_page_with_stripe_account
    plan ||= create_plan_with_stripe_plan(artist_page: artist_page)

    connected_account_customer = Stripe::Customer.create(
      {
        description: "Test customer",
        source: stripe_token
      },
      stripe_account: artist_page.stripe_user_id
    )

    stripe_subscription = Stripe::Subscription.create(
      {
        customer: connected_account_customer.id,
        plan: plan.stripe_id,
        application_fee_percent: artist_page.application_fee_percent
      },
      stripe_account: artist_page.stripe_user_id
    )

    FactoryBot.create(
      :subscription,
      artist_page: artist_page,
      user: user,
      plan: plan,
      stripe_id: stripe_subscription.id,
      stripe_customer_id: connected_account_customer.id
    )
  end

  def self.create_plan_with_stripe_plan(artist_page: nil)
    artist_page ||= create_artist_page_with_stripe_account
    nominal_amount = Money.new(600, "usd")
    charge_amount = StripeUtil.charge_amount_for_nominal_amount(nominal_amount)
    stripe_plan = Stripe::Plan.create(
      {
        product: artist_page.stripe_product_id,
        nickname: "Ampled Support",
        interval: "month",
        currency: StripeUtil.stripe_currency(charge_amount),
        amount: charge_amount.fractional
      },
      stripe_account: artist_page.stripe_user_id
    )

    FactoryBot.create(
      :plan,
      artist_page: artist_page,
      stripe_id: stripe_plan.id,
      charge_amount: charge_amount.fractional,
      nominal_amount: nominal_amount.fractional,
      currency: StripeUtil.stripe_currency(charge_amount)
    )
  end

  def self.create_user_with_stripe_customer(stripe_token: "tok_visa")
    stripe_customer = Stripe::Customer.create(
      {
        description: "Test customer",
        source: stripe_token
      }
    )

    FactoryBot.create(:user, stripe_customer_id: stripe_customer.id)
  end

  def self.create_artist_page_with_stripe_account
    # For more information on where some of these values come from read Stripe's testing guide.
    # https://stripe.com/docs/connect/testing
    stripe_account = Stripe::Account.create(
      {
        type: "custom",
        country: "US",
        email: "hello@kittehrock.com",
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        },
        business_type: "individual",
        business_profile: {
          url: "https://kittehrock.com",
          mcc: 5045
        },

        tos_acceptance: {
          date: "1547923073",
          ip: "1.1.1.1"
        },

        external_account: {
          object: "bank_account",
          country: "US",
          currency: "usd",
          routing_number: "110000000",
          account_number: "000123456789"
        },

        individual: {
          first_name: "Kitteh",
          last_name: "Rock",
          gender: "female",
          email: "Kitteh.Rock@ampled.com",
          phone: "0000000000",
          address: {
            city: "Washington",
            line1: "address_full_match",
            postal_code: "20500",
            state: "DC"
          },
          dob: {
            year: "1900",
            month: "01",
            day: "01"
          },
          id_number: "000000000",
          verification: {
            document: {
              front: "file_identity_document_success"
            }
          }
        }
      },
      stripe_version: "2020-08-27"
    )

    if VCR.current_cassette.recording?
      puts "Sleeping for two minutes to let Stripe complete its identity verification - sorry!"
      puts "If you see an error saying 'Your account cannot currently make charges.', sleep for longer."
      sleep(120)
    end

    stripe_product = Stripe::Product.create(
      {
        name: "Ampled Support",
        type: "service",
        statement_descriptor: "KittehR"
      },
      stripe_account: stripe_account.id
    )

    FactoryBot.create(:artist_page, stripe_user_id: stripe_account.id, stripe_product_id: stripe_product.id)
  end
end
