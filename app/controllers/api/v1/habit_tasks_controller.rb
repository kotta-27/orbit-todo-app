module Api
  module V1
    class HabitTasksController < ApplicationController
      def index
        habit_tasks = HabitTask.all
        render json: habit_tasks
      end

      def show
        habit_task = HabitTask.find(params[:id])
        render json: habit_task
      rescue ActiveRecord::RecordNotFound
        render json: { error: "HabitTask not found" }, status: :not_found
      end

      def create
        habit_task = HabitTask.new(habit_task_params)
        if habit_task.save
          render json: habit_task, status: :created
        else
          render json: { errors: habit_task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        habit_task = HabitTask.find(params[:id])
        if habit_task.update(habit_task_params)
          render json: habit_task
        else
          render json: { errors: habit_task.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "HabitTask not found" }, status: :not_found
      end

      def destroy
        habit_task = HabitTask.find(params[:id])
        habit_task.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: "HabitTask not found" }, status: :not_found
      end

      private

      def habit_task_params
        params.require(:habit_task).permit(:title, :description, :completed, :importance)
      end
    end
  end
end
