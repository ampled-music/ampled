module Devise
  module Strategies
    class JsonWebToken < Base
      def valid?
        bearer_header.present?
      end

      def authenticate!
        return if no_claims_or_no_claimed_user_id

        success! User.find_by(id: claims['user_id'])
      end

      protected

      def bearer_header
        request.headers["Authorization"]&.to_s
      end

      def no_claims_or_no_claimed_user_id
        !claims || !claims.has_key?("user_id")
      end

      private

      def claims
        strategy, token = bearer_header.split(" ")

        return nil if (strategy || "").downcase != "bearer"

        begin
          return JWTWrapper.decode(token)
        rescue StandardError
          nil
        end
      end
    end
  end
end