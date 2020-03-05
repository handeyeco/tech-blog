import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"

import CreativeCommons from "../../content/assets/creative-commons.svg";

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer style={{ display: 'flex', alignItems: 'center', fontSize: '0.8em' }}>
        <CreativeCommons style={{ height: '1rem', width: '1rem' }} />
        &nbsp;
        {new Date().getFullYear()}
        &nbsp;
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">BY-NC-SA.</a>
        &nbsp;
        See a typo?
        &nbsp;
        <a href="https://github.com/handeyeco/tech-blog">File a pull request or issue.</a>
      </footer>
    </div>
  )
}

export default Layout
