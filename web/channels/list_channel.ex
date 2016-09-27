defmodule PhoenixTodos.ListChannel do
  use Phoenix.Channel
  alias PhoenixTodos.{Repo, List}

  def join("lists.public", _message, socket) do
    lists = List |> List.public |> Repo.all
    {:ok, lists, socket}
  end

end
