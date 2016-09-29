defmodule PhoenixTodos.List do
  use PhoenixTodos.Web, :model

  @derive {Poison.Encoder, only: [
    :id,
    :name,
    :incomplete_count,
    :user_id,
    :todos
  ]}

  schema "lists" do
    field :name, :string
    field :incomplete_count, :integer
    belongs_to :user, PhoenixTodos.User
    has_many :todos, PhoenixTodos.Todo

    timestamps
  end

  @required_fields ~w(name incomplete_count)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def public(query) do
    from list in query,
    where: is_nil(list.user_id),
    preload: [:todos]
  end

end
