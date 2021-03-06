defmodule PhoenixTodos.ListChannel do
  use Phoenix.Channel
  alias PhoenixTodos.{Repo, List}

  intercept ["update_list"]

  defp get_user_id(socket) do
    case Guardian.Phoenix.Socket.current_resource(socket) do
      user ->
        user.id
      _ ->
        nil
    end
  end

  def join("lists", _message, socket) do
    lists = List |> List.all(get_user_id(socket)) |> Repo.all
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

  def handle_in("update_name", %{
    "list_id" => list_id,
    "name" => name
  }, socket) do
    list = List.update_name(list_id, name)
    |> Repo.preload(:todos)

    broadcast! socket, "update_list", list

    {:noreply, socket}
  end

  def handle_in("delete_list", %{
    "list_id" => list_id,
  }, socket) do
    list = List.delete(list_id)
    |> Repo.preload(:todos)

    broadcast! socket, "remove_list", list

    {:noreply, socket}
  end

  def handle_in("make_private", %{
    "list_id" => list_id,
  }, socket) do
    list = get_user_id(socket)
    |> List.make_private(list_id)
    |> Repo.preload(:todos)

    broadcast! socket, "update_list", list

    {:noreply, socket}
  end

  def handle_in("make_public", %{
    "list_id" => list_id,
  }, socket) do
    list = List.make_public(list_id)
    |> Repo.preload(:todos)

    broadcast! socket, "update_list", list

    {:noreply, socket}
  end

  def handle_in("delete_todo", %{
    "todo_id" => todo_id,
  }, socket) do
    list = List.delete_todo(todo_id)
    |> Repo.preload(:todos)

    broadcast! socket, "update_list", list

    {:noreply, socket}
  end

  def handle_out("update_list", list, socket) do
    case List.canView?(get_user_id(socket), list) do
      true ->
        push(socket, "update_list", list)
      false ->
        push(socket, "remove_list", list)
    end
    {:noreply, socket}
  end

end
