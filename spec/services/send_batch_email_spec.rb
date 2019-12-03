describe SendBatchEmail, type: :service do
  it "sends the messages via the postmark client" do
    client_double = instance_double(Postmark::ApiClient)
    allow(client_double)
      .to receive(:deliver_in_batches_with_templates)
      .and_return({})
    allow(Postmark::ApiClient)
      .to receive(:new)
      .and_return(client_double)

    messages = [{}, {}]

    described_class.call(messages)

    expect(client_double)
      .to have_received(:deliver_in_batches_with_templates)
      .with(messages)
  end
end
