module Api
  module V1
    class DailyTasksController < ApplicationController
      def index
        daily_tasks = DailyTask.all
        render json: daily_tasks
      end

      def show
        daily_task = DailyTask.find(params[:id])
        render json: daily_task
      rescue ActiveRecord::RecordNotFound
        render json: { error: "DailyTask not found" }, status: :not_found
      end

      def create
        daily_task = DailyTask.new(daily_task_params)
        if daily_task.save
          render json: daily_task, status: :created
        else
          render json: { errors: daily_task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        daily_task = DailyTask.find(params[:id])
        if daily_task.update(daily_task_params)
          render json: daily_task
        else
          render json: { errors: daily_task.errors.full_messages }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "DailyTask not found" }, status: :not_found
      end

      def destroy
        daily_task = DailyTask.find(params[:id])
        daily_task.destroy
        head :no_content
      rescue ActiveRecord::RecordNotFound
        render json: { error: "DailyTask not found" }, status: :not_found
      end

      private

      def daily_task_params
        params.require(:daily_task).permit(:title, :description, :completed, :days)
      end
    end
  end
end
