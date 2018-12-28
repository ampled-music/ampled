class UploadsController < ApplicationController
  def signer
    @signer ||= Aws::S3::Presigner.new
  end

  def sign_file
    # binding.pry
    puts content_type
    puts file_extension
    key = "#{SecureRandom.uuid}.#{file_extension}"
    # redirect_to status: 404 unless file_extension.present?
    url = signer.presigned_url(:put_object,
                               bucket: 'ampled-test',
                               key: key,
                               acl: 'public-read',
                               content_type: content_type)

    render json: { signedUrl: url, key: key }
  end

  def playable_url
    url = signer.presigned_url(:get_object, bucket: "ampled-test", key: params[:key])
    render json: { signedUrl: url }
  end

  protected

  def file_extension
    {
      "audio/mp3" => 'mp3'
    }[content_type]
  end

  def content_type
    params["contentType"]
  end
end
