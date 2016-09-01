defmodule PhoenixTodos.User do
  use PhoenixTodos.Web, :model

  schema "users" do
    field :email, :string
    field :password, :string, virtual: true
    field :encrypted_password, :string

    timestamps
  end

  @required_fields ~w(email password)
  @optional_fields ~w(encrypted_password)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_format(:email, ~r/@/)
    |> validate_length(:password, min: 5)
    |> unique_constraint(:email, message: "Email taken")
    |> put_encrypted_password
  end

  defp put_encrypted_password(changeset = %Ecto.Changeset{
    valid?: true,
    changes: %{password: password}
  }) do
    changeset
    |> put_change(:encrypted_password, Comeonin.Bcrypt.hashpwsalt(password))
  end
  defp put_encrypted_password(changeset), do: changeset
end
