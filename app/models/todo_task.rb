class TodoTask < ApplicationRecord
  validates :title, presence: true
  validates :completed, inclusion: { in: [true, false] }
end
