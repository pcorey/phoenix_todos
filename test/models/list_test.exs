defmodule PhoenixTodos.ListTest do
  use PhoenixTodos.ModelCase

  alias PhoenixTodos.List

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
end
