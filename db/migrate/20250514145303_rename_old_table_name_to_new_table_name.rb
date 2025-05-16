class RenameOldTableNameToNewTableName < ActiveRecord::Migration[7.2]
  def change
    rename_table :habits, :habit_tasks
    rename_table :todos, :todo_tasks
  end
end
