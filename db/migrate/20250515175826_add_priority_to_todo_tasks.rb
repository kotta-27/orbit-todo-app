class AddPriorityToTodoTasks < ActiveRecord::Migration[7.2]
  def change
    add_column :todo_tasks, :priority, :integer, default: 3
  end
end
