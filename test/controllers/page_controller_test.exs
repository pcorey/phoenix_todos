defmodule PhoenixTodos.PageControllerTest do
  use PhoenixTodos.ConnCase

  test "GET /", %{conn: conn} do
    conn = get conn, "/"
    assert html_response(conn, 200) =~ "<div id=\"app\"></div>"
  end

  test "GET /signin", %{conn: conn} do
    conn = get conn, "/signin"
    assert html_response(conn, 200) =~ "<div id=\"app\"></div>"
  end
end
