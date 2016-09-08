defmodule PhoenixTodos.SessionController do
  use PhoenixTodos.Web, :controller

  alias PhoenixTodos.{User, Repo}

  def create(conn, %{"email" => email, "password" => password}) do
    user = get_user(email)
    user
    |> check_password(password)
    |> handle_check_password(conn, user)
  end

  defp get_user(email) do
    Repo.get_by(User, email: String.downcase(email))
  end

  defp check_password(nil, _password), do: false
  defp check_password(user, password) do
    Comeonin.Bcrypt.checkpw(password, user.encrypted_password)
  end

  defp handle_check_password(true, conn, user) do
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)
    conn
    |> put_status(:created)
    |> render(PhoenixTodos.ApiView, "data.json", data: %{jwt: jwt, user: user})
  end
  defp handle_check_password(false, conn, _user) do
    conn
    |> put_status(:unprocessable_entity)
    |> render(PhoenixTodos.ApiView, "error.json", error: "Unable to authenticate")
  end

end
