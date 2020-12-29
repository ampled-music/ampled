json.id subscriber.id
json.status subscriber.status
json.name "#{subscriber.user.name} #{subscriber.user.last_name}"
json.location subscriber.user.city
json.supporter_since subscriber.created_at.strftime("%B %Y")
json.amount subscriber.plan.nominal_amount.fractional
