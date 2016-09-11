defmodule PhoenixTodos.SessionControllerTest do
  use PhoenixTodos.ConnCase

  alias PhoenixTodos.{User, Repo}

  defp create_user(email, password) do
    %User{}
    |> User.changeset(%{
          email: email,
          password: password
       })
    |> Repo.insert!
  end

  defp create_session(conn, email, password) do
    post(conn, "/api/sessions", email: email, password: password)
    |> json_response(201)
  end

  test "creates a session", %{conn: conn} do
    create_user("email@example.com", "password")

    response = create_session(conn, "email@example.com", "password")

    assert response["jwt"]
    assert response["user"]["id"]
    assert response["user"]["email"]
  end

  test "fails authorization", %{conn: conn} do
    conn = post conn, "/api/sessions", email: "email@example.com", password: "wrong"
    %{
      "error" => "Unable to authenticate"
    } = json_response(conn, 422)
  end

  test "deletes a session", %{conn: conn} do
    create_user("email@example.com", "password")
    session_response = create_session(conn, "email@example.com", "password")

    conn
    |> put_req_header("authorization", session_response["jwt"])
    |> delete("/api/sessions")
    |> json_response(200)
  end

end
