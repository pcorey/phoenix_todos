defmodule PhoenixTodos.SessionControllerTest do
  use PhoenixTodos.ConnCase

  alias PhoenixTodos.{User, Repo}

  test "creates a session", %{conn: conn} do
    %User{}
    |> User.changeset(%{
      email: "email@example.com",
      password: "password"
    })
    |> Repo.insert!

    conn = post conn, "/api/sessions", email: "email@example.com", password: "password"
    %{
      "jwt" => _jwt,
      "user" => %{
        "id" => _id,
        "email" => "email@example.com"
      }
    } = json_response(conn, 201)
  end

  test "fails authorization", %{conn: conn} do
    conn = post conn, "/api/sessions", email: "email@example.com", password: "wrong"
    %{
      "error" => "Unable to authenticate"
    } = json_response(conn, 422)
  end
end
