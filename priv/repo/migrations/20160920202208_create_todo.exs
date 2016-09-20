defmodule PhoenixTodos.Repo.Migrations.CreateTodo do
  use Ecto.Migration

  def change do
    create table(:todos) do
      add :text, :string
      add :checked, :boolean, default: false
      add :list_id, references(:lists, on_delete: :delete_all)

      timestamps
    end
    create index(:todos, [:list_id])

  end
end
