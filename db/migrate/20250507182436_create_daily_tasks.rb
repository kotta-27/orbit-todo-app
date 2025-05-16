class CreateDailyTasks < ActiveRecord::Migration[7.2]
  def change
    create_table :daily_tasks do |t|
      t.string :title
      t.text :description
      t.boolean :completed
      t.string :days

      t.timestamps
    end
  end
end
