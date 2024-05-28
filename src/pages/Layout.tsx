import { Link, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <nav className="hidden">
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/game">游戏</Link>
          </li>
          <li>
            <Link to="/config">配置</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}

export default Layout
