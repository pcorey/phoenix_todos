defmodule PhoenixTodos.UserTest do
  use PhoenixTodos.ModelCase

  alias PhoenixTodos.{User, Repo}

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

  test "changeset with invalid email" do
    changeset = User.changeset(%User{}, %{
      email: "no_at_symbol",
      password: "password"
    })
    refute changeset.valid?
  end

  test "changeset with short password" do
    changeset = User.changeset(%User{}, %{
      email: "email@example.com",
      password: "pass"
    })
    refute changeset.valid?
  end

  test "changeset with non-unique email" do
    User.changeset(%User{}, %{
      email: "email@example.com",
      password: "password"
    })
    |> Repo.insert!

    assert {:error, _} = User.changeset(%User{}, %{
      email: "email@example.com",
      password: "password"
    })
    |> Repo.insert
  end
end
