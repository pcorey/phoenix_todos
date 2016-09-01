defmodule PhoenixTodos.UserController do
  use PhoenixTodos.Web, :controller

  alias PhoenixTodos.{User, Repo}

  def create(conn, %{"user" => params}) do
    User.changeset(%User{}, params)
    |> Repo.insert
    |> handle_insert(conn)
  end

  defp handle_insert({:ok, user}, conn) do
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)
    conn
    |> put_status(:created)
    |> render(PhoenixTodos.ApiView, "data.json", data: %{jwt: jwt, user: user})
  end
  defp handle_insert({:error, changeset}, conn) do
    conn
    |> put_status(:unprocessable_entity)
    |> render(PhoenixTodos.ApiView, "error.json", error: changeset)
  end
end
