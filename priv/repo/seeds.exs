# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs

alias PhoenixTodos.{Repo, List}

[
  %{
    name: "Meteor Principles",
    items: [
      "Data on the Wire",
      "One Language",
      "Database Everywhere",
      "Latency Compensation",
      "Full Stack Reactivity",
      "Embrace the Ecosystem",
      "Simplicity Equals Productivity",
    ]
  },
  %{
    name: "Languages",
    items: [
      "Lisp",
      "C",
      "C++",
      "Python",
      "Ruby",
      "JavaScript",
      "Scala",
      "Erlang",
      "6502 Assembly",
    ]
  },
  %{
    name: "Favorite Scientists",
    items: [
      "Ada Lovelace",
      "Grace Hopper",
      "Marie Curie",
      "Carl Friedrich Gauss",
      "Nikola Tesla",
      "Claude Shannon",
    ]
  }
]
|> Enum.map(fn data ->
  list = Repo.insert!(%List{
    name: data.name,
    incomplete_count: length(data.items)
  })
  Enum.map(data.items, fn item ->
    Ecto.build_assoc(list, :todos, text: item)
    |> Repo.insert!
  end)
end)
