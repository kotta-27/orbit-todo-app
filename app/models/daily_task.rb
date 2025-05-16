class DailyTask < ApplicationRecord
  validates :title, presence: true
  validates :completed, inclusion: { in: [true, false] }
  validates :days, presence: true
end
