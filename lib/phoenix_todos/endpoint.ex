defmodule PhoenixTodos.Endpoint do
  use Phoenix.Endpoint, otp_app: :phoenix_todos

  socket "/socket", PhoenixTodos.UserSocket

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/", from: :phoenix_todos, gzip: false,
    only: ~w(css font js icon favicon.ico favicon.png apple-touch-icon-precomposed.png logo-todos.svg)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Plug.Session,
    store: :cookie,
    key: "_phoenix_todos_key",
    signing_salt: "ERnuFywo"

  plug PhoenixTodos.Router
end
