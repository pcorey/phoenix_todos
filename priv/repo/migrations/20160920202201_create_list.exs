defmodule PhoenixTodos.Repo.Migrations.CreateList do
  use Ecto.Migration

  def change do
    create table(:lists) do
      add :name, :string
      add :incomplete_count, :integer
      add :user_id, references(:users, on_delete: :delete_all)

      timestamps
    end
    create index(:lists, [:user_id])

  end
end
