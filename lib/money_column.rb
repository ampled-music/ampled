module MoneyColumn
  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods
    def money_column(*subunit_columns, currency_column:)
      subunit_columns.each do |subunit_column|
        define_method(subunit_column) do
          subunit_amount = read_attribute(subunit_column)
          subunit_amount.nil? ? nil : Money.new(subunit_amount, read_attribute(currency_column))
        end
      end
    end
  end
end
