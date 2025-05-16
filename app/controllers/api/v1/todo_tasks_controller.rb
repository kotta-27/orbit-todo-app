module Api
  module V1
    class TodoTasksController < ApplicationController
      def index
        todo_tasks = TodoTask.all
        render json: todo_tasks
      end

      def show
        todo_task = TodoTask.find(params[:id])
        render json: todo_task
      rescue ActiveRecord::RecordNotFound
        render json: { error: "TodoTask not found" }, status: :not_found
      end

      def create
        todo_task = TodoTask.new(todo_task_params)
        if todo_task.save
          render json: todo_task, status: :created
        else
          render json: { errors: todo_task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        todo_task = TodoTask.find(params[:id])
        if todo_task.update(todo_task_params)
          render json: todo_task
        else
          render json: { errors: todo_task.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "TodoTask not found" }, status: :not_found
      end

      def destroy
        todo_task = TodoTask.find(params[:id])
        todo_task.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: "TodoTask not found" }, status: :not_found
      end

      private

      def todo_task_params
        params.require(:todo_task).permit(:title, :description, :completed, :due_date, :category, :priority)
      end
    end
  end
end
