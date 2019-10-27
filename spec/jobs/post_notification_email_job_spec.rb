require "rails_helper"

describe PostNotificationEmailJob, type: :job do
  it "sends emails to users subscribed to the artist page" do
    allow(SendBatchEmail).to receive(:call)
    users = create_list(:user, 2)
    artist = create(:artist_page)
    post = create(:post, artist_page: artist)
    users.each { |u| create(:subscription, user: u, artist_page: artist) }

    described_class.new.perform(post.id)

    expect(SendBatchEmail).to have_received(:call).with(
      array_including(
        [{
          from: ENV["POSTMARK_FROM_EMAIL"],
          to: users.first.email,
          template_alias: "post-notification",
          template_model: {
            artist_name: artist.name,
            post_title: post.title,
            post_url: "https://ampled.com/artist/#{artist.slug}"
          }
        },
         {
           from: ENV["POSTMARK_FROM_EMAIL"],
           to: users.last.email,
           template_alias: "post-notification",
           template_model: {
             artist_name: artist.name,
             post_title: post.title,
             post_url: "https://ampled.com/artist/#{artist.slug}"
           }
         }]
      )
    )
  end
end
