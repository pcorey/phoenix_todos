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

  def handle_in("add_task", %{
    "list_id" => list_id,
    "text" => text
  }, socket) do
    list = List.add_task(list_id, text)
    |> Repo.preload(:todos)

    broadcast! socket, "update_list", list

    {:noreply, socket}
  end

  def handle_in("set_checked_status", %{
      "todo_id" => todo_id,
      "status" => status
    }, socket) do
    list = List.set_checked_status(todo_id, status)
    |> Repo.preload(:todos)

    broadcast! socket, "update_list", list

    {:noreply, socket}
  end

end
