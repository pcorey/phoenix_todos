defmodule PhoenixTodos.List do
  use PhoenixTodos.Web, :model

  alias PhoenixTodos.Repo

  @derive {Poison.Encoder, only: [
    :id,
    :name,
    :incomplete_count,
    :user_id,
    :todos
  ]}

  schema "lists" do
    field :name, :string
    field :incomplete_count, :integer
    belongs_to :user, PhoenixTodos.User
    has_many :todos, PhoenixTodos.Todo

    timestamps
  end

  @required_fields ~w(name incomplete_count)
  @optional_fields ~w(user_id)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def create(name, suffix) do
    PhoenixTodos.List
    |> findByName("#{name} #{suffix}")
    |> Repo.all
    |> handle_create_find(name, suffix)
  end
  def create, do: create("List", "A")

  def handle_create_find([], name, suffix) do
    changeset(%PhoenixTodos.List{}, %{
      name: "#{name} #{suffix}",
      incomplete_count: 0
    })
    |> Repo.insert!
  end

  def handle_create_find(_, name, suffix) do
    [char] = to_char_list suffix
    create(name, to_string [char + 1])
  end

  def add_task(id, text) do
    list = Repo.get(PhoenixTodos.List, id)

    Ecto.build_assoc(list, :todos, text: text)
    |> Repo.insert!

    list
    |> PhoenixTodos.List.changeset(%{
      incomplete_count: list.incomplete_count + 1
    })
    |> Repo.update!
  end

  def update_name(id, name) do
    Repo.get(PhoenixTodos.List, id)
    |> changeset(%{
      name: name
    })
    |> Repo.update!
  end

  def delete(id) do
    Repo.get(PhoenixTodos.List, id)
    |> Repo.delete!
  end

  def make_private(user_id, id) do
    Repo.get(PhoenixTodos.List, id)
    |> changeset(%{
      user_id: user_id
    })
    |> Repo.update!
  end

  def make_public(id) do
    Repo.get(PhoenixTodos.List, id)
    |> changeset(%{
      user_id: nil
    })
    |> Repo.update!
  end

  def delete_todo(todo_id) do
    todo = Repo.get(PhoenixTodos.Todo, todo_id)
    |> Repo.preload(:list)

    Repo.delete!(todo)

    todo.list
  end

  def set_checked_status(todo_id, checked) do
    todo = Repo.get(PhoenixTodos.Todo, todo_id)
    |> Repo.preload(:list)
    list = todo.list
    inc = if (checked), do: - 1, else: 1

    todo
    |> PhoenixTodos.Todo.changeset(%{
      checked: checked
    })
    |> Repo.update!

    list
    |> PhoenixTodos.List.changeset(%{
      incomplete_count: list.incomplete_count + inc
    })
    |> Repo.update!
  end

  def all(query, nil) do
    from list in query,
    where: is_nil(list.user_id),
    order_by: list.inserted_at,
    preload: [:todos]
  end

  def all(query, user_id) do
    from list in query,
    where: ^user_id == list.user_id or is_nil(list.user_id),
    order_by: list.inserted_at,
    preload: [:todos]
  end

  def findByName(query, name) do
    from list in query,
    where: list.name == ^name
  end

  def canView?(_, %{user_id: nil}), do: true
  def canView?(user_id, %{user_id: user_id}), do: true
  def canView?(_, _), do: false

end
