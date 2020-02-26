/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author
          social {
            twitter
            github
          }
        }
      }
    }
  `)

  const { author, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <p>
        Written by {author} - community organizer, artist, and developer in Austin, TX.
        {` `}
        I'm on <a href={`https://twitter.com/${social.twitter}`}>
          Twitter
        </a> and <a href={`https://github.com/${social.twitter}`}>
          Github
        </a>.
      </p>
    </div>
  )
}

export default Bio
