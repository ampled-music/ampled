class NewCommentNotificationJob
  include Sidekiq::Worker
  attr_accessor :comment, :commenter, :post, :artist

  def perform(comment_id)
    @comment = Comment.find(comment_id)
    return if comment.blank?

    @commenter = comment.user
    @post = comment.post
    @artist = post.artist_page

    post_link = "#{ENV["REACT_APP_API_URL"]}/artist/#{artist.slug}/post/#{post.id}"
    comment_text = comment.text[0...20]

    artist.owners.map do |owner|
      Notification.create!(user: owner, text: "#{commenter.name} commented on \"#{post.title}\": \"#{comment_text}\"",
                           link: post_link)
    end

    SendBatchEmail.call(messages)
  end

  private

  def messages
    artist.owners.map do |owner|
      {
        from: ENV["POSTMARK_FROM_EMAIL"],
        to: owner.email,
        template_alias: "new-comment",
        template_model: {
          supporter_name: commenter.name,
          post_title: post.title,
          comment_text: comment.text
        }
      }
    end
  end
end
