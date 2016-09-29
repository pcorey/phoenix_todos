defmodule PhoenixTodos.Todo do
  use PhoenixTodos.Web, :model

  @derive {Poison.Encoder, only: [
    :id,
    :text,
    :checked
  ]}

  schema "todos" do
    field :text, :string
    field :checked, :boolean, default: false
    belongs_to :list, PhoenixTodos.List

    timestamps
  end

  @required_fields ~w(text checked)
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
end
