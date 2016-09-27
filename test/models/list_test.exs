defmodule PhoenixTodos.ListTest do
  use PhoenixTodos.ModelCase

  alias PhoenixTodos.List
  alias PhoenixTodos.User
  alias PhoenixTodos.Repo

  @valid_attrs %{incomplete_count: 42, name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = List.changeset(%List{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = List.changeset(%List{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "public" do
    user = User.changeset(%User{}, %{
      email: "user@example.com",
      password: "password"
    }) |> Repo.insert!
    public = Repo.insert!(%List{
      name: "public",
      incomplete_count: 1
    })
    Repo.insert!(%List{
      name: "private",
      incomplete_count: 1,
      user_id: user.id
    })

    lists = List |> List.public |> Repo.all

    assert lists == [public]
  end
end
