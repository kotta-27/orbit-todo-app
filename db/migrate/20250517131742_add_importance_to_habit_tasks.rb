class AddImportanceToHabitTasks < ActiveRecord::Migration[7.2]
  def change
    add_column :habit_tasks, :importance, :integer
  end
end
