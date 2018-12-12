class UploadsController < ApplicationController

  def signer
    @signer ||= Aws::S3::Presigner.new
  end

  def sign_file
    # binding.pry
    key = SecureRandom.uuid
    url = signer.presigned_url(:put_object,
                          bucket: 'ampled-test',
                          key: key,
                          acl: 'public-read',
                          content_type: params["contentType"]
    )

    render json: { signedUrl: url, key: key}
  end

  def playable_url
    url = signer.presigned_url(:get_object, bucket: "ampled-test", key: params[:key])
    render json: { signedUrl: url }
  end

end
