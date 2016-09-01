defmodule PhoenixTodos.ApiView do
  use PhoenixTodos.Web, :view

  def render("data.json", %{data: data}) do
    data
  end

  def render("error.json", %{error: changeset = %Ecto.Changeset{}}) do
    errors = Enum.map(changeset.errors, fn {field, detail} ->
      %{} |> Map.put(field, render_detail(detail))
    end)

    %{ errors: errors }
  end

  def render("error.json", %{error: error}), do: %{error: error}

  def render("error.json", %{}), do: %{}

  defp render_detail({message, values}) do
    Enum.reduce(values, message, fn {k, v}, acc -> String.replace(acc, "%{#{k}}", to_string(v)) end)
  end

  defp render_detail(message) do
    message
  end

end
