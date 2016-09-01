defmodule PhoenixTodos.UserTest do
  use PhoenixTodos.ModelCase

  alias PhoenixTodos.User

  @valid_attrs %{email: "user@example.com", password: "password"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
