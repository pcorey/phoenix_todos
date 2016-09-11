defmodule PhoenixTodos.Router do
  use PhoenixTodos.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/api", PhoenixTodos do
    pipe_through :api

    post "/users", UserController, :create

    post "/sessions", SessionController, :create
    delete "/sessions", SessionController, :delete
  end

  scope "/", PhoenixTodos do
    pipe_through :browser # Use the default browser stack

    get "/*page", PageController, :index
  end

end
