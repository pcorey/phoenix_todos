defmodule PhoenixTodos.GuardianSerializerTest do
  use ExUnit.Case, async: true

  alias PhoenixTodos.{User, Repo, GuardianSerializer}

  setup_all do
    user = User.changeset(%User{}, %{
          email: "email@example.com",
          password: "password"
    })
    |> Repo.insert!

    {:ok, user: user}
  end

  test "generates token for valid user", %{user: user} do
    assert {:ok, _} = GuardianSerializer.for_token(user)
  end

  test "generates error for invalid user", %{} do
    assert {:error, "Invalid user"} = GuardianSerializer.for_token(%{})
  end

  test "finds user from valid token", %{user: user} do
    {:ok, token} = GuardianSerializer.for_token(user)
    assert {:ok, _} = GuardianSerializer.from_token(token)
  end

  test "doesn't find user from invalid token", %{} do
    assert {:error, "Invalid user"} = GuardianSerializer.from_token("bad")
  end
end
