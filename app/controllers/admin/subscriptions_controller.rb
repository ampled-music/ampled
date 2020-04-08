module Admin
  class SubscriptionsController < Admin::ApplicationController
    def destroy
      sub = Subscription.find(params[:id])
      sub.cancel!
      redirect_to action: :index
    end
  end
end
