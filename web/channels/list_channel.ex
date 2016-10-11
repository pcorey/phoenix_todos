defmodule PhoenixTodos.ListChannel do
  use Phoenix.Channel
  alias PhoenixTodos.{Repo, List}

  def join("lists.public", _message, socket) do
    lists = List |> List.public |> Repo.all
    {:ok, lists, socket}
  end

  def handle_in("create_list", _, socket) do
    list = List.create
    |> Repo.preload(:todos)

    broadcast! socket, "add_list", list

    {:reply, {:ok, list}, socket}
  end

end
