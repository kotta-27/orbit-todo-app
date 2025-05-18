class HabitTask < ApplicationRecord
  validates :title, presence: true
  validates :completed, inclusion: { in: [true, false] }
  validates :importance, inclusion: { in: 1..3 }
end
