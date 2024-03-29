require "rails_helper"

describe PostNotificationJob, type: :job do
  it "sends emails to users subscribed to the artist page" do
    allow(SendBatchEmail).to receive(:call)
    users = create_list(:user, 2)
    artist = create(:artist_page)
    post = create(:post, artist_page: artist)
    users.each { |u| create(:subscription, user: u, artist_page: artist) }
    image = create(:image, imageable: artist)

    described_class.new.perform(post.id)

    expect(SendBatchEmail).to have_received(:call).with(
      array_including(
        [{
          from: ENV["POSTMARK_FROM_EMAIL"],
          to: users.first.email,
          template_alias: "post-notification",
          template_model: {
            artist_name: artist.name,
            artist_image: image.url,
            artist_color: artist.accent_color,
            post_title: post.title,
            post_body: post.body,
            post_btn_copy: "Check it out",
            post_id: post.id,
            post_url: "#{ENV["REACT_APP_API_URL"]}/artist/#{artist.slug}/post/#{post.id}"
          }
        },
         {
           from: ENV["POSTMARK_FROM_EMAIL"],
           to: users.last.email,
           template_alias: "post-notification",
           template_model: {
             artist_name: artist.name,
             artist_image: image.url,
             artist_color: artist.accent_color,
             post_title: post.title,
             post_body: post.body,
             post_btn_copy: "Check it out",
             post_id: post.id,
             post_url: "#{ENV["REACT_APP_API_URL"]}/artist/#{artist.slug}/post/#{post.id}"
           }
         }]
      )
    )
  end
end
