# This module is intended to be mixed-in with classes that inherit from ActiveRecord::Base and store money values.
# The module defines a class method, money_column, which overrides the default accessors columns storing currency
# subunits (eg. USD cents or GBP pence) to instead return a Money object.
# For an example, check out the Plan model.
module MoneyColumn
  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods
    # Overrides the default accessor for the provided subumit_columns to return a Money object with currency
    # set by the provided currency_column. A subunit is the lowest division of a currency that exists, for
    # USD it is cents, for GBP it is pence, and for JPY it is yen (which is also the base unit).
    #
    # @param [Symbol[]] subunit_columns - The names of columns storing an integer representing subunits
    # @param [Symbol] currency_column - The name of a column storing ISO 4217 currency code
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
