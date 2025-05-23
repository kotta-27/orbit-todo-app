# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_05_17_131742) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "daily_tasks", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.boolean "completed"
    t.string "days"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "habit_tasks", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.boolean "completed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "importance"
  end

  create_table "todo_tasks", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.boolean "completed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "due_date"
    t.string "category"
    t.integer "priority", default: 3
  end
end
