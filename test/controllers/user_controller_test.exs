defmodule PhoenixTodos.UserControllerTest do
  use PhoenixTodos.ConnCase

  test "creates a user", %{conn: conn} do
    conn = post conn, "/api/users", user: %{
      email: "email@example.com",
      password: "password"
    }
    %{
      "jwt" => _,
      "user" => %{
        "id" => _,
        "email" => "email@example.com"
      }
    } = json_response(conn, 201)
  end

  test "fails user validation", %{conn: conn} do
    conn = post conn, "/api/users", user: %{
      email: "email@example.com",
      password: "pass"
    }
    %{
      "errors" => [
        %{
          "password" => "should be at least 5 character(s)"
        }
      ]
    } = json_response(conn, 422)
  end
end
